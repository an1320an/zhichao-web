import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  APPROVAL,
  RELEASE_BUILD,
  RELEASE_VERSION,
  freezeSources,
  validateReleaseMetadata,
} from "./freeze-release-3.0.78.mjs";

const pendingAudit = [
  '  ["下载确认页已准备 3.0.78 正式包身份", ["3.0.78", "versionCode 115", "PENDING_3_0_78_APK_SIZE_BYTES", "PENDING_3_0_78_APK_SHA256", "PENDING_3_0_78_APK_SIZE_MB", "待正式核验", "签名与公网文件一致后发布", "非强制更新", "最新更新：", "五运六气", "每周最多三封", "鲸歌保持更稀有", "系统面板", "管理员公告", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],',
  '  ["3.0.78 发布前身份保持失败关闭占位", ["PENDING_3_0_78_APK_SIZE_BYTES", "PENDING_3_0_78_APK_SHA256", "PENDING_3_0_78_APK_SIZE_MB", "PENDING_3_0_78_RELEASED_AT", "正式发布后更新"].every((phrase) => publicCopy.includes(phrase))],',
].join("\n");

test("freezes the exact signed 3.0.78 identity without changing release copy", () => {
  const metadata = {
    apkBytes: 123456789,
    apkHash: "a".repeat(64),
    apkMegabytes: "117.7",
    releasedAt: {
      iso: "2026-08-12T23:59:00+08:00",
      label: "2026 年 8 月 12 日 23:59（北京时间）",
    },
  };
  const pending = {
    app: "const APP_RELEASED_AT = 'PENDING_3_0_78_RELEASED_AT'\nconst APP_RELEASED_AT_LABEL = '正式发布后更新'",
    download: '<meta content="PENDING_3_0_78_APK_SIZE_BYTES PENDING_3_0_78_APK_SHA256 PENDING_3_0_78_APK_SIZE_MB"><time datetime="PENDING_3_0_78_RELEASED_AT">正式发布后更新</time><div class="fact"><small>发布状态</small><strong>待正式核验</strong><span>签名与公网文件一致后发布</span></div>',
    audit: pendingAudit,
  };
  const frozen = freezeSources(pending, metadata);
  assert.doesNotMatch(frozen.app, /PENDING_3_0_78|正式发布后更新/u);
  assert.doesNotMatch(frozen.download, /PENDING_3_0_78|正式发布后更新/u);
  assert.doesNotMatch(frozen.download, /待正式核验/u);
  assert.match(frozen.download, /官方已核验/u);
  assert.match(frozen.audit, /占位已清除/u);
  assert.match(frozen.download, /123456789/u);
  assert.equal(RELEASE_VERSION, "3.0.78");
  assert.equal(RELEASE_BUILD, 115);
  assert.equal(APPROVAL, "FREEZE_3_0_78_AFTER_SIGNED_APK_VERIFICATION");
});

test("validates bytes, lowercase hash and an exact Beijing minute", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "zhichao-freeze-3078-"));
  try {
    const apk = path.join(directory, "release.apk");
    const data = Buffer.from("signed-3078");
    fs.writeFileSync(apk, data);
    const hash = createHash("sha256").update(data).digest("hex");
    const environment = {
      RELEASE_3_0_78_APK_PATH: apk,
      RELEASE_3_0_78_APK_SHA256: hash,
      RELEASE_3_0_78_APK_BYTES: String(data.length),
      RELEASE_3_0_78_RELEASED_AT: "2026-08-12T23:59:00+08:00",
    };
    assert.equal(validateReleaseMetadata(environment).apkBytes, data.length);
    assert.throws(
      () => validateReleaseMetadata({ ...environment, RELEASE_3_0_78_APK_SHA256: hash.toUpperCase() }),
      /exact lowercase digest/u,
    );
    assert.throws(
      () => validateReleaseMetadata({ ...environment, RELEASE_3_0_78_APK_BYTES: "1" }),
      /byte count mismatch/u,
    );
    assert.throws(
      () => validateReleaseMetadata({ ...environment, RELEASE_3_0_78_RELEASED_AT: "2026-08-12T23:59:30+08:00" }),
      /exact \+08:00 minute/u,
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
