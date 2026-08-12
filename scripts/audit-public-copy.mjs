import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicCopyFiles = [
  "index.html",
  "src/App.tsx",
  "public/invite/index.html",
  "public/404.html",
  "public/website-privacy.html",
  "public/download/index.html",
];

const sources = Object.fromEntries(
  publicCopyFiles.map((name) => [name, fs.readFileSync(path.join(root, name), "utf8")]),
);
const publicCopy = Object.values(sources).join("\n");
const hiddenServiceTerms = /DeepSeek|system prompt|featureType|模型密钥|AI 中央清单|内部模型路由/;
const removedAppAgreementFiles = [
  "public/legal/privacy.html",
  "public/legal/terms.html",
  "public/legal/disclaimer.html",
  "public/legal/complaints.html",
];
const featureAssets = [
  "study-coach.webp",
  "pet-growth.webp",
  "dodo-assistant.webp",
  "exam-bank.webp",
  "spaced-review.webp",
  "career-path.webp",
  "bookkeeping.webp",
  "floating-dodo.webp",
  "cloud-sync.webp",
];
const inviteWelcomeAsset = path.join(
  root,
  "public",
  "invite",
  "zhichao-invite-welcome-v1.webp",
);

const checks = [
  ["公开网页不泄露内部模型与服务实现术语", !hiddenServiceTerms.test(publicCopy)],
  ["官网主域统一为 huaix.cn", sources["index.html"].includes('href="https://huaix.cn/"') && sources["src/App.tsx"].includes("https://huaix.cn/download/index.html")],
  ["官网展示真实 ICP 备案号", sources["src/App.tsx"].includes("陕ICP备2026019822号") && sources["public/404.html"].includes("陕ICP备2026019822号")],
  ["官网统一登记运营主体", sources["src/App.tsx"].includes("旬阳市槐序软件工作室")],
  ["公开联系邮箱已统一", publicCopy.includes("2014302010@qq.com") && !publicCopy.includes("an1320an@gmail.com")],
  ["双抖音入口保持可点击且职责分开", ["https://v.douyin.com/4Tl7oRzN9KM/", "槐序学长", "https://v.douyin.com/fs6MHFOU5q4/", "槐序工坊", "用户支持", "工作室与合作"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["网站隐私说明同步双联系渠道", ["2026 年 8 月 8 日", "https://v.douyin.com/4Tl7oRzN9KM/", "https://v.douyin.com/fs6MHFOU5q4/"].every((phrase) => sources["public/website-privacy.html"].includes(phrase))],
  ["更新日志固定显示最近三条且无失效历史入口", sources["src/App.tsx"].includes("changelog.slice(0, 3)") && sources["src/App.tsx"].includes("官网固定展示最近三次正式更新") && sources["src/App.tsx"].includes("useHashNavigation()") && sources["src/App.tsx"].includes("scrollIntoView") && !sources["src/App.tsx"].includes("showAllChangelog") && !sources["src/App.tsx"].includes("查看更多更新")],
  ["3.0.77 本轮同步说明与通知能力边界一致", ["知潮 3.0.77：政策、功能导览与官网更新记录同步", "隐私确认", "五步直达", "最近三次", "远程 Push 仍未开放", "非强制更新"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.66 记账专题更新日志已准备", ["知潮 3.0.66：记账界面与长期账本能力升级", "分类层级与分类预算", "24 个月趋势", "归档账户恢复", "跨设备快捷模板"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.67 朵朵笔记新内核更新日志已准备", ["知潮 3.0.67：朵朵笔记升级全新内核", "纸面优先", "旧笔记", "查看和导出", "尽力单向导入", "知识卡片"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.75 专属学习计划更新日志已准备", ["知潮 3.0.75：专属学习计划与服务器维护提示", "不超过五步", "掌握度", "错题", "遗忘", "阶段路线", "当前站点", "每日行动", "动态重排", "不承诺考试结果", "登录前", "注册", "预计恢复时间", "普通网络失败不会被误报成维护", "更新弹窗改为短摘要", "给你的一封信", "违法违规", "医疗谣言", "非强制更新"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.74 发布基线更新日志已准备", ["知潮 3.0.74：正式安装包与发布基线维护", "首页找功能", "英语刷卡提示", "全局主题", "九图足迹与时光回看", "朵朵彩蛋", "不改变账号数据", "金币奖励", "既有安全规则", "非强制更新"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.73 更新日志已准备", ["知潮 3.0.73：首页、刷卡、主题与足迹体验升级", "问朵朵·找功能", "中文释义", "普通主题", "1000 金币", "六套限定主题", "成就永久解锁", "九图长按排序", "当天上下文详情", "四种时光回看场景", "AI 日签", "朵朵百态·初遇篇", "20 张免费心情彩蛋", "彩蛋册", "文字创意参与共创", "账单朵朵短评", "MDT", "黄赌毒政", "提示注入保护", "AI 智能服务统一使用一次简洁授权", "规则兜底", "安全筛查和去标识", "版本化更新并可回滚", "记账短评仅作人工审核参考", "不会自动训练第三方模型", "访问知潮官网"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.72 更新日志已准备", ["知潮 3.0.72：英语复习、九图足迹与找功能体验升级", "25 分钟模拟考试", "九张图片", "问朵朵·找功能", "医疗内容改为分级提示"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.71 朵朵笔记更新日志已保留", ["知潮 3.0.71：朵朵笔记的纸面体验再升级", "GoodNotes 式", "书架", "PDF 和图片", "手写工具", "长笔记渲染"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.70 统一更新日志保留", ["知潮 3.0.70：刷卡学习、找功能与学习体验升级", "内建键盘缺字补全", "问朵朵·找功能"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["未公开的 3.0.68/3.0.69 不再作为独立日志", !["知潮 3.0.68：", "知潮 3.0.69："].some((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.77 首页发布身份与功能说明一致", ["const APP_VERSION = '3.0.77'", "知潮 3.0.77 正式更新", "学习教练", "个人内容整理", "笔记与文档交付", "时光海岸", "深海探索"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["提醒体系更新文案不作送达绝对承诺", !["一定会提醒", "保证送达", "已经同步成功"].some((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["笔记升级文案不作数据零风险绝对承诺", !["百分之百迁移", "数据绝不会丢失", "完整迁移所有旧笔记"].some((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["公开站不复制 App 协议或 App 隐私政策", removedAppAgreementFiles.every((name) => !fs.existsSync(path.join(root, name)))],
  ["公开页面不再链接 App 协议或隐私页面", !/\/legal\/(?:privacy|terms|disclaimer|complaints)\.html/.test(publicCopy)],
  ["网站隐私说明仅覆盖当前网站实际处理", sources["public/website-privacy.html"].includes("网站服务器访问日志") && sources["public/website-privacy.html"].includes("不适用于知潮 Android 客户端")],
  ["主页与邀请页均可访问网站隐私说明", sources["src/App.tsx"].includes("/website-privacy.html") && sources["public/invite/index.html"].includes("/website-privacy.html")],
  ["九项功能使用九张独立生成配图", featureAssets.every((name) => fs.existsSync(path.join(root, "public", "features", name)))],
  ["九项功能保持三列完整网格", sources["src/App.tsx"].includes('className="feature-grid"')],
  ["主站与邀请页先进入可见下载确认页", sources["src/App.tsx"].includes("https://huaix.cn/download/index.html") && sources["public/invite/index.html"].includes('href="/download/index.html"')],
  ["下载确认页不自动触发 APK", sources["public/download/index.html"].includes('id="download-apk"') && sources["public/download/index.html"].includes("开始下载 APK") && !/meta\s+http-equiv=["']refresh|location\.(?:href|replace)|\.click\(\)/i.test(sources["public/download/index.html"])],
  ["下载确认页使用清晰的品牌标题", sources["public/download/index.html"].includes("<title>知潮官方下载</title>")],
  ["下载确认页提供清晰可见的官网入口", sources["public/download/index.html"].includes('<a class="website-link" href="/" aria-label="访问知潮官网首页">') && sources["public/download/index.html"].includes("访问知潮官网")],
  ["下载确认页提供键盘焦点与减少动态效果支持", sources["public/download/index.html"].includes("a:focus-visible") && sources["public/download/index.html"].includes("prefers-reduced-motion: reduce")],
  ["下载确认页保留 3.0.77 正式包身份、非强制更新与备案", ["3.0.77", "versionCode 114", "233211136", "5EFADC5AB357699EC26C0AB2E47C1AEEB257FB8ADD9602BE937F5181D63EDD31", "222.4 MB", "非强制更新", "最新更新：", "2026 年 8 月 12 日 18:37（北京时间）", "学习教练", "最近删除", "图片和 PDF", "沟通大字板", "时光海岸", "深海探索", "访问知潮官网", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],
  ["3.0.77 正式包与发布时间占位已清除", !["PENDING_3_0_77_APK_SIZE_BYTES", "PENDING_3_0_77_APK_SHA256", "PENDING_3_0_77_APK_SIZE_MB", "PENDING_3_0_77_RELEASED_AT", "正式发布后更新"].some((phrase) => publicCopy.includes(phrase))],
  ["下载确认页不向普通用户显示安装包哈希", !/<(?:code|details)[^>]*>[^<]*(?:SHA-?256|[a-f0-9]{64})/iu.test(sources["public/download/index.html"])],
  ["邀请页提供欢迎首屏和真实功能简介", ["欢迎来到知潮", "练得更有方向", "复习更有节奏", "朵朵陪你坚持", "三步开始"].every((phrase) => sources["public/invite/index.html"].includes(phrase))],
  ["邀请页使用独立欢迎插画", fs.existsSync(inviteWelcomeAsset) && sources["public/invite/index.html"].includes("/invite/zhichao-invite-welcome-v1.webp")],
  ["邀请页不作无法覆盖访问日志的绝对承诺", !sources["public/invite/index.html"].includes("不会收集你的任何个人信息") && sources["public/invite/index.html"].includes("不设置账号登录或信息填写表单")],
  ["邀请页展示真实 ICP 与公安联网备案", ["陕ICP备2026019822号", "陕公网安备61092802000137号", "beian.mps.gov.cn/#/query/webSearch?code=61092802000137", "/gongan.png"].every((phrase) => sources["public/invite/index.html"].includes(phrase))],
  ["邀请页使用清晰嫩芽品牌标志", sources["public/invite/index.html"].includes('aria-label="知潮嫩芽标志"') && !sources["public/invite/index.html"].includes(".brand-mark::before")],
  ["官网不预写未来收费或情感付费自辩", !["如果未来提供自愿支持", "增进与朵朵的情感关系"].some((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["共创说明采用事实表述而非关系排除清单", !sources["src/App.tsx"].includes("不代表股权、雇佣、商业代理或官方授权关系")],
  ["网站说明不夹带备案背书自辩或绝对承诺", !["不代表主管部门", "认可或背书", "不会收集任何个人信息"].some((phrase) => sources["public/website-privacy.html"].includes(phrase))],
  ["旧 CNAME 不再指向 huaipet.com", fs.readFileSync(path.join(root, "public", "CNAME"), "utf8").trim() === "huaix.cn"],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}: ${label}`);
}
if (failed.length > 0) process.exitCode = 1;
