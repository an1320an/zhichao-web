import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  APPROVAL,
  RELEASE_ABI,
  RELEASE_APPLICATION_ID,
  RELEASE_BUILD,
  RELEASE_VERSION,
  freezeSources,
  validateReleaseMetadata,
} from "./freeze-release-3.0.82.mjs";

const pendingApp = `const APP_RELEASED_AT = 'PENDING_3_0_82_RELEASED_AT'
const APP_RELEASED_AT_LABEL = '正式发布后更新'
知潮 3.0.82 候选更新
候选发布时间 · {APP_RELEASED_AT_LABEL}
3.0.82 候选能力已经进入源码，但只有正式签名 APK、服务端迁移与发布链全部核验后，官网才会把它冻结为正式版本并切换下载目标。
3.0.82 数据结构与边界 · 候选尚未发布
V79–V84 随 3.0.82 候选进入同一条核验链
当前公开下载仍是知潮 3.0.81、生产服务端 schema 仍是 78。下面的 V79–V84 是 3.0.82 候选的真实能力，
              仍需离机备份、连续迁移、正式 Android 构建和安装启动验收后，才能一并公开。`;

const pendingDownload = `<meta content="PENDING_3_0_82_APK_SIZE_BYTES PENDING_3_0_82_APK_SHA256 PENDING_3_0_82_APK_SIZE_MB">
<p class="lead">本页已准备 3.0.82 候选说明；正式签名安装包尚未冻结，当前下载继续提供上一版已核验 APK。</p>
<p class="release-time">候选发布时间：<time datetime="PENDING_3_0_82_RELEASED_AT">正式发布后更新</time></p>
<a id="download-apk" class="download" href="/download/zhichao-mobile-release.apk?v=3.0.81" download>下载上一版已核验 APK</a>
<div class="fact"><small>候选版本</small><strong>3.0.82</strong><span>versionCode 119</span></div>
<div class="fact"><small>发布状态</small><strong>待正式安装包核验</strong><span>签名、ABI 与公网文件一致后发布</span></div>`;

test("freezes the exact 3.0.82 candidate only after metadata verification", () => {
  const metadata = {
    apkBytes: 123456789,
    apkHash: "a".repeat(64),
    apkMegabytes: "117.7",
    releasedAt: { iso: "2026-08-14T12:34:00+08:00", label: "2026 年 8 月 14 日 12:34（北京时间）" },
  };
  const frozen = freezeSources({ app: pendingApp, download: pendingDownload }, metadata);
  assert.doesNotMatch(`${frozen.app}\n${frozen.download}`, /PENDING_3_0_82|候选尚未发布|下载上一版/u);
  assert.match(frozen.app, /知潮 3\.0\.82 正式更新/u);
  assert.match(frozen.app, /生产服务端已连续迁移至 schema 84/u);
  assert.match(frozen.download, /v=3\.0\.82/u);
  assert.match(frozen.download, /官方已核验/u);
  assert.match(frozen.download, /123456789/u);
  assert.deepEqual(freezeSources(frozen, metadata), frozen);
  assert.equal(RELEASE_VERSION, "3.0.82");
  assert.equal(RELEASE_BUILD, 119);
  assert.equal(RELEASE_APPLICATION_ID, "com.huaix.zhichao");
  assert.equal(RELEASE_ABI, "arm64-v8a");
  assert.equal(APPROVAL, "FREEZE_3_0_82_AFTER_SIGNED_APK_VERIFICATION");
});

test("candidate shape drift fails closed before any source mutation", () => {
  const metadata = {
    apkBytes: 123456789,
    apkHash: "a".repeat(64),
    apkMegabytes: "117.7",
    releasedAt: { iso: "2026-08-14T12:34:00+08:00", label: "2026 年 8 月 14 日 12:34（北京时间）" },
  };
  assert.throws(
    () => freezeSources({ app: pendingApp.replace("候选更新", "候选预览"), download: pendingDownload }, metadata),
    /App release label expected exactly one candidate or frozen value/u,
  );
  assert.throws(
    () => freezeSources({ app: pendingApp, download: pendingDownload.replace("v=3.0.81", "v=3.0.80").replaceAll("PENDING_3_0_82_APK_SIZE_BYTES", "123456789").replaceAll("PENDING_3_0_82_APK_SHA256", "A".repeat(64)).replaceAll("PENDING_3_0_82_APK_SIZE_MB", "117.7 MB") }, metadata),
    /download target expected exactly one candidate or frozen value/u,
  );
});

test("metadata validation fails closed before Android tooling", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-freeze-3082-"));
  try {
    const apk = path.join(directory, "release.apk");
    const data = Buffer.from("not-a-real-signed-apk");
    fs.writeFileSync(apk, data);
    const hash = createHash("sha256").update(data).digest("hex");
    const environment = {
      RELEASE_3_0_82_APK_PATH: apk,
      RELEASE_3_0_82_APK_SHA256: hash,
      RELEASE_3_0_82_APK_BYTES: String(data.length),
      RELEASE_3_0_82_RELEASED_AT: "2026-08-14T12:34:00+08:00",
      RELEASE_3_0_82_ANDROID_SDK_ROOT: directory,
      RELEASE_3_0_82_BUILD_TOOLS: "36.0.0",
      RELEASE_3_0_82_JAVA_HOME: directory,
      RELEASE_3_0_82_SIGNER_SHA256: "b".repeat(64),
    };
    assert.throws(() => validateReleaseMetadata({}), /RELEASE_3_0_82_APK_PATH is required/u);
    assert.throws(() => validateReleaseMetadata({ ...environment, RELEASE_3_0_82_APK_SHA256: hash.toUpperCase() }), /exact lowercase SHA-256 digest/u);
    assert.throws(() => validateReleaseMetadata({ ...environment, RELEASE_3_0_82_APK_BYTES: "1" }), /byte count mismatch/u);
    assert.throws(() => validateReleaseMetadata({ ...environment, RELEASE_3_0_82_SIGNER_SHA256: "x" }), /exact lowercase SHA-256 digest/u);
    assert.throws(() => validateReleaseMetadata(environment), /apkanalyzer and Java are required/u);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
