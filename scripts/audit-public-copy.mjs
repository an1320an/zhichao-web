import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sources = Object.fromEntries(await Promise.all([
  "src/App.tsx",
  "public/legal/privacy.html",
  "public/legal/terms.html",
  "public/legal/disclaimer.html",
  "public/legal/complaints.html",
].map(async (name) => [name, await readFile(path.join(root, name), "utf8")])));

const checks = [
  ["官网如实写明邀请制", sources["src/App.tsx"].includes("Android 移动端当前为邀请制内测")],
  ["官网不得误写开放注册", !sources["src/App.tsx"].includes("现已开放注册")],
  ["官网不得误写无需邀请码", !sources["src/App.tsx"].includes("无需邀请码")],
  ["隐私政策如实写明服务端规则", sources["public/legal/privacy.html"].includes("服务端审核文案库")],
  ["隐私政策写明临床工具输入不上传", sources["public/legal/privacy.html"].includes("临床工具输入") && sources["public/legal/privacy.html"].includes("不会把这些具体输入上传")],
  ["隐私政策覆盖精确闹钟权限", sources["public/legal/privacy.html"].includes("USE_EXACT_ALARM")],
  ["隐私政策覆盖电池优化权限", sources["public/legal/privacy.html"].includes("REQUEST_IGNORE_BATTERY_OPTIMIZATIONS")],
  ["隐私政策覆盖前台响铃服务", sources["public/legal/privacy.html"].includes("FOREGROUND_SERVICE_SPECIAL_USE")],
  ["隐私政策覆盖全屏提醒权限", sources["public/legal/privacy.html"].includes("USE_FULL_SCREEN_INTENT")],
  ["隐私政策覆盖严格专注无障碍服务", sources["public/legal/privacy.html"].includes("BIND_ACCESSIBILITY_SERVICE")],
  ["用户协议写明注销保留例外", sources["public/legal/terms.html"].includes("最小同意凭证")],
  ["投诉页写明注销保留例外", sources["public/legal/complaints.html"].includes("最小同意凭证")],
  ["公开文案不得笼统承诺删除全部个人数据", !Object.values(sources).some((text) => text.includes("删除你的全部个人数据"))],
  ["政策不得把全部服务18+误写成国家一刀切要求", !Object.values(sources).some((text) => text.includes("按国家规定仅向年满 18"))],
  ["免责声明写明本地计算边界", sources["public/legal/disclaimer.html"].includes("设备本地、确定性公式工具")],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length > 0) {
  for (const [label] of failed) console.error(`FAIL: ${label}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks.length} 项公开文案一致性检查`);
}
