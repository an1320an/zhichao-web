import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const publicCopyFiles = [
  "index.html",
  "src/App.tsx",
  "public/invite/index.html",
  "public/404.html",
  "public/legal/privacy.html",
  "public/legal/terms.html",
  "public/legal/disclaimer.html",
  "public/legal/complaints.html",
];

const sources = Object.fromEntries(
  publicCopyFiles.map((name) => [name, fs.readFileSync(path.join(root, name), "utf8")]),
);
const publicCopy = Object.values(sources).join("\n");
const hiddenServiceTerms = /\bAI\b|人工智能|大模型|DeepSeek|生成式/;
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
  ["官网展示真实 ICP 备案号", sources["src/App.tsx"].includes("陕ICP备2026019822号") && sources["public/legal/privacy.html"].includes("陕ICP备2026019822号")],
  ["官网统一登记运营主体", ["src/App.tsx", "public/legal/privacy.html", "public/legal/terms.html"].every((name) => sources[name].includes("旬阳市槐序软件工作室"))],
  ["网站隐私说明限定为静态展示与下载", sources["public/legal/privacy.html"].includes("不提供账号登录") && sources["public/legal/privacy.html"].includes("只适用于")],
  ["客户端条款明确在客户端内查看", sources["public/legal/terms.html"].includes("客户端内阅读") && sources["public/legal/privacy.html"].includes("客户端内置")],
  ["九项功能使用九张独立生成配图", featureAssets.every((name) => fs.existsSync(path.join(root, "public", "features", name)))],
  ["九项功能保持三列完整网格", sources["src/App.tsx"].includes('className="feature-grid"')],
  ["邀请码与下载使用新主域路径", sources["public/invite/index.html"].includes("/download/zhichao-mobile-release.apk")],
  ["旧 CNAME 不再指向 huaipet.com", fs.readFileSync(path.join(root, "public", "CNAME"), "utf8").trim() === "huaix.cn"],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}: ${label}`);
}
if (failed.length > 0) process.exitCode = 1;
