import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicCopyFiles = [
  "index.html",
  "src/App.tsx",
  "public/invite/index.html",
  "public/404.html",
  "public/website-privacy.html",
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

const checks = [
  ["公开网页不出现客户端内部服务术语", !hiddenServiceTerms.test(publicCopy)],
  ["官网主域统一为 huaix.cn", sources["index.html"].includes('href="https://huaix.cn/"') && sources["src/App.tsx"].includes("https://huaix.cn/download/")],
  ["官网展示真实 ICP 备案号", sources["src/App.tsx"].includes("陕ICP备2026019822号") && sources["public/404.html"].includes("陕ICP备2026019822号")],
  ["官网统一登记运营主体", sources["src/App.tsx"].includes("旬阳市槐序软件工作室")],
  ["公开联系邮箱已统一", publicCopy.includes("2014302010@qq.com") && !publicCopy.includes("an1320an@gmail.com")],
  ["抖音入口保持可点击直达", sources["src/App.tsx"].includes("href={DOUYIN_URL}") && sources["src/App.tsx"].includes("https://v.douyin.com/C8lWv7zLhz8/")],
  ["公开站不复制 App 协议或 App 隐私政策", removedAppAgreementFiles.every((name) => !fs.existsSync(path.join(root, name)))],
  ["公开页面不再链接 App 协议或隐私页面", !/\/legal\/(?:privacy|terms|disclaimer|complaints)\.html/.test(publicCopy)],
  ["网站隐私说明仅覆盖当前网站实际处理", sources["public/website-privacy.html"].includes("网站服务器访问日志") && sources["public/website-privacy.html"].includes("不适用于知潮 Android 客户端")],
  ["主页与邀请页均可访问网站隐私说明", sources["src/App.tsx"].includes("/website-privacy.html") && sources["public/invite/index.html"].includes("/website-privacy.html")],
  ["九项功能使用九张独立生成配图", featureAssets.every((name) => fs.existsSync(path.join(root, "public", "features", name)))],
  ["九项功能保持三列完整网格", sources["src/App.tsx"].includes('className="feature-grid"')],
  ["邀请码与下载使用新主域路径", sources["public/invite/index.html"].includes("/download/zhichao-mobile-release.apk")],
  ["邀请页不作无法覆盖访问日志的绝对承诺", !sources["public/invite/index.html"].includes("不会收集你的任何个人信息") && sources["public/invite/index.html"].includes("不设置账号登录或信息填写表单")],
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
