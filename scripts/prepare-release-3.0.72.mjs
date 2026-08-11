import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const RELEASE_VERSION = "3.0.72";
export const RELEASE_BUILD = 109;
const PREVIOUS_VERSION = "3.0.71";
const APPROVAL = "PREPARE_3_0_72_AFTER_SIGNED_APK_VERIFICATION";
const root = path.resolve(import.meta.dirname, "..");

function replaceExactly(source, needle, replacement, label) {
  const first = source.indexOf(needle);
  if (first < 0 || source.indexOf(needle, first + needle.length) >= 0) {
    throw new Error(`${label} does not have one exact replacement target`);
  }
  return source.slice(0, first) + replacement + source.slice(first + needle.length);
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

function sha256File(filePath) {
  return createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function releaseTime(raw) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):00\+08:00$/u.exec(raw);
  if (!match) {
    throw new Error("RELEASE_3_0_72_RELEASED_AT must be an exact +08:00 minute timestamp");
  }
  const [, year, month, day, hour, minute] = match;
  return {
    iso: raw,
    date: `${year}-${month}-${day}`,
    label: `${year} 年 ${Number(month)} 月 ${Number(day)} 日 ${hour}:${minute}（北京时间）`,
  };
}

export function validateReleaseMetadata(environment = process.env) {
  const apkPath = path.resolve(String(environment.RELEASE_3_0_72_APK_PATH ?? ""));
  const expectedHash = String(environment.RELEASE_3_0_72_APK_SHA256 ?? "").toLowerCase();
  const expectedBytes = Number(environment.RELEASE_3_0_72_APK_BYTES);
  const releasedAt = releaseTime(String(environment.RELEASE_3_0_72_RELEASED_AT ?? ""));

  if (!apkPath.toLowerCase().endsWith(".apk") || !fs.existsSync(apkPath)) {
    throw new Error("RELEASE_3_0_72_APK_PATH must point to the signed APK");
  }
  if (!/^[a-f0-9]{64}$/u.test(expectedHash)) {
    throw new Error("RELEASE_3_0_72_APK_SHA256 must be the exact lowercase digest");
  }
  if (!Number.isSafeInteger(expectedBytes) || expectedBytes <= 0) {
    throw new Error("RELEASE_3_0_72_APK_BYTES must be the exact positive byte count");
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
    label: '复习',
    title: '到期词卡直接回到今天，不只展示一条曲线',
    desc: '复习队列由服务端掌握度统一安排，每日新词保持上限，换设备后仍按同一进度继续。',
  },
  {
    label: '模考',
    title: '25 分钟覆盖单选、完形与阅读，交卷再逐题复盘',
    desc: '模拟考试支持中途续答和幂等提交；AI 生成的学习内容仍需结合教材、考试大纲与可靠来源核对。',
  },
  {
    label: '足迹',
    title: '九张图片按数量排版，点开就能看大图',
    desc: '单图、双图、四图和多图采用不同布局，此刻状态最多三项、标签最多五项。',
  },
  {
    label: '直达',
    title: '找功能会把名称、用途和命中理由说明白',
    desc: '改进“病历”等自然语言表达的匹配；当前装扮也会联动足迹、悬浮朵朵与截图问朵朵的视觉。',
  },
]`;

const changelogEntry = (date) => `  {
    date: '${date}',
    title: '知潮 3.0.72：英语复习、九图足迹与找功能体验升级',
    desc: '英语刷卡学习补齐由服务端掌握度驱动的到期复习队列，并新增 25 分钟模拟考试，覆盖单项选择、完形填空和阅读理解，提交后可查看逐题解析；每日本新词仍设上限，四本词书当前先提供已校验的首组内容，后续内容会按校验结果扩充。足迹一次最多选择九张图片，按数量自动排版并支持点开看大图，此刻状态与标签可多选；已穿戴装扮会同步影响足迹封面、悬浮朵朵和截图问朵朵的配色与边框。“问朵朵·找功能”补充入口名称、说明和命中理由，并改进“病历”等自然语言表达的匹配。医疗内容改为分级提示，避免把普通学习与生活内容一概拦截；黄赌毒政、未成年人犯罪、暴力以及提示词注入和越狱防护继续启用。AI 生成的学习内容可能有误，请结合教材、考试大纲和可靠来源核对。',
  },`;

export function prepareSources(sources, metadata) {
  let app = sources.app;
  let download = sources.download;
  let audit = sources.audit;

  app = replaceExactly(app,
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
  app = replacePatternExactly(app,
    /const changelog = \[\r?\n/u,
    `const changelog = [\n${changelogEntry(metadata.releasedAt.date)}\n`,
    "changelog insertion");
  app = replaceExactly(app,
    `<span>知潮 ${PREVIOUS_VERSION} 新功能</span>`,
    `<span>知潮 ${RELEASE_VERSION} 新功能</span>`,
    "release story version");
  app = replaceExactly(app,
    "把书架、资料导入和手写，收进一套 GoodNotes 式笔记体验",
    "英语学习、足迹与找功能，继续变得更顺手",
    "release story title");
  app = replaceExactly(app,
    "PDF 和图片打开就能继续写，翻页、缩放与长笔记书写也更流畅。",
    "复习和模考更完整，九图足迹可以点开看大图，自然语言找功能也会把入口说明白。",
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
    /<time datetime="[^"]+">[^<]+<\/time>/u,
    `<time datetime="${metadata.releasedAt.iso}">${metadata.releasedAt.label}</time>`,
    "download release time");
  download = replaceExactly(download,
    '<div class="fact"><small>安装包</small><strong>214.9 MB</strong><span>Android · arm64</span></div>',
    `<div class="fact"><small>安装包</small><strong>${metadata.apkMegabytes} MB</strong><span>Android · arm64</span></div>`,
    "download visible APK size");
  download = replacePatternExactly(download,
    /<div class="release-notes">[\s\S]*?<\/div>\r?\n          <\/section>/u,
    `<div class="release-notes">
              <div class="release-note"><b>01</b><div><strong>复习与模考更完整</strong><span>到期词卡会进入今天的复习队列，也可开始覆盖三类题型的限时模拟考试。</span></div></div>
              <div class="release-note"><b>02</b><div><strong>足迹支持九图与大图查看</strong><span>图片按数量自动排版，点开即可查看大图，状态与标签可多选。</span></div></div>
              <div class="release-note"><b>03</b><div><strong>找功能会把入口说明白</strong><span>搜索结果补充名称、用途和命中理由，并改进“病历”等自然语言表达。</span></div></div>
              <div class="release-note"><b>04</b><div><strong>装扮视觉联动更多入口</strong><span>足迹封面、悬浮朵朵与截图问朵朵会跟随当前装扮切换配色与边框。</span></div></div>
            </div>
          </section>`,
    "download release notes");

  audit = replaceExactly(audit,
    '["3.0.71 新功能引导与下载身份一致", ["const APP_VERSION = \'3.0.71\'", "知潮 3.0.71 新功能", "GoodNotes 式笔记体验", "书架", "PDF 和图片", "提笔就写"].every((phrase) => sources["src/App.tsx"].includes(phrase))],',
    '["3.0.72 新功能引导与下载身份一致", ["const APP_VERSION = \'3.0.72\'", "知潮 3.0.72 新功能", "英语学习、足迹与找功能", "25 分钟", "九张图片", "病历"].every((phrase) => sources["src/App.tsx"].includes(phrase))],',
    "public copy current release check");
  audit = replaceExactly(audit,
    '["下载确认页保留 3.0.71 精确包身份、非强制更新与备案", ["3.0.71", "225361289", "93A7623AEB3FADD9693F3EB5C7B5E02A8390D49F45B2DB13324D5EEA5B2EBA8E", "214.9 MB", "非强制更新", "本次更新", "朵朵笔记", "PDF 和图片", "手写", "流畅度", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],',
    `["下载确认页保留 3.0.72 精确包身份、非强制更新与备案", ["3.0.72", "${metadata.apkBytes}", "${metadata.apkHash.toUpperCase()}", "${metadata.apkMegabytes} MB", "非强制更新", "本次更新", "复习与模考", "九图", "找功能", "装扮视觉", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],`,
    "public copy exact package check");
  audit = replaceExactly(audit,
    '["3.0.71 朵朵笔记更新日志已准备", ["知潮 3.0.71：朵朵笔记的纸面体验再升级", "GoodNotes 式", "书架", "PDF 和图片", "手写工具", "长笔记渲染"].every((phrase) => sources["src/App.tsx"].includes(phrase))],',
    '["3.0.72 更新日志已准备", ["知潮 3.0.72：英语复习、九图足迹与找功能体验升级", "25 分钟模拟考试", "九张图片", "问朵朵·找功能", "医疗内容改为分级提示"].every((phrase) => sources["src/App.tsx"].includes(phrase))],\n  ["3.0.71 朵朵笔记更新日志已保留", ["知潮 3.0.71：朵朵笔记的纸面体验再升级", "GoodNotes 式", "书架", "PDF 和图片", "手写工具", "长笔记渲染"].every((phrase) => sources["src/App.tsx"].includes(phrase))],',
    "public copy changelog check");

  return { app, download, audit };
}

function writeAtomically(filePath, source) {
  const temporary = `${filePath}.3.0.72-next`;
  fs.writeFileSync(temporary, source, { flag: "wx" });
  fs.renameSync(temporary, filePath);
}

function main() {
  const unknown = process.argv.slice(2).filter((argument) => argument !== "--apply");
  if (unknown.length > 0) throw new Error(`unsupported arguments: ${unknown.join(", ")}`);
  const apply = process.argv.includes("--apply");
  if (apply && process.env.PREPARE_RELEASE_3_0_72_APPROVED !== APPROVAL) {
    throw new Error(`apply requires PREPARE_RELEASE_3_0_72_APPROVED=${APPROVAL}`);
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
  for (const key of ["app", "download", "audit"]) writeAtomically(paths[key], prepared[key]);
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
