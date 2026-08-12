import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { APPROVAL, RELEASE_BUILD, RELEASE_VERSION, freezeSources, validateReleaseMetadata } from "./freeze-release-3.0.77.mjs";

test("freezes the exact signed 3.0.77 identity without changing release copy", () => {
  const metadata = { apkBytes: 123456789, apkHash: "a".repeat(64), apkMegabytes: "117.7", releasedAt: { iso: "2026-08-12T23:59:00+08:00", label: "2026 年 8 月 12 日 23:59（北京时间）" } };
  const pending = {
    app: "const APP_RELEASED_AT = 'PENDING_3_0_77_RELEASED_AT'\nconst APP_RELEASED_AT_LABEL = '正式发布后更新'",
    download: '<meta content="PENDING_3_0_77_APK_SIZE_BYTES PENDING_3_0_77_APK_SHA256 PENDING_3_0_77_APK_SIZE_MB"><time datetime="PENDING_3_0_77_RELEASED_AT">正式发布后更新</time>',
    audit: '  ["下载确认页已准备 3.0.77 正式包身份", ["3.0.77", "versionCode 114", "PENDING_3_0_77_APK_SIZE_BYTES", "PENDING_3_0_77_APK_SHA256", "PENDING_3_0_77_APK_SIZE_MB", "非强制更新", "最新更新：", "学习教练", "最近删除", "图片和 PDF", "沟通大字板", "时光海岸", "深海探索", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],\n  ["3.0.77 发布前身份保持失败关闭占位", ["PENDING_3_0_77_APK_SIZE_BYTES", "PENDING_3_0_77_APK_SHA256", "PENDING_3_0_77_APK_SIZE_MB", "PENDING_3_0_77_RELEASED_AT", "正式发布后更新"].every((phrase) => publicCopy.includes(phrase))],',
  };
  const frozen = freezeSources(pending, metadata);
  assert.doesNotMatch(frozen.app, /PENDING_3_0_77|正式发布后更新/u);
  assert.doesNotMatch(frozen.download, /PENDING_3_0_77|正式发布后更新/u);
  assert.match(frozen.audit, /占位已清除/u);
  assert.match(frozen.download, /123456789/u);
  assert.equal(RELEASE_VERSION, "3.0.77"); assert.equal(RELEASE_BUILD, 114);
  assert.equal(APPROVAL, "FREEZE_3_0_77_AFTER_SIGNED_APK_VERIFICATION");
});

test("validates bytes hash and Beijing minute", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-freeze-3077-"));
  try {
    const apk = path.join(dir, "release.apk"); const data = Buffer.from("signed-3077"); fs.writeFileSync(apk, data);
    const env = { RELEASE_3_0_77_APK_PATH: apk, RELEASE_3_0_77_APK_SHA256: createHash("sha256").update(data).digest("hex"), RELEASE_3_0_77_APK_BYTES: String(data.length), RELEASE_3_0_77_RELEASED_AT: "2026-08-12T23:59:00+08:00" };
    assert.equal(validateReleaseMetadata(env).apkBytes, data.length);
    assert.throws(() => validateReleaseMetadata({ ...env, RELEASE_3_0_77_APK_BYTES: "1" }), /byte count mismatch/u);
    assert.throws(() => validateReleaseMetadata({ ...env, RELEASE_3_0_77_RELEASED_AT: "2026-08-12T23:59:30+08:00" }), /exact \+08:00 minute/u);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
