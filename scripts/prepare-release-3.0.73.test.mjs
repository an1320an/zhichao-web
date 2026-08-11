import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import {
  APPROVAL,
  prepareSources,
  RELEASE_BUILD,
  RELEASE_VERSION,
  validateReleaseMetadata,
} from "./prepare-release-3.0.73.mjs";

const root = path.resolve(import.meta.dirname, "..");
const scriptPath = path.join(root, "scripts", "prepare-release-3.0.73.mjs");

function baselineSources() {
  return {
    app: fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8"),
    download: fs.readFileSync(path.join(root, "public", "download", "index.html"), "utf8"),
    audit: fs.readFileSync(path.join(root, "scripts", "audit-public-copy.mjs"), "utf8"),
  };
}

function exactMetadata(overrides = {}) {
  return {
    apkBytes: 123456789,
    apkHash: "a".repeat(64),
    apkMegabytes: "117.7",
    releasedAt: {
      iso: "2026-08-12T09:07:00+08:00",
      date: "2026-08-12",
      label: "2026 年 8 月 12 日 09:07（北京时间）",
    },
    ...overrides,
  };
}

test("prepares one 3.0.73 release from the published 3.0.72 baseline without writing", () => {
  const sources = baselineSources();
  const prepared = prepareSources(sources, exactMetadata());

  assert.equal(RELEASE_VERSION, "3.0.73");
  assert.equal(RELEASE_BUILD, 110);
  assert.equal(APPROVAL, "PREPARE_3_0_73_AFTER_SIGNED_APK_VERIFICATION");
  for (const phrase of [
    "const APP_VERSION = '3.0.73'",
    "知潮 3.0.73 新功能",
    "知潮 3.0.73：首页找功能、刷卡提示与全局主题升级",
    "问朵朵·找功能",
    "中文释义",
    "普通主题",
    "六套限定主题",
    "1000 金币",
    "成就解锁",
  ]) assert.ok(prepared.app.includes(phrase), phrase);
  assert.equal(prepared.app.split("知潮 3.0.73：首页找功能、刷卡提示与全局主题升级").length - 1, 1);
  for (const phrase of [
    "const APP_VERSION = '3.0.73'",
    "知潮 3.0.73 新功能",
    "首页找功能",
    "中文释义",
    "普通主题",
    "六套限定主题",
    "1000 金币",
    "成就解锁",
    "知潮 3.0.73：首页找功能、刷卡提示与全局主题升级",
    "问朵朵·找功能",
    "访问知潮官网",
  ]) assert.ok(prepared.app.includes(phrase), `prepared App audit input: ${phrase}`);

  for (const phrase of [
    'content="123456789"',
    `content="${"a".repeat(64).toUpperCase()}"`,
    "117.7 MB",
    "知潮 3.0.73",
    "versionCode 110",
    "2026 年 8 月 12 日 09:07（北京时间）",
    'class="website-link" href="/"',
    "访问知潮官网",
    "首页找功能",
    "中文释义",
    "普通主题",
    "六套限定主题",
    "1000 金币",
    "成就解锁",
  ]) assert.ok(prepared.download.includes(phrase), phrase);
  assert.match(prepared.download, /<p class="release-time">最新更新：<time datetime="2026-08-12T09:07:00\+08:00">2026 年 8 月 12 日 09:07（北京时间）<\/time><\/p>/u);
  for (const phrase of [
    "3.0.73 更新日志已准备",
    "3.0.72 更新日志已准备",
    "3.0.73 新功能引导与下载身份一致",
    "下载确认页保留 3.0.73 精确包身份",
  ]) assert.ok(prepared.audit.includes(phrase), phrase);

  assert.deepEqual(prepareSources(prepared, exactMetadata()), prepared);
  assert.equal(fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8"), sources.app);
  assert.equal(fs.readFileSync(path.join(root, "public", "download", "index.html"), "utf8"), sources.download);
});

test("requires exact APK bytes, lowercase SHA-256 and a valid Beijing release minute", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-release-73-"));
  const apkPath = path.join(directory, "release.apk");
  const bytes = Buffer.from("signed-apk-fixture-3.0.73", "utf8");
  fs.writeFileSync(apkPath, bytes);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const valid = {
    RELEASE_3_0_73_APK_PATH: apkPath,
    RELEASE_3_0_73_APK_SHA256: sha256,
    RELEASE_3_0_73_APK_BYTES: String(bytes.length),
    RELEASE_3_0_73_RELEASED_AT: "2026-08-12T09:07:00+08:00",
  };
  try {
    const metadata = validateReleaseMetadata(valid);
    assert.equal(metadata.apkHash, sha256);
    assert.equal(metadata.apkBytes, bytes.length);
    assert.equal(metadata.releasedAt.label, "2026 年 8 月 12 日 09:07（北京时间）");

    for (const key of Object.keys(valid)) {
      const missing = { ...valid };
      delete missing[key];
      assert.throws(() => validateReleaseMetadata(missing), new RegExp(`${key} is required`, "u"));
    }
    assert.throws(() => validateReleaseMetadata({ ...valid, RELEASE_3_0_73_APK_SHA256: sha256.toUpperCase() }), /exact lowercase digest/u);
    assert.throws(() => validateReleaseMetadata({ ...valid, RELEASE_3_0_73_APK_BYTES: String(bytes.length + 1) }), /byte count mismatch/u);
    assert.throws(() => validateReleaseMetadata({ ...valid, RELEASE_3_0_73_RELEASED_AT: "2026-08-12T09:07:30+08:00" }), /exact \+08:00 minute timestamp/u);
    assert.throws(() => validateReleaseMetadata({ ...valid, RELEASE_3_0_73_RELEASED_AT: "2026-02-30T09:07:00+08:00" }), /valid Beijing calendar minute/u);
    assert.throws(() => validateReleaseMetadata({ ...valid, RELEASE_3_0_73_RELEASED_AT: "2026-08-12T01:07:00Z" }), /exact \+08:00 minute timestamp/u);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("preview is read-only and apply fails closed without the exact approval phrase", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-release-73-cli-"));
  const apkPath = path.join(directory, "release.apk");
  const bytes = Buffer.from("signed-apk-cli-fixture-3.0.73", "utf8");
  fs.writeFileSync(apkPath, bytes);
  const sourceBefore = baselineSources();
  const environment = {
    ...process.env,
    RELEASE_3_0_73_APK_PATH: apkPath,
    RELEASE_3_0_73_APK_SHA256: createHash("sha256").update(bytes).digest("hex"),
    RELEASE_3_0_73_APK_BYTES: String(bytes.length),
    RELEASE_3_0_73_RELEASED_AT: "2026-08-12T09:07:00+08:00",
  };
  try {
    const preview = spawnSync(process.execPath, [scriptPath], {
      cwd: root,
      encoding: "utf8",
      env: environment,
    });
    assert.equal(preview.status, 0, preview.stderr);
    assert.match(preview.stdout, /MODE=preview/u);
    assert.match(preview.stdout, /VERSION=3\.0\.73/u);

    const applyWithoutApproval = spawnSync(process.execPath, [scriptPath, "--apply"], {
      cwd: root,
      encoding: "utf8",
      env: environment,
    });
    assert.notEqual(applyWithoutApproval.status, 0);
    assert.match(applyWithoutApproval.stderr, /apply requires PREPARE_RELEASE_3_0_73_APPROVED/u);

    const applyWithoutIdentity = spawnSync(process.execPath, [scriptPath, "--apply"], {
      cwd: root,
      encoding: "utf8",
      env: {
        ...process.env,
        PREPARE_RELEASE_3_0_73_APPROVED: APPROVAL,
        RELEASE_3_0_73_APK_PATH: "",
        RELEASE_3_0_73_APK_SHA256: "",
        RELEASE_3_0_73_APK_BYTES: "",
        RELEASE_3_0_73_RELEASED_AT: "",
      },
    });
    assert.notEqual(applyWithoutIdentity.status, 0);
    assert.match(applyWithoutIdentity.stderr, /RELEASE_3_0_73_APK_PATH is required/u);
    assert.deepEqual(baselineSources(), sourceBefore);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
