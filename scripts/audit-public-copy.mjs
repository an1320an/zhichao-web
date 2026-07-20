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
  ["隐私政策写明规则回复不实时调用模型", sources["public/legal/privacy.html"].includes("不把完整对话交给云端大模型实时回答")],
  ["隐私政策写明脱敏聚合缺口的授权用途", sources["public/legal/privacy.html"].includes("按相同表达聚合达到门槛") && sources["public/legal/privacy.html"].includes("AI 数据授权")],
  ["隐私政策写明后台接收方与数据范围", sources["public/legal/privacy.html"].includes("接收方为第三方大模型服务商 DeepSeek") && sources["public/legal/privacy.html"].includes("最多 160 字短样例")],
  ["隐私政策写明撤回后的新输入边界", sources["public/legal/privacy.html"].includes("关闭后，新输入不再计入第三方模型处理")],
  ["隐私政策写明临床工具输入不上传", sources["public/legal/privacy.html"].includes("临床工具输入") && sources["public/legal/privacy.html"].includes("不会把这些具体输入上传")],
  ["隐私政策覆盖精确闹钟权限", sources["public/legal/privacy.html"].includes("USE_EXACT_ALARM")],
  ["隐私政策覆盖电池优化权限", sources["public/legal/privacy.html"].includes("REQUEST_IGNORE_BATTERY_OPTIMIZATIONS")],
  ["隐私政策覆盖前台响铃服务", sources["public/legal/privacy.html"].includes("FOREGROUND_SERVICE_SPECIAL_USE")],
  ["隐私政策覆盖全屏提醒权限", sources["public/legal/privacy.html"].includes("USE_FULL_SCREEN_INTENT")],
  ["隐私政策覆盖严格专注无障碍服务", sources["public/legal/privacy.html"].includes("BIND_ACCESSIBILITY_SERVICE")],
  ["知识树公共池写明默认公开边界", sources["public/legal/privacy.html"].includes("个人知识树默认加入公共学习池") && sources["public/legal/terms.html"].includes("不公开原始输入或账号身份")],
  ["知识树公共池写明撤回权", sources["public/legal/privacy.html"].includes("按单棵树撤回公共学习池") && sources["public/legal/terms.html"].includes("可在应用内将单棵知识树撤回公共池")],
  ["用户协议写明注销保留例外", sources["public/legal/terms.html"].includes("最小同意凭证")],
  ["投诉页写明注销保留例外", sources["public/legal/complaints.html"].includes("最小同意凭证")],
  ["公开文案不得笼统承诺删除全部个人数据", !Object.values(sources).some((text) => text.includes("删除你的全部个人数据"))],
  ["政策不得把全部服务18+误写成国家一刀切要求", !Object.values(sources).some((text) => text.includes("按国家规定仅向年满 18"))],
  ["免责声明写明本地计算边界", sources["public/legal/disclaimer.html"].includes("设备本地、确定性公式工具")],
  ["危机独立记录不得再宣称保存200字原话", !Object.values(sources).some((text) => text.includes("原话摘要（最长 200") || text.includes("含原话摘要"))],
  ["隐私政策写明危机元数据不关联账号", sources["public/legal/privacy.html"].includes("不保存账号、用户 ID、昵称、邮箱、联系方式或输入原话/摘要")],
  ["隐私政策如实说明原输入仍属聊天历史", sources["public/legal/privacy.html"].includes("仍会按第 1、5、8、9 章所述保存在账号聊天记录中")],
  ["危机匿名元数据写明180天清理", sources["public/legal/privacy.html"].includes("超过 180 天") && sources["public/legal/terms.html"].includes("180 天后自动清理")],
  ["公开文案不得承诺实时人工跟进", !Object.values(sources).some((text) => text.includes("并由人工跟进") || text.includes("用于人工关怀跟进"))],
  ["公开文案不得继续宣称第三方模型全关闭", !Object.values(sources).some((text) => text.includes("当前第三方模型功能已关闭") || text.includes("当前运行状态：未启用第三方大模型处理"))],
  ["官网与协议统一登记运营主体", ["src/App.tsx", "public/legal/privacy.html", "public/legal/terms.html", "public/legal/complaints.html"].every((name) => sources[name].includes("旬阳市槐序软件工作室"))],
  ["官网与协议统一抖音账号", ["src/App.tsx", "public/legal/privacy.html", "public/legal/terms.html", "public/legal/complaints.html"].every((name) => sources[name].includes("槐序工作室"))],
  ["公开源码不再保留旧抖音账号名或旧短链", !Object.values(sources).some((text) => /槐序学长|4vpWBY5MsL0|XTF17fnkqNE|N4weK8sUDmM/.test(text))],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length > 0) {
  for (const [label] of failed) console.error(`FAIL: ${label}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks.length} 项公开文案一致性检查`);
}
