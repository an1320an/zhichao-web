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
const hiddenServiceTerms = /\bAI\b|人工智能|大模型|DeepSeek|生成式|模型服务|智能生成|智能对话/;
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
  ["公开网页不出现客户端内部服务术语", !hiddenServiceTerms.test(publicCopy)],
  ["官网主域统一为 huaix.cn", sources["index.html"].includes('href="https://huaix.cn/"') && sources["src/App.tsx"].includes("https://huaix.cn/download/index.html")],
  ["官网展示真实 ICP 备案号", sources["src/App.tsx"].includes("陕ICP备2026019822号") && sources["public/404.html"].includes("陕ICP备2026019822号")],
  ["官网统一登记运营主体", sources["src/App.tsx"].includes("旬阳市槐序软件工作室")],
  ["公开联系邮箱已统一", publicCopy.includes("2014302010@qq.com") && !publicCopy.includes("an1320an@gmail.com")],
  ["双抖音入口保持可点击且职责分开", ["https://v.douyin.com/4Tl7oRzN9KM/", "槐序学长", "https://v.douyin.com/fs6MHFOU5q4/", "槐序工坊", "用户支持", "工作室与合作"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["网站隐私说明同步双联系渠道", ["2026 年 8 月 8 日", "https://v.douyin.com/4Tl7oRzN9KM/", "https://v.douyin.com/fs6MHFOU5q4/"].every((phrase) => sources["public/website-privacy.html"].includes(phrase))],
  ["更新日志默认显示三条并可展开", sources["src/App.tsx"].includes("changelog.slice(0, 3)") && sources["src/App.tsx"].includes("showAllChangelog") && sources["src/App.tsx"].includes("查看更多更新")],
  ["3.0.66 记账专题更新日志已准备", ["知潮 3.0.66：记账界面与长期账本能力升级", "分类层级与分类预算", "24 个月趋势", "归档账户恢复", "跨设备快捷模板"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.67 朵朵笔记新内核更新日志已准备", ["知潮 3.0.67：朵朵笔记升级全新内核", "纸面优先", "旧笔记", "查看和导出", "尽力单向导入", "知识卡片"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
  ["3.0.69 提醒体系更新日志已准备", ["知潮 3.0.69：计划提醒改由系统闹钟或日历承接", "不会把它表述为已经同步", "普通通知", "在对应系统应用中修改或删除", "足迹图片不显示"].every((phrase) => sources["src/App.tsx"].includes(phrase))],
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
  ["下载确认页保留版本、大小、本次更新与备案", ["3.0.67", "211.5 MB", "本次更新", "朵朵笔记已升级全新内核", "旧笔记", "查看和导出", "陕ICP备2026019822号", "陕公网安备61092802000137号"].every((phrase) => sources["public/download/index.html"].includes(phrase))],
  ["下载确认页不向普通用户展示安装包哈希", !/SHA-?256|f29cab3959bf030d93aff07744ba0d976e94102e6dcd1aa30273c961c3e20c16/i.test(sources["public/download/index.html"])],
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
