import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const RELEASE_VERSION = "3.0.73";
export const RELEASE_BUILD = 110;
export const APPROVAL = "PREPARE_3_0_73_AFTER_SIGNED_APK_VERIFICATION";
const PREVIOUS_VERSION = "3.0.72";
const root = path.resolve(import.meta.dirname, "..");

function replaceExactlyOrAlready(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first >= 0) {
    if (source.indexOf(needle, first + needle.length) >= 0) {
      throw new Error(`${label} has more than one replacement target`);
    }
    return source.slice(0, first) + replacement + source.slice(first + needle.length);
  }
  const prepared = source.indexOf(replacement);
  if (prepared >= 0 && source.indexOf(replacement, prepared + replacement.length) < 0) {
    return source;
  }
  throw new Error(`${label} is neither the 3.0.72 baseline nor the prepared value`);
}

function replacePatternExactly(source, pattern, replacement, label) {
  const matches = [...source.matchAll(new RegExp(pattern.source, pattern.flags.includes("g")
    ? pattern.flags
    : `${pattern.flags}g`))];
  if (matches.length !== 1) {
    throw new Error(`${label} expected one match, found ${matches.length}`);
  }
  return source.replace(pattern, replacement);
}

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

function required(environment, key) {
  const value = String(environment[key] ?? "").trim();
  if (!value) throw new Error(`${key} is required`);
  return value;
}

function sha256File(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function releaseTime(raw) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):00\+08:00$/u.exec(raw);
  if (!match) {
    throw new Error("RELEASE_3_0_73_RELEASED_AT must be an exact +08:00 minute timestamp");
  }
  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const daysInMonth = month >= 1 && month <= 12
    ? new Date(Date.UTC(year, month, 0)).getUTCDate()
    : 0;
  if (day < 1 || day > daysInMonth || hour > 23 || minute > 59) {
    throw new Error("RELEASE_3_0_73_RELEASED_AT must be a valid Beijing calendar minute");
  }
  return {
    iso: raw,
    date: `${yearText}-${monthText}-${dayText}`,
    label: `${yearText} 年 ${month} 月 ${day} 日 ${hourText}:${minuteText}（北京时间）`,
  };
}

export function validateReleaseMetadata(environment = process.env) {
  const apkPath = path.resolve(required(environment, "RELEASE_3_0_73_APK_PATH"));
  const expectedHash = required(environment, "RELEASE_3_0_73_APK_SHA256");
  const expectedBytesText = required(environment, "RELEASE_3_0_73_APK_BYTES");
  const releasedAt = releaseTime(required(environment, "RELEASE_3_0_73_RELEASED_AT"));
  const expectedBytes = Number(expectedBytesText);

  if (!apkPath.toLowerCase().endsWith(".apk") || !fs.existsSync(apkPath) || !fs.statSync(apkPath).isFile()) {
    throw new Error("RELEASE_3_0_73_APK_PATH must point to the signed APK");
  }
  if (!/^[a-f0-9]{64}$/u.test(expectedHash)) {
    throw new Error("RELEASE_3_0_73_APK_SHA256 must be the exact lowercase digest");
  }
  if (!/^\d+$/u.test(expectedBytesText) || !Number.isSafeInteger(expectedBytes) || expectedBytes <= 0) {
    throw new Error("RELEASE_3_0_73_APK_BYTES must be the exact positive byte count");
  }
  const actualBytes = fs.statSync(apkPath).size;
  const actualHash = sha256File(apkPath);
  if (actualBytes !== expectedBytes) {
    throw new Error(`signed APK byte count mismatch: ${actualBytes}`);
  }
  if (actualHash !== expectedHash) {
    throw new Error(`signed APK SHA-256 mismatch: ${actualHash}`);
  }
  return {
    apkPath,
    apkBytes: actualBytes,
    apkHash: actualHash,
    apkMegabytes: (actualBytes / 1024 / 1024).toFixed(1),
    releasedAt,
  };
}

const releaseHighlights = `const releaseHighlights = [
  {
    label: '首页',
    title: '找功能在小屏更完整，与学习教练各归其位',
    desc: '标题、说明、输入框和搜索操作分开呈现，已有字面匹配与自然语言匹配继续沿用。',
  },
  {
    label: '释义',
    title: '背单词时，中文释义可以按自己的习惯显示',
    desc: '填词练习会给出足够的词义提示，不必只靠主动朗读猜测目标单词。',
  },
  {
    label: '刷卡',
    title: '卡片信息和记忆操作重新分层，先回忆再核对',
    desc: '题面、释义、例句与记忆反馈各归其位，常见屏高下的阅读和点击路径更清楚。',
  },
  {
    label: '主题',
    title: '全局配色可以跟随装扮，也可以单独选择',
    desc: '普通主题初始为每套 1000 金币；六套限定主题随对应成就解锁，不提供金币购买入口。',
  },
]`;

const changelogTitle = "知潮 3.0.73：首页找功能、刷卡提示与全局主题升级";
const changelogEntry = (date) => `  {
    date: '${date}',
    title: '${changelogTitle}',
    desc: '首页的“问朵朵·找功能”重新整理小屏布局，标题、说明、输入框与搜索操作分开呈现，减少互相挤压。英语刷卡学习可按个人习惯选择是否显示中文释义，填词练习也会给出足够的词义提示；卡片信息层级和记忆操作区同步收拢，便于先回忆再核对。新增全局主题设置，可跟随当前朵朵装扮或单独选择界面配色；普通主题初始为每套 1000 金币并永久解锁，六套限定主题则随对应成就永久解锁，不提供金币购买入口。主题只改变界面视觉，不改变已有学习数据和装扮。软件下载确认页新增“访问知潮官网”入口，并继续由用户主动开始下载。',
  },`;

export function prepareSources(sources, metadata) {
  let app = sources.app;
  let download = sources.download;
  let audit = sources.audit;

  app = replaceExactlyOrAlready(app,
    `const APP_VERSION = '${PREVIOUS_VERSION}'`,
    `const APP_VERSION = '${RELEASE_VERSION}'`,
    "App version");
  app = replacePatternExactly(app,
    /const APP_RELEASED_AT = '[^']+'\r?\nconst APP_RELEASED_AT_LABEL = '[^']+'/u,
    `const APP_RELEASED_AT = '${metadata.releasedAt.iso}'\nconst APP_RELEASED_AT_LABEL = '${metadata.releasedAt.label}'`,
    "App release time");
  app = replacePatternExactly(app,
    /const releaseHighlights = \[[\s\S]*?\r?\n\]\r?\n\r?\nconst widgetHighlights/u,
    `${releaseHighlights}\n\nconst widgetHighlights`,
    "release highlights");

  const targetReleaseEntry = /  \{\r?\n    date: '[^']+',\r?\n    title: '知潮 3\.0\.73：首页找功能、刷卡提示与全局主题升级',\r?\n    desc: '[^']*',\r?\n  \},/u;
  const targetReleaseMatches = [...app.matchAll(new RegExp(targetReleaseEntry.source, "gu"))];
  if (targetReleaseMatches.length === 1) {
    app = app.replace(targetReleaseEntry, changelogEntry(metadata.releasedAt.date));
  } else if (targetReleaseMatches.length === 0) {
    app = replacePatternExactly(app,
      /const changelog = \[\r?\n/u,
      `const changelog = [\n${changelogEntry(metadata.releasedAt.date)}\n`,
      "changelog insertion");
  } else {
    throw new Error("changelog contains duplicate 3.0.73 entries");
  }
  if (countOccurrences(app, changelogTitle) !== 1) {
    throw new Error("changelog must contain exactly one 3.0.73 entry");
  }

  app = replaceExactlyOrAlready(app,
    `<span>知潮 ${PREVIOUS_VERSION} 新功能</span>`,
    `<span>知潮 ${RELEASE_VERSION} 新功能</span>`,
    "release story version");
  app = replaceExactlyOrAlready(app,
    "英语学习、足迹与找功能，继续变得更顺手",
    "找功能、刷卡提示与全局主题，继续变得更顺手",
    "release story title");
  app = replaceExactlyOrAlready(app,
    "复习和模考更完整，九图足迹可以点开看大图，自然语言找功能也会把入口说明白。",
    "首页找功能恢复完整布局，刷卡可以按习惯显示中文释义，六套限定主题也可以预览和解锁。",
    "release story summary");

  download = replacePatternExactly(download,
    /<meta name="zhichao-apk-size-bytes" content="\d+" \/>/u,
    `<meta name="zhichao-apk-size-bytes" content="${metadata.apkBytes}" />`,
    "download APK bytes");
  download = replacePatternExactly(download,
    /<meta name="zhichao-apk-sha256" content="[A-Fa-f0-9]{64}" \/>/u,
    `<meta name="zhichao-apk-sha256" content="${metadata.apkHash.toUpperCase()}" />`,
    "download APK hash");
  download = download.replaceAll(PREVIOUS_VERSION, RELEASE_VERSION);
  download = replacePatternExactly(download,
    /<span>versionCode \d+<\/span>/u,
    `<span>versionCode ${RELEASE_BUILD}</span>`,
    "download version code");
  download = replacePatternExactly(download,
    /<p class="release-time">最新更新：<time datetime="[^"]+">[^<]+<\/time><\/p>/u,
    `<p class="release-time">最新更新：<time datetime="${metadata.releasedAt.iso}">${metadata.releasedAt.label}</time></p>`,
    "download exact Beijing release time");
  download = replacePatternExactly(download,
    /<div class="fact"><small>安装包<\/small><strong>[^<]+<\/strong><span>Android · arm64<\/span><\/div>/u,
    `<div class="fact"><small>安装包</small><strong>${metadata.apkMegabytes} MB</strong><span>Android · arm64</span></div>`,
    "download visible APK size");
  download = replacePatternExactly(download,
    /<div class="release-notes">[\s\S]*?<\/div>\r?\n          <\/section>/u,
    `<div class="release-notes">
              <div class="release-note"><b>01</b><div><strong>首页找功能恢复完整布局</strong><span>小屏下标题、说明、输入框和搜索操作分开呈现，减少互相挤压。</span></div></div>
              <div class="release-note"><b>02</b><div><strong>刷卡可按习惯显示中文释义</strong><span>填词练习会给出词义提示，不必只靠朗读判断目标单词。</span></div></div>
              <div class="release-note"><b>03</b><div><strong>卡片信息与记忆操作更清楚</strong><span>题面、释义、例句和记忆反馈重新分层，常见屏高下更易阅读和点击。</span></div></div>
              <div class="release-note"><b>04</b><div><strong>全局主题可跟随装扮或单独选择</strong><span>普通主题初始为每套 1000 金币；六套限定主题随对应成就解锁。</span></div></div>
            </div>
          </section>`,
    "download release notes");

  audit = replacePatternExactly(audit,
    /^\s*\["3\.0\.(?:72|73) 新功能引导与下载身份一致",.*$/mu,
    '  ["3.0.73 新功能引导与下载身份一致", ["const APP_VERSION = \'3.0.73\'", "知潮 3.0.73 新功能", "首页找功能", "中文释义", "普通主题", "1000 金币", "六套限定主题", "成就解锁"].every((phrase) => sources["src/App.tsx"].includes(phrase))],',
    "public copy current release check");
  audit = replacePatternExactly(audit,
    /^\s*\["下载确认页保留 3\.0\.(?:72|73) 精确包身份、非强制更新与备案",.*$/mu,
    `  ["下载确认页保留 3.0.73 精确包身份、非强制更新与备案", ["3.0.73", "versionCode 110", "${metadata.apkBytes}", "${metadata.apkHash.toUpperCase()}", "${metadata.apkMegabytes} MB", "非强制更新", "最新更新：", "（北京时间）", "首页找功能", "中文释义", "普通主题", "1000 金币", "六套限定主题", "成就解锁", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],`,
    "public copy exact package check");

  const currentChangelogAudit = '  ["3.0.73 更新日志已准备", ["知潮 3.0.73：首页找功能、刷卡提示与全局主题升级", "问朵朵·找功能", "中文释义", "普通主题", "1000 金币", "六套限定主题", "成就解锁", "访问知潮官网"].every((phrase) => sources["src/App.tsx"].includes(phrase))],';
  const changelogAuditCount = countOccurrences(audit, '["3.0.73 更新日志已准备"');
  if (changelogAuditCount === 0) {
    audit = replacePatternExactly(audit,
      /^(\s*\["3\.0\.72 更新日志已准备",.*)$/mu,
      `${currentChangelogAudit}\n$1`,
      "public copy changelog insertion");
  } else if (changelogAuditCount !== 1) {
    throw new Error("public copy audit contains duplicate 3.0.73 changelog checks");
  }

  return { app, download, audit };
}

function writePreparedSources(paths, prepared) {
  const temporaryPaths = Object.fromEntries(Object.entries(paths).map(([key, filePath]) => [
    key,
    `${filePath}.3.0.73-next-${process.pid}`,
  ]));
  try {
    for (const key of ["app", "download", "audit"]) {
      fs.writeFileSync(temporaryPaths[key], prepared[key], { flag: "wx" });
    }
    for (const key of ["app", "download", "audit"]) {
      fs.renameSync(temporaryPaths[key], paths[key]);
    }
  } catch (error) {
    for (const filePath of Object.values(temporaryPaths)) {
      if (fs.existsSync(filePath)) fs.rmSync(filePath);
    }
    throw error;
  }
}

function main() {
  const unknown = process.argv.slice(2).filter((argument) => argument !== "--apply");
  if (unknown.length > 0) throw new Error(`unsupported arguments: ${unknown.join(", ")}`);
  const apply = process.argv.includes("--apply");
  if (apply && process.env.PREPARE_RELEASE_3_0_73_APPROVED !== APPROVAL) {
    throw new Error(`apply requires PREPARE_RELEASE_3_0_73_APPROVED=${APPROVAL}`);
  }
  const metadata = validateReleaseMetadata();
  const paths = {
    app: path.join(root, "src", "App.tsx"),
    download: path.join(root, "public", "download", "index.html"),
    audit: path.join(root, "scripts", "audit-public-copy.mjs"),
  };
  const sources = Object.fromEntries(Object.entries(paths).map(([key, filePath]) => [
    key,
    fs.readFileSync(filePath, "utf8"),
  ]));
  const prepared = prepareSources(sources, metadata);
  console.log(`MODE=${apply ? "apply" : "preview"}`);
  console.log(`VERSION=${RELEASE_VERSION}`);
  console.log(`BUILD=${RELEASE_BUILD}`);
  console.log(`APK_BYTES=${metadata.apkBytes}`);
  console.log(`APK_SHA256=${metadata.apkHash}`);
  console.log(`RELEASED_AT=${metadata.releasedAt.iso}`);
  if (!apply) return;
  writePreparedSources(paths, prepared);
  console.log("WEBSITE_RELEASE_SOURCE=prepared");
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
