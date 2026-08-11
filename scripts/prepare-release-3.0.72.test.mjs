import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  prepareSources,
  RELEASE_BUILD,
  RELEASE_VERSION,
  validateReleaseMetadata,
} from "./prepare-release-3.0.72.mjs";

const root = path.resolve(import.meta.dirname, "..");

test("prepares all public 3.0.72 identities in memory without fake APK values", () => {
  const sources = {
    app: fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8"),
    download: fs.readFileSync(path.join(root, "public", "download", "index.html"), "utf8"),
    audit: fs.readFileSync(path.join(root, "scripts", "audit-public-copy.mjs"), "utf8"),
  };
  const metadata = {
    apkBytes: 123456789,
    apkHash: "a".repeat(64),
    apkMegabytes: "117.7",
    releasedAt: {
      iso: "2026-08-11T20:05:00+08:00",
      date: "2026-08-11",
      label: "2026 年 8 月 11 日 20:05（北京时间）",
    },
  };
  const prepared = prepareSources(sources, metadata);

  assert.equal(RELEASE_VERSION, "3.0.72");
  assert.equal(RELEASE_BUILD, 109);
  for (const phrase of [
    "const APP_VERSION = '3.0.72'",
    "知潮 3.0.72 新功能",
    "25 分钟模拟考试",
    "九张图片",
    "医疗内容改为分级提示",
  ]) assert.ok(prepared.app.includes(phrase), phrase);
  for (const phrase of [
    'content="123456789"',
    `content="${"a".repeat(64).toUpperCase()}"`,
    "117.7 MB",
    "2026 年 8 月 11 日 20:05（北京时间）",
    'class="website-link" href="/"',
    "访问知潮官网",
  ]) assert.ok(prepared.download.includes(phrase), phrase);
  assert.ok(prepared.audit.includes("3.0.72 精确包身份"));
  assert.equal(fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8"), sources.app);
});

test("accepts only an exact signed APK identity and Beijing release minute", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-release-72-"));
  const apkPath = path.join(directory, "release.apk");
  const bytes = Buffer.from("signed-apk-fixture", "utf8");
  fs.writeFileSync(apkPath, bytes);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  try {
    const metadata = validateReleaseMetadata({
      RELEASE_3_0_72_APK_PATH: apkPath,
      RELEASE_3_0_72_APK_SHA256: sha256,
      RELEASE_3_0_72_APK_BYTES: String(bytes.length),
      RELEASE_3_0_72_RELEASED_AT: "2026-08-11T20:05:00+08:00",
    });
    assert.equal(metadata.apkHash, sha256);
    assert.equal(metadata.apkBytes, bytes.length);
    assert.equal(metadata.releasedAt.label, "2026 年 8 月 11 日 20:05（北京时间）");

    assert.throws(() => validateReleaseMetadata({
      RELEASE_3_0_72_APK_PATH: apkPath,
      RELEASE_3_0_72_APK_SHA256: "b".repeat(64),
      RELEASE_3_0_72_APK_BYTES: String(bytes.length),
      RELEASE_3_0_72_RELEASED_AT: "2026-08-11T20:05:00+08:00",
    }), /SHA-256 mismatch/u);
    assert.throws(() => validateReleaseMetadata({
      RELEASE_3_0_72_APK_PATH: apkPath,
      RELEASE_3_0_72_APK_SHA256: sha256,
      RELEASE_3_0_72_APK_BYTES: String(bytes.length + 1),
      RELEASE_3_0_72_RELEASED_AT: "2026-08-11T20:05:00+08:00",
    }), /byte count mismatch/u);
    assert.throws(() => validateReleaseMetadata({
      RELEASE_3_0_72_APK_PATH: apkPath,
      RELEASE_3_0_72_APK_SHA256: sha256,
      RELEASE_3_0_72_APK_BYTES: String(bytes.length),
      RELEASE_3_0_72_RELEASED_AT: "2026-08-11T20:05:30+08:00",
    }), /exact \+08:00 minute timestamp/u);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
