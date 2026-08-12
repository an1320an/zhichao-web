import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const RELEASE_VERSION = "3.0.77";
export const RELEASE_BUILD = 114;
export const APPROVAL = "FREEZE_3_0_77_AFTER_SIGNED_APK_VERIFICATION";
const root = path.resolve(import.meta.dirname, "..");

function required(environment, key) {
  const value = String(environment[key] ?? "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function releaseTime(raw) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):00\+08:00$/u.exec(raw);
  if (!match) throw new Error("RELEASE_3_0_77_RELEASED_AT must be an exact +08:00 minute timestamp");
  const [, year, monthText, dayText, hourText, minuteText] = match;
  const month = Number(monthText);
  const day = Number(dayText);
  const days = month >= 1 && month <= 12 ? new Date(Date.UTC(Number(year), month, 0)).getUTCDate() : 0;
  if (day < 1 || day > days || Number(hourText) > 23 || Number(minuteText) > 59) {
    throw new Error("RELEASE_3_0_77_RELEASED_AT must be a valid Beijing calendar minute");
  }
  return { iso: raw, label: `${year} 年 ${month} 月 ${day} 日 ${hourText}:${minuteText}（北京时间）` };
}

export function validateReleaseMetadata(environment = process.env) {
  const apkPath = path.resolve(required(environment, "RELEASE_3_0_77_APK_PATH"));
  const expectedHash = required(environment, "RELEASE_3_0_77_APK_SHA256");
  const expectedBytesText = required(environment, "RELEASE_3_0_77_APK_BYTES");
  const expectedBytes = Number(expectedBytesText);
  if (!apkPath.toLowerCase().endsWith(".apk") || !fs.existsSync(apkPath) || !fs.statSync(apkPath).isFile()) {
    throw new Error("RELEASE_3_0_77_APK_PATH must point to the signed APK");
  }
  if (!/^[a-f0-9]{64}$/u.test(expectedHash)) throw new Error("RELEASE_3_0_77_APK_SHA256 must be the exact lowercase digest");
  if (!/^[1-9]\d*$/u.test(expectedBytesText) || !Number.isSafeInteger(expectedBytes)) throw new Error("RELEASE_3_0_77_APK_BYTES must be the exact positive byte count");
  const buffer = fs.readFileSync(apkPath);
  const actualHash = createHash("sha256").update(buffer).digest("hex");
  if (buffer.length !== expectedBytes) throw new Error(`signed APK byte count mismatch: ${buffer.length}`);
  if (actualHash !== expectedHash) throw new Error(`signed APK SHA-256 mismatch: ${actualHash}`);
  return {
    apkPath,
    apkBytes: buffer.length,
    apkHash: actualHash,
    apkMegabytes: (buffer.length / 1024 / 1024).toFixed(1),
    releasedAt: releaseTime(required(environment, "RELEASE_3_0_77_RELEASED_AT")),
  };
}

function replaceOnce(source, needle, replacement, label) {
  const count = source.split(needle).length - 1;
  if (count === 1) return source.replace(needle, replacement);
  if (count === 0 && source.split(replacement).length - 1 === 1) return source;
  throw new Error(`${label} expected one pending or frozen value`);
}

export function freezeSources(sources, metadata) {
  let app = replaceOnce(sources.app,
    "const APP_RELEASED_AT = 'PENDING_3_0_77_RELEASED_AT'\nconst APP_RELEASED_AT_LABEL = '正式发布后更新'",
    `const APP_RELEASED_AT = '${metadata.releasedAt.iso}'\nconst APP_RELEASED_AT_LABEL = '${metadata.releasedAt.label}'`, "App release time");
  let download = sources.download;
  for (const [pending, value, label] of [
    ["PENDING_3_0_77_APK_SIZE_BYTES", String(metadata.apkBytes), "APK bytes"],
    ["PENDING_3_0_77_APK_SHA256", metadata.apkHash.toUpperCase(), "APK hash"],
    ["PENDING_3_0_77_APK_SIZE_MB", `${metadata.apkMegabytes} MB`, "APK size"],
  ]) download = replaceOnce(download, pending, value, label);
  download = replaceOnce(download,
    '<time datetime="PENDING_3_0_77_RELEASED_AT">正式发布后更新</time>',
    `<time datetime="${metadata.releasedAt.iso}">${metadata.releasedAt.label}</time>`, "download release time");
  let audit = sources.audit
    .replace('  ["下载确认页已准备 3.0.77 正式包身份", ["3.0.77", "versionCode 114", "PENDING_3_0_77_APK_SIZE_BYTES", "PENDING_3_0_77_APK_SHA256", "PENDING_3_0_77_APK_SIZE_MB", "非强制更新", "最新更新：", "学习教练", "最近删除", "图片和 PDF", "沟通大字板", "时光海岸", "深海探索", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],',
      `  ["下载确认页保留 3.0.77 正式包身份、非强制更新与备案", ["3.0.77", "versionCode 114", "${metadata.apkBytes}", "${metadata.apkHash.toUpperCase()}", "${metadata.apkMegabytes} MB", "非强制更新", "最新更新：", "${metadata.releasedAt.label}", "学习教练", "最近删除", "图片和 PDF", "沟通大字板", "时光海岸", "深海探索", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],`)
    .replace('  ["3.0.77 发布前身份保持失败关闭占位", ["PENDING_3_0_77_APK_SIZE_BYTES", "PENDING_3_0_77_APK_SHA256", "PENDING_3_0_77_APK_SIZE_MB", "PENDING_3_0_77_RELEASED_AT", "正式发布后更新"].every((phrase) => publicCopy.includes(phrase))],',
      '  ["3.0.77 正式包与发布时间占位已清除", !["PENDING_3_0_77_APK_SIZE_BYTES", "PENDING_3_0_77_APK_SHA256", "PENDING_3_0_77_APK_SIZE_MB", "PENDING_3_0_77_RELEASED_AT", "正式发布后更新"].some((phrase) => publicCopy.includes(phrase))],');
  if (audit === sources.audit && sources.audit.includes("PENDING_3_0_77_APK_SIZE_BYTES")) throw new Error("audit pending identity was not frozen");
  return { app, download, audit };
}

function sources() {
  return {
    app: fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8"),
    download: fs.readFileSync(path.join(root, "public", "download", "index.html"), "utf8"),
    audit: fs.readFileSync(path.join(root, "scripts", "audit-public-copy.mjs"), "utf8"),
  };
}

function writeAtomically(prepared) {
  const targets = { app: path.join(root, "src", "App.tsx"), download: path.join(root, "public", "download", "index.html"), audit: path.join(root, "scripts", "audit-public-copy.mjs") };
  const temps = {};
  try {
    for (const key of Object.keys(targets)) {
      temps[key] = `${targets[key]}.3077-freeze-${process.pid}`;
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
    const prepared = freezeSources(sources(), metadata);
    console.log(`MODE=${process.argv.includes("--apply") ? "apply" : "preview"}`);
    console.log(`VERSION=${RELEASE_VERSION}`);
    console.log(`BUILD=${RELEASE_BUILD}`);
    console.log(`APK_BYTES=${metadata.apkBytes}`);
    console.log(`APK_SHA256=${metadata.apkHash}`);
    console.log(`RELEASED_AT=${metadata.releasedAt.iso}`);
    if (process.argv.includes("--apply")) {
      if (process.env.FREEZE_RELEASE_3_0_77_APPROVED !== APPROVAL) throw new Error(`apply requires FREEZE_RELEASE_3_0_77_APPROVED=${APPROVAL}`);
      writeAtomically(prepared);
    }
  } catch (error) { console.error(error); process.exitCode = 1; }
}
