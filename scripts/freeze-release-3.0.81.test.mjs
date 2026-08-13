import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { APPROVAL, RELEASE_BUILD, RELEASE_VERSION, freezeSources, validateReleaseMetadata } from "./freeze-release-3.0.81.mjs";

const pendingAudit = [
  '  ["下载确认页已准备 3.0.81 待冻结候选", ["3.0.81", "versionCode 118", "PENDING_3_0_81_APK_SIZE_BYTES", "PENDING_3_0_81_APK_SHA256", "PENDING_3_0_81_APK_SIZE_MB", "PENDING_3_0_81_RELEASED_AT", "待正式核验", "签名与公网文件一致后发布", "非强制更新", "特殊身份", "时光海洋", "聊天长按删除", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => publicCopy.includes(phrase))],',
  '  ["3.0.81 发布前身份保持失败关闭占位", ["PENDING_3_0_81_APK_SIZE_BYTES", "PENDING_3_0_81_APK_SHA256", "PENDING_3_0_81_APK_SIZE_MB", "PENDING_3_0_81_RELEASED_AT", "正式发布后更新"].every((phrase) => publicCopy.includes(phrase))],',
  '  ["3.0.81 候选不会把上一版 APK 误标成新包", sources["public/download/index.html"].includes(\'href="/download/zhichao-mobile-release.apk?v=3.0.80"\') && sources["public/download/index.html"].includes("下载上一版已核验 APK") && !sources["public/download/index.html"].includes(\'href="/download/zhichao-mobile-release.apk?v=3.0.81"\')],',
].join("\n");

test("freezes exact 3.0.81 identity and switches the download only after verification", () => {
  const metadata = { apkBytes: 123456789, apkHash: "a".repeat(64), apkMegabytes: "117.7", releasedAt: { iso: "2026-08-13T12:34:00+08:00", label: "2026 年 8 月 13 日 12:34（北京时间）" } };
  const pending = {
    app: "const APP_RELEASED_AT = 'PENDING_3_0_81_RELEASED_AT'\nconst APP_RELEASED_AT_LABEL = '正式发布后更新'",
    download: '<meta content="PENDING_3_0_81_APK_SIZE_BYTES PENDING_3_0_81_APK_SHA256 PENDING_3_0_81_APK_SIZE_MB"><p class="lead">本页已准备 3.0.81 候选说明；正式签名安装包尚未冻结，当前下载继续提供上一版已核验 APK。</p><p class="release-time">候选发布时间：<time datetime="PENDING_3_0_81_RELEASED_AT">正式发布后更新</time></p><a id="download-apk" class="download" href="/download/zhichao-mobile-release.apk?v=3.0.80" download>下载上一版已核验 APK</a><div class="fact"><small>发布状态</small><strong>待正式核验</strong><span>签名与公网文件一致后发布</span></div>',
    audit: pendingAudit,
  };
  const frozen = freezeSources(pending, metadata);
  assert.doesNotMatch(`${frozen.app}\n${frozen.download}`, /PENDING_3_0_81|正式发布后更新|待正式核验/u);
  assert.match(frozen.download, /v=3\.0\.81/u);
  assert.match(frozen.download, /官方已核验/u);
  assert.match(frozen.audit, /占位已清除/u);
  assert.match(frozen.audit, /正式下载目标已切换/u);
  assert.equal(RELEASE_VERSION, "3.0.81");
  assert.equal(RELEASE_BUILD, 118);
  assert.equal(APPROVAL, "FREEZE_3_0_81_AFTER_SIGNED_APK_VERIFICATION");
});

test("metadata validation fails closed before any source mutation", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-freeze-3081-"));
  try {
    const apk = path.join(directory, "release.apk");
    const data = Buffer.from("not-a-real-signed-apk");
    fs.writeFileSync(apk, data);
    const environment = {
      RELEASE_3_0_81_APK_PATH: apk,
      RELEASE_3_0_81_APK_SHA256: createHash("sha256").update(data).digest("hex"),
      RELEASE_3_0_81_APK_BYTES: String(data.length),
      RELEASE_3_0_81_RELEASED_AT: "2026-08-13T12:34:00+08:00",
      RELEASE_3_0_81_ANDROID_SDK_ROOT: directory,
      RELEASE_3_0_81_BUILD_TOOLS: "36.0.0",
      RELEASE_3_0_81_JAVA_HOME: directory,
    };
    assert.throws(() => validateReleaseMetadata({}), /RELEASE_3_0_81_APK_PATH is required/u);
    assert.throws(() => validateReleaseMetadata({ ...environment, RELEASE_3_0_81_APK_SHA256: environment.RELEASE_3_0_81_APK_SHA256.toUpperCase() }), /exact lowercase digest/u);
    assert.throws(() => validateReleaseMetadata({ ...environment, RELEASE_3_0_81_APK_BYTES: "1" }), /byte count mismatch/u);
    assert.throws(() => validateReleaseMetadata(environment), /apkanalyzer and Java are required/u);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
