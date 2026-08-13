import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const RELEASE_VERSION = "3.0.81";
export const RELEASE_BUILD = 118;
export const APPROVAL = "FREEZE_3_0_81_AFTER_SIGNED_APK_VERIFICATION";
const root = path.resolve(import.meta.dirname, "..");

function required(environment, key) {
  const value = String(environment[key] ?? "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function releaseTime(raw) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):00\+08:00$/u.exec(raw);
  if (!match) throw new Error("RELEASE_3_0_81_RELEASED_AT must be an exact +08:00 minute timestamp");
  const [, year, monthText, dayText, hourText, minuteText] = match;
  const month = Number(monthText);
  const day = Number(dayText);
  const days = month >= 1 && month <= 12 ? new Date(Date.UTC(Number(year), month, 0)).getUTCDate() : 0;
  if (day < 1 || day > days || Number(hourText) > 23 || Number(minuteText) > 59) {
    throw new Error("RELEASE_3_0_81_RELEASED_AT must be a valid Beijing calendar minute");
  }
  return { iso: raw, label: `${year} 年 ${month} 月 ${day} 日 ${hourText}:${minuteText}（北京时间）` };
}

function androidSdk(environment) {
  return required(environment, "RELEASE_3_0_81_ANDROID_SDK_ROOT");
}

function runText(executable, args) {
  return execFileSync(executable, args, { encoding: "utf8", windowsHide: true }).trim();
}

export function validateReleaseMetadata(environment = process.env) {
  const apkPath = path.resolve(required(environment, "RELEASE_3_0_81_APK_PATH"));
  const expectedHash = required(environment, "RELEASE_3_0_81_APK_SHA256");
  const expectedBytesText = required(environment, "RELEASE_3_0_81_APK_BYTES");
  const expectedBytes = Number(expectedBytesText);
  if (!apkPath.toLowerCase().endsWith(".apk") || !fs.existsSync(apkPath) || !fs.statSync(apkPath).isFile()) {
    throw new Error("RELEASE_3_0_81_APK_PATH must point to the signed APK");
  }
  if (!/^[a-f0-9]{64}$/u.test(expectedHash)) {
    throw new Error("RELEASE_3_0_81_APK_SHA256 must be the exact lowercase digest");
  }
  if (!/^[1-9]\d*$/u.test(expectedBytesText) || !Number.isSafeInteger(expectedBytes)) {
    throw new Error("RELEASE_3_0_81_APK_BYTES must be the exact positive byte count");
  }
  const buffer = fs.readFileSync(apkPath);
  const actualHash = createHash("sha256").update(buffer).digest("hex");
  if (buffer.length !== expectedBytes) throw new Error(`signed APK byte count mismatch: ${buffer.length}`);
  if (actualHash !== expectedHash) throw new Error(`signed APK SHA-256 mismatch: ${actualHash}`);

  const sdkRoot = path.resolve(androidSdk(environment));
  const analyzerJar = path.join(sdkRoot, "cmdline-tools", "latest", "lib", "apkanalyzer-classpath.jar");
  const javaHome = path.resolve(required(environment, "RELEASE_3_0_81_JAVA_HOME"));
  const java = path.join(javaHome, "bin", "java.exe");
  const signerJar = path.join(sdkRoot, "build-tools", required(environment, "RELEASE_3_0_81_BUILD_TOOLS"), "lib", "apksigner.jar");
  if (!fs.existsSync(analyzerJar) || !fs.existsSync(java)) throw new Error("apkanalyzer and Java are required to verify APK manifest identity");
  if (!fs.existsSync(signerJar)) throw new Error("apksigner is required to verify APK signing");
  const analyzerArgs = [
    `-Dcom.android.sdklib.toolsdir=${path.join(sdkRoot, "cmdline-tools", "latest", "bin", "..")}`,
    "-classpath", analyzerJar, "com.android.tools.apk.analyzer.ApkAnalyzerCli",
  ];
  const versionName = runText(java, [...analyzerArgs, "manifest", "version-name", apkPath]);
  const versionCode = Number(runText(java, [...analyzerArgs, "manifest", "version-code", apkPath]));
  if (versionName !== RELEASE_VERSION || versionCode !== RELEASE_BUILD) {
    throw new Error(`APK manifest identity mismatch: ${versionName}(${versionCode})`);
  }
  runText(java, ["-jar", signerJar, "verify", "--verbose", apkPath]);

  return {
    apkPath,
    apkBytes: buffer.length,
    apkHash: actualHash,
    apkMegabytes: (buffer.length / 1024 / 1024).toFixed(1),
    releasedAt: releaseTime(required(environment, "RELEASE_3_0_81_RELEASED_AT")),
  };
}

function replaceOnce(source, needle, replacement, label) {
  const pendingCount = source.split(needle).length - 1;
  if (pendingCount === 1) return source.replace(needle, replacement);
  if (pendingCount === 0 && source.split(replacement).length - 1 === 1) return source;
  throw new Error(`${label} expected one pending or frozen value`);
}

export function freezeSources(sources, metadata) {
  const app = replaceOnce(
    sources.app,
    "const APP_RELEASED_AT = 'PENDING_3_0_81_RELEASED_AT'\nconst APP_RELEASED_AT_LABEL = '正式发布后更新'",
    `const APP_RELEASED_AT = '${metadata.releasedAt.iso}'\nconst APP_RELEASED_AT_LABEL = '${metadata.releasedAt.label}'`,
    "App release time",
  );

  let download = sources.download;
  for (const [pending, value, label] of [
    ["PENDING_3_0_81_APK_SIZE_BYTES", String(metadata.apkBytes), "APK bytes"],
    ["PENDING_3_0_81_APK_SHA256", metadata.apkHash.toUpperCase(), "APK hash"],
    ["PENDING_3_0_81_APK_SIZE_MB", `${metadata.apkMegabytes} MB`, "APK size"],
  ]) {
    download = replaceOnce(download, pending, value, label);
  }
  download = replaceOnce(download,
    '<time datetime="PENDING_3_0_81_RELEASED_AT">正式发布后更新</time>',
    `<time datetime="${metadata.releasedAt.iso}">${metadata.releasedAt.label}</time>`, "download release time");
  download = replaceOnce(download,
    '<p class="lead">本页已准备 3.0.81 候选说明；正式签名安装包尚未冻结，当前下载继续提供上一版已核验 APK。</p>',
    '<p class="lead">先看清版本与更新内容，再由你决定是否下载。已有账号更新安装后，可继续使用原来的云端数据。</p>', "download lead");
  download = replaceOnce(download,
    '<p class="release-time">候选发布时间：', '<p class="release-time">最新更新：', "release time label");
  download = replaceOnce(download,
    '<a id="download-apk" class="download" href="/download/zhichao-mobile-release.apk?v=3.0.80" download>下载上一版已核验 APK</a>',
    '<a id="download-apk" class="download" href="/download/zhichao-mobile-release.apk?v=3.0.81" download>开始下载 APK</a>', "download target");
  download = replaceOnce(download,
    '<div class="fact"><small>发布状态</small><strong>待正式核验</strong><span>签名与公网文件一致后发布</span></div>',
    '<div class="fact"><small>发布状态</small><strong>官方已核验</strong><span>签名与公网文件一致</span></div>', "download verification status");

  let audit = replaceOnce(sources.audit,
    '  ["下载确认页已准备 3.0.81 待冻结候选", ["3.0.81", "versionCode 118", "PENDING_3_0_81_APK_SIZE_BYTES", "PENDING_3_0_81_APK_SHA256", "PENDING_3_0_81_APK_SIZE_MB", "PENDING_3_0_81_RELEASED_AT", "待正式核验", "签名与公网文件一致后发布", "非强制更新", "特殊身份", "时光海洋", "聊天长按删除", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => publicCopy.includes(phrase))],',
    `  ["下载确认页保留 3.0.81 正式包身份、非强制更新与备案", ["3.0.81", "versionCode 118", "${metadata.apkBytes}", "${metadata.apkHash.toUpperCase()}", "${metadata.apkMegabytes} MB", "官方已核验", "签名与公网文件一致", "非强制更新", "特殊身份", "时光海洋", "聊天长按删除", "${metadata.releasedAt.label}", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => publicCopy.includes(phrase))],`, "audit APK identity");
  audit = replaceOnce(sources.audit === audit ? sources.audit : audit,
    '  ["3.0.81 发布前身份保持失败关闭占位", ["PENDING_3_0_81_APK_SIZE_BYTES", "PENDING_3_0_81_APK_SHA256", "PENDING_3_0_81_APK_SIZE_MB", "PENDING_3_0_81_RELEASED_AT", "正式发布后更新"].every((phrase) => publicCopy.includes(phrase))],',
    '  ["3.0.81 正式包与发布时间占位已清除", !["PENDING_3_0_81_APK_SIZE_BYTES", "PENDING_3_0_81_APK_SHA256", "PENDING_3_0_81_APK_SIZE_MB", "PENDING_3_0_81_RELEASED_AT", "正式发布后更新"].some((phrase) => publicCopy.includes(phrase))],', "audit release placeholders");
  audit = replaceOnce(audit,
    '  ["3.0.81 候选不会把上一版 APK 误标成新包", sources["public/download/index.html"].includes(\'href="/download/zhichao-mobile-release.apk?v=3.0.80"\') && sources["public/download/index.html"].includes("下载上一版已核验 APK") && !sources["public/download/index.html"].includes(\'href="/download/zhichao-mobile-release.apk?v=3.0.81"\')],',
    '  ["3.0.81 正式下载目标已切换", sources["public/download/index.html"].includes(\'href="/download/zhichao-mobile-release.apk?v=3.0.81"\') && sources["public/download/index.html"].includes("开始下载 APK") && !sources["public/download/index.html"].includes("下载上一版已核验 APK")],', "audit download target");
  return { app, download, audit };
}

function readSources() {
  return {
    app: fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8"),
    download: fs.readFileSync(path.join(root, "public", "download", "index.html"), "utf8"),
    audit: fs.readFileSync(path.join(root, "scripts", "audit-public-copy.mjs"), "utf8"),
  };
}

function writeAtomically(prepared) {
  const targets = {
    app: path.join(root, "src", "App.tsx"),
    download: path.join(root, "public", "download", "index.html"),
    audit: path.join(root, "scripts", "audit-public-copy.mjs"),
  };
  const temps = {};
  try {
    for (const key of Object.keys(targets)) {
      temps[key] = `${targets[key]}.3081-freeze-${process.pid}`;
      fs.writeFileSync(temps[key], prepared[key], { flag: "wx" });
    }
    for (const key of Object.keys(targets)) fs.renameSync(temps[key], targets[key]);
  } finally {
    for (const temp of Object.values(temps)) if (fs.existsSync(temp)) fs.unlinkSync(temp);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    const metadata = validateReleaseMetadata();
    const prepared = freezeSources(readSources(), metadata);
    const apply = process.argv.includes("--apply");
    console.log(`MODE=${apply ? "apply" : "preview"}`);
    console.log(`VERSION=${RELEASE_VERSION}`);
    console.log(`BUILD=${RELEASE_BUILD}`);
    console.log(`APK_BYTES=${metadata.apkBytes}`);
    console.log(`APK_SHA256=${metadata.apkHash}`);
    console.log(`RELEASED_AT=${metadata.releasedAt.iso}`);
    if (apply) {
      if (process.env.FREEZE_RELEASE_3_0_81_APPROVED !== APPROVAL) {
        throw new Error(`apply requires FREEZE_RELEASE_3_0_81_APPROVED=${APPROVAL}`);
      }
      writeAtomically(prepared);
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
