import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const RELEASE_VERSION = "3.0.82";
export const RELEASE_BUILD = 119;
export const RELEASE_APPLICATION_ID = "com.huaix.zhichao";
export const RELEASE_ABI = "arm64-v8a";
export const APPROVAL = "FREEZE_3_0_82_AFTER_SIGNED_APK_VERIFICATION";
const PREFIX = "RELEASE_3_0_82_";
const root = path.resolve(import.meta.dirname, "..");

function required(environment, key) {
  const value = String(environment[`${PREFIX}${key}`] ?? "").trim();
  if (!value) throw new Error(`${PREFIX}${key} is required`);
  return value;
}

function releaseTime(raw) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):00\+08:00$/u.exec(raw);
  if (!match) throw new Error(`${PREFIX}RELEASED_AT must be an exact +08:00 minute timestamp`);
  const [, year, monthText, dayText, hourText, minuteText] = match;
  const month = Number(monthText);
  const day = Number(dayText);
  const days = month >= 1 && month <= 12 ? new Date(Date.UTC(Number(year), month, 0)).getUTCDate() : 0;
  if (day < 1 || day > days || Number(hourText) > 23 || Number(minuteText) > 59) {
    throw new Error(`${PREFIX}RELEASED_AT must be a valid Beijing calendar minute`);
  }
  return { iso: raw, label: `${year} 年 ${month} 月 ${day} 日 ${hourText}:${minuteText}（北京时间）` };
}

function runText(executable, args) {
  return execFileSync(executable, args, { encoding: "utf8", windowsHide: true }).trim();
}

function exactDigest(environment, key) {
  const digest = required(environment, key);
  if (!/^[a-f0-9]{64}$/u.test(digest)) {
    throw new Error(`${PREFIX}${key} must be an exact lowercase SHA-256 digest`);
  }
  return digest;
}

export function validateReleaseMetadata(environment = process.env) {
  const apkPath = path.resolve(required(environment, "APK_PATH"));
  const expectedHash = exactDigest(environment, "APK_SHA256");
  const expectedSigner = exactDigest(environment, "SIGNER_SHA256");
  const expectedBytesText = required(environment, "APK_BYTES");
  const expectedBytes = Number(expectedBytesText);
  const releasedAt = releaseTime(required(environment, "RELEASED_AT"));
  if (!apkPath.toLowerCase().endsWith(".apk") || !fs.existsSync(apkPath) || !fs.statSync(apkPath).isFile()) {
    throw new Error(`${PREFIX}APK_PATH must point to the signed APK`);
  }
  if (!/^[1-9]\d*$/u.test(expectedBytesText) || !Number.isSafeInteger(expectedBytes)) {
    throw new Error(`${PREFIX}APK_BYTES must be the exact positive byte count`);
  }
  const buffer = fs.readFileSync(apkPath);
  const actualHash = createHash("sha256").update(buffer).digest("hex");
  if (buffer.length !== expectedBytes) throw new Error(`signed APK byte count mismatch: ${buffer.length}`);
  if (actualHash !== expectedHash) throw new Error(`signed APK SHA-256 mismatch: ${actualHash}`);

  const sdkRoot = path.resolve(required(environment, "ANDROID_SDK_ROOT"));
  const javaHome = path.resolve(required(environment, "JAVA_HOME"));
  const java = path.join(javaHome, "bin", "java.exe");
  const analyzerJar = path.join(sdkRoot, "cmdline-tools", "latest", "lib", "apkanalyzer-classpath.jar");
  const signerJar = path.join(sdkRoot, "build-tools", required(environment, "BUILD_TOOLS"), "lib", "apksigner.jar");
  if (!fs.existsSync(analyzerJar) || !fs.existsSync(java)) {
    throw new Error("apkanalyzer and Java are required to verify APK identity and ABI");
  }
  if (!fs.existsSync(signerJar)) throw new Error("apksigner is required to verify APK signing");
  const analyzerArgs = [
    `-Dcom.android.sdklib.toolsdir=${path.join(sdkRoot, "cmdline-tools", "latest", "bin", "..")}`,
    "-classpath", analyzerJar, "com.android.tools.apk.analyzer.ApkAnalyzerCli",
  ];
  const applicationId = runText(java, [...analyzerArgs, "manifest", "application-id", apkPath]);
  const versionName = runText(java, [...analyzerArgs, "manifest", "version-name", apkPath]);
  const versionCode = Number(runText(java, [...analyzerArgs, "manifest", "version-code", apkPath]));
  if (applicationId !== RELEASE_APPLICATION_ID || versionName !== RELEASE_VERSION || versionCode !== RELEASE_BUILD) {
    throw new Error(`APK manifest identity mismatch: ${applicationId} ${versionName}(${versionCode})`);
  }
  const files = runText(java, [...analyzerArgs, "files", "list", apkPath]).split(/\r?\n/u);
  const abis = [...new Set(files.flatMap((entry) => {
    const match = /^\/??lib\/([^/]+)\//u.exec(entry.trim());
    return match ? [match[1]] : [];
  }))].sort();
  if (abis.length !== 1 || abis[0] !== RELEASE_ABI) {
    throw new Error(`APK ABI mismatch: expected ${RELEASE_ABI}, found ${abis.join(",") || "none"}`);
  }
  const signerOutput = runText(java, ["-jar", signerJar, "verify", "--verbose", "--print-certs", apkPath]);
  const signerMatch = /Signer #1 certificate SHA-256 digest:\s*([a-f0-9:]{64,95})/iu.exec(signerOutput);
  const actualSigner = signerMatch?.[1].replaceAll(":", "").toLowerCase() ?? "";
  if (actualSigner !== expectedSigner) {
    throw new Error(`APK signer SHA-256 mismatch: ${actualSigner || "missing"}`);
  }

  return {
    apkPath,
    apkBytes: buffer.length,
    apkHash: actualHash,
    apkMegabytes: (buffer.length / 1024 / 1024).toFixed(1),
    signerSha256: actualSigner,
    applicationId,
    abi: abis[0],
    releasedAt,
  };
}

function replaceOnce(source, pending, frozen, label) {
  const pendingCount = source.split(pending).length - 1;
  const frozenCount = source.split(frozen).length - 1;
  if (pendingCount === 1 && frozenCount === 0) return source.replace(pending, frozen);
  if (pendingCount === 0 && frozenCount === 1) return source;
  throw new Error(`${label} expected exactly one candidate or frozen value`);
}

export function freezeSources(sources, metadata) {
  let app = replaceOnce(
    sources.app,
    "const APP_RELEASED_AT = 'PENDING_3_0_82_RELEASED_AT'\nconst APP_RELEASED_AT_LABEL = '正式发布后更新'",
    `const APP_RELEASED_AT = '${metadata.releasedAt.iso}'\nconst APP_RELEASED_AT_LABEL = '${metadata.releasedAt.label}'`,
    "App release time",
  );
  for (const [pending, frozen, label] of [
    ["知潮 3.0.82 候选更新", "知潮 3.0.82 正式更新", "App release label"],
    ["候选发布时间 · {APP_RELEASED_AT_LABEL}", "最新更新 · {APP_RELEASED_AT_LABEL}", "App release time label"],
    ["3.0.82 候选能力已经进入源码，但只有正式签名 APK、服务端迁移与发布链全部核验后，官网才会把它冻结为正式版本并切换下载目标。", "3.0.82 已通过正式签名 APK、服务端迁移与发布链核验，本次为非强制更新，可按自己的时间安装。", "App release summary"],
    ["3.0.82 数据结构与边界 · 候选尚未发布", "3.0.82 数据结构与边界 · 已正式发布", "schema release label"],
    ["V79–V84 随 3.0.82 候选进入同一条核验链", "V79–V84 已随 3.0.82 进入同一条正式链", "schema release heading"],
    ["当前公开下载仍是知潮 3.0.81、生产服务端 schema 仍是 78。下面的 V79–V84 是 3.0.82 候选的真实能力，\n              仍需离机备份、连续迁移、正式 Android 构建和安装启动验收后，才能一并公开。", "当前公开下载是知潮 3.0.82，生产服务端已连续迁移至 schema 84。下面按 V79–V84 说明本版数据结构，\n              发布前已经过离机备份、连续迁移、正式 Android 构建和安装启动验收。", "schema release state"],
  ]) app = replaceOnce(app, pending, frozen, label);

  let download = sources.download;
  for (const [pending, frozen, label] of [
    ["PENDING_3_0_82_APK_SIZE_BYTES", String(metadata.apkBytes), "APK bytes"],
    ["PENDING_3_0_82_APK_SHA256", metadata.apkHash.toUpperCase(), "APK hash"],
    ["PENDING_3_0_82_APK_SIZE_MB", `${metadata.apkMegabytes} MB`, "APK size"],
    ['<p class="lead">本页已准备 3.0.82 候选说明；正式签名安装包尚未冻结，当前下载继续提供上一版已核验 APK。</p>', '<p class="lead">先看清版本与更新内容，再由你决定是否下载。已有账号更新安装后，可继续使用原来的云端数据。</p>', "download lead"],
    ['<p class="release-time">候选发布时间：<time datetime="PENDING_3_0_82_RELEASED_AT">正式发布后更新</time></p>', `<p class="release-time">最新更新：<time datetime="${metadata.releasedAt.iso}">${metadata.releasedAt.label}</time></p>`, "download release time"],
    ['<a id="download-apk" class="download" href="/download/zhichao-mobile-release.apk?v=3.0.81" download>下载上一版已核验 APK</a>', '<a id="download-apk" class="download" href="/download/zhichao-mobile-release.apk?v=3.0.82" download>开始下载 APK</a>', "download target"],
    ['<div class="fact"><small>候选版本</small><strong>3.0.82</strong><span>versionCode 119</span></div>', '<div class="fact"><small>正式版本</small><strong>3.0.82</strong><span>versionCode 119</span></div>', "download version state"],
    ['<div class="fact"><small>发布状态</small><strong>待正式安装包核验</strong><span>签名、ABI 与公网文件一致后发布</span></div>', '<div class="fact"><small>发布状态</small><strong>官方已核验</strong><span>签名、ABI 与公网文件一致</span></div>', "download verification state"],
  ]) download = replaceOnce(download, pending, frozen, label);

  let privacy = replaceOnce(
    sources.privacy,
    "更新日期：2026 年 8 月 14 日 · 适用版本：3.0.82（正式发布后生效）",
    "更新日期：2026 年 8 月 14 日 · 当前公开版本：3.0.82",
    "privacy release label",
  );
  privacy = replaceOnce(
    privacy,
    "当前公网下载仍为 3.0.81，生产服务端 schema 仍为 78；本政策随 3.0.82 正式发布及 V79–V84 连续迁移一并生效。正式发布前，官网继续提供 3.0.81 已核验 APK，不把候选入口表述成当前已处理。",
    "当前公网 Android 为 3.0.82，生产服务端已连续迁移至 schema 84；本政策已经生效。官网和 App 仍按真实状态披露远程 Push 与 COS 边界，不把未启用能力表述成已经处理。",
    "privacy release boundary",
  );
  let terms = replaceOnce(
    sources.terms,
    "更新日期：2026 年 8 月 14 日 · 适用版本：3.0.82（正式发布后生效）",
    "更新日期：2026 年 8 月 14 日 · 当前公开版本：3.0.82",
    "terms release label",
  );
  terms = replaceOnce(
    terms,
    "本协议随 3.0.82 正式发布及 V79–V84 连续迁移一并生效。正式发布前，当前 3.0.81 不提供笔记额度、可选资料/周期关怀、单卡回收或匿名医学反馈入口。",
    "本协议已随 3.0.82 正式发布及 V79–V84 连续迁移生效；笔记额度、可选资料/周期关怀、单卡回收和匿名医学反馈按 App 当前入口与本协议提供。",
    "terms release boundary",
  );
  return { app, download, privacy, terms };
}

function readSources() {
  return {
    app: fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8"),
    download: fs.readFileSync(path.join(root, "public", "download", "index.html"), "utf8"),
    privacy: fs.readFileSync(path.join(root, "public", "legal", "privacy.html"), "utf8"),
    terms: fs.readFileSync(path.join(root, "public", "legal", "terms.html"), "utf8"),
  };
}

function writeAtomically(prepared) {
  const targets = {
    app: path.join(root, "src", "App.tsx"),
    download: path.join(root, "public", "download", "index.html"),
    privacy: path.join(root, "public", "legal", "privacy.html"),
    terms: path.join(root, "public", "legal", "terms.html"),
  };
  const nonce = `.3082-freeze-${process.pid}-${Date.now()}`;
  const temps = Object.fromEntries(Object.entries(targets).map(([key, target]) => [key, `${target}${nonce}.tmp`]));
  const backups = Object.fromEntries(Object.entries(targets).map(([key, target]) => [key, `${target}${nonce}.bak`]));
  const moved = [];
  let committed = false;
  try {
    for (const key of Object.keys(targets)) fs.writeFileSync(temps[key], prepared[key], { flag: "wx" });
    for (const key of Object.keys(targets)) {
      fs.renameSync(targets[key], backups[key]);
      moved.push(key);
      fs.renameSync(temps[key], targets[key]);
    }
    committed = true;
  } catch (error) {
    if (!committed) {
      for (const key of [...moved].reverse()) {
        if (fs.existsSync(targets[key])) fs.unlinkSync(targets[key]);
        if (fs.existsSync(backups[key])) fs.renameSync(backups[key], targets[key]);
      }
    }
    throw error;
  } finally {
    for (const file of Object.values(temps)) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    if (committed) {
      for (const file of Object.values(backups)) {
        try { if (fs.existsSync(file)) fs.unlinkSync(file); } catch { /* committed sources stay authoritative */ }
      }
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    const metadata = validateReleaseMetadata();
    const prepared = freezeSources(readSources(), metadata);
    const apply = process.argv.includes("--apply");
    console.log(`MODE=${apply ? "apply" : "preview"}`);
    console.log(`APPLICATION_ID=${metadata.applicationId}`);
    console.log(`VERSION=${RELEASE_VERSION}`);
    console.log(`BUILD=${RELEASE_BUILD}`);
    console.log(`ABI=${metadata.abi}`);
    console.log(`APK_BYTES=${metadata.apkBytes}`);
    console.log(`APK_SHA256=${metadata.apkHash}`);
    console.log(`SIGNER_SHA256=${metadata.signerSha256}`);
    console.log(`RELEASED_AT=${metadata.releasedAt.iso}`);
    if (apply) {
      if (process.env.FREEZE_RELEASE_3_0_82_APPROVED !== APPROVAL) {
        throw new Error(`apply requires FREEZE_RELEASE_3_0_82_APPROVED=${APPROVAL}`);
      }
      writeAtomically(prepared);
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
