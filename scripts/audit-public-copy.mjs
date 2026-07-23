import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sources = Object.fromEntries(await Promise.all([
  "index.html",
  "src/App.tsx",
  "public/invite/index.html",
  "public/legal/privacy.html",
  "public/legal/terms.html",
  "public/legal/disclaimer.html",
  "public/legal/complaints.html",
].map(async (name) => [name, await readFile(path.join(root, name), "utf8")])));

const checks = [
  ["官网如实写明邀请制", sources["src/App.tsx"].includes("Android 移动端当前为邀请制内测")],
  ["官网不得误写开放注册", !sources["src/App.tsx"].includes("现已开放注册")],
  ["官网不得误写无需邀请码", !sources["src/App.tsx"].includes("无需邀请码")],
  ["官网如实写明邀请内测 AI", sources["src/App.tsx"].includes("邀请内测用户可在一项知情授权下使用 DeepSeek")],
  ["邀请码页如实写明规则与云端 AI 双引擎", sources["public/invite/index.html"].includes("规则与云端 AI 双引擎") && sources["public/invite/index.html"].includes("DeepSeek")],
  ["邀请码页不得继续宣称不调用云端模型", !sources["public/invite/index.html"].includes("不调用云端大模型") && !sources["public/invite/index.html"].includes("不实时调用云端大模型")],
  ["邀请码页提供复制按钮与剪贴板回退", sources["public/invite/index.html"].includes("id=\"copy-code\"") && sources["public/invite/index.html"].includes("navigator.clipboard.writeText") && sources["public/invite/index.html"].includes("document.execCommand(\"copy\")")],
  ["隐私政策写明单一授权覆盖实时AI、记忆整理与离线改进", sources["public/legal/privacy.html"].includes("内测 AI 数据授权是一项完整的可选 AI 服务授权") && sources["public/legal/privacy.html"].includes("提取长期记忆或待确认候选") && sources["public/legal/privacy.html"].includes("用于发现离线资源库未覆盖的场景")],
  ["隐私政策写明 DeepSeek 与服务商备案信息", sources["public/legal/privacy.html"].includes("Beijing-DeepseekChat-202404280016") && sources["public/legal/privacy.html"].includes("网信算备110108970550101240011号")],
  ["隐私政策不把服务商备案冒充应用备案", sources["public/legal/privacy.html"].includes("不等于知潮已完成其作为下游应用可能需要的全部登记、评估或备案")],
  ["隐私政策写明离线样本隐私边界", sources["public/legal/privacy.html"].includes("不附带用户 ID、邮箱、昵称和模型回复")],
  ["隐私政策写明撤回同时停止两项处理", sources["public/legal/privacy.html"].includes("新的实时 AI 请求不再发送给 DeepSeek") && sources["public/legal/privacy.html"].includes("新的输入也不再进入脱敏离线资源改进流程")],
  ["隐私政策写明临床工具输入不上传", sources["public/legal/privacy.html"].includes("临床工具输入") && sources["public/legal/privacy.html"].includes("不会把这些具体输入上传")],
  ["隐私政策覆盖精确闹钟权限", sources["public/legal/privacy.html"].includes("USE_EXACT_ALARM")],
  ["隐私政策覆盖电池优化权限", sources["public/legal/privacy.html"].includes("REQUEST_IGNORE_BATTERY_OPTIMIZATIONS")],
  ["隐私政策覆盖前台响铃服务", sources["public/legal/privacy.html"].includes("FOREGROUND_SERVICE_SPECIAL_USE")],
  ["隐私政策覆盖全屏提醒权限", sources["public/legal/privacy.html"].includes("USE_FULL_SCREEN_INTENT")],
  ["隐私政策覆盖严格专注无障碍服务", sources["public/legal/privacy.html"].includes("BIND_ACCESSIBILITY_SERVICE")],
  ["公共内容共创采用独立授权", ["src/App.tsx", "public/legal/privacy.html", "public/legal/terms.html"].every((name) => sources[name].includes("公共内容共创"))],
  ["共创授权写明未授权不能生产新内容", sources["public/legal/privacy.html"].includes("拒绝共创授权只会关闭新内容生产入口") && sources["public/legal/terms.html"].includes("不能继续使用上述新内容生产功能")],
  ["共创授权不捆绑只读学习", sources["public/legal/privacy.html"].includes("不影响已有题库、错题本、公开知识内容浏览") && sources["public/legal/terms.html"].includes("已有题库、错题本、公开内容浏览")],
  ["共创公共池写明自动复核与身份边界", sources["public/legal/privacy.html"].includes("3～5 轮自动交叉复核") && sources["public/legal/terms.html"].includes("原文件、账号、邮箱、昵称")],
  ["共创内容提供删除或撤下渠道", sources["public/legal/privacy.html"].includes("申请撤下已发布内容") && sources["public/legal/terms.html"].includes("申请撤下已发布内容")],
  ["用户协议写明注销保留例外", sources["public/legal/terms.html"].includes("最小同意凭证")],
  ["投诉页写明注销保留例外", sources["public/legal/complaints.html"].includes("最小同意凭证")],
  ["公开文案不得笼统承诺删除全部个人数据", !Object.values(sources).some((text) => text.includes("删除你的全部个人数据"))],
  ["政策不得把全部服务18+误写成国家一刀切要求", !Object.values(sources).some((text) => text.includes("按国家规定仅向年满 18"))],
  ["免责声明写明本地计算边界", sources["public/legal/disclaimer.html"].includes("设备本地、确定性公式工具")],
  ["危机记录不得继续宣称全部匿名", !Object.values(sources).some((text) => text.includes("不保存账号关联或原话摘要") || text.includes("只留匿名处置元数据"))],
  ["隐私政策写明危机分级最小化", sources["public/legal/privacy.html"].includes("关注级事件") && sources["public/legal/privacy.html"].includes("明确危机级事件")],
  ["危机受限详情写明300字30天与审计", sources["public/legal/privacy.html"].includes("最长 300 字") && sources["public/legal/privacy.html"].includes("超过 30 天") && sources["public/legal/privacy.html"].includes("审计日志")],
  ["隐私政策如实说明原输入仍属聊天历史", sources["public/legal/privacy.html"].includes("仍会按第 1、5、8、9 章所述保存在账号聊天记录中")],
  ["危机匿名元数据写明180天清理", sources["public/legal/privacy.html"].includes("超过 180 天") && sources["public/legal/terms.html"].includes("180 天后自动清理")],
  ["公开文案不得承诺实时人工跟进", !Object.values(sources).some((text) => text.includes("并由人工跟进") || text.includes("用于人工关怀跟进"))],
  ["公开文案不得继续宣称第三方模型全关闭", !Object.values(sources).some((text) => text.includes("当前第三方模型功能已关闭") || text.includes("当前运行状态：未启用第三方大模型处理"))],
  ["公开文案不得继续宣称当前不实时调用模型", !Object.values(sources).some((text) => text.includes("当前由审核文案库和规则自动回应，不实时调用云端大模型") || text.includes("当前使用审核文案库与规则自动回应，不实时调用云端大模型"))],
  ["官网与协议统一登记运营主体", ["src/App.tsx", "public/legal/privacy.html", "public/legal/terms.html", "public/legal/complaints.html"].every((name) => sources[name].includes("旬阳市槐序软件工作室"))],
  ["官网与协议统一抖音账号", ["src/App.tsx", "public/legal/privacy.html", "public/legal/terms.html", "public/legal/complaints.html"].every((name) => sources[name].includes("槐序学长工作室") && sources[name].includes("https://v.douyin.com/C8lWv7zLhz8/"))],
  ["公开源码不再保留旧抖音短链", !Object.values(sources).some((text) => /Tmm7e_p2rMM|4vpWBY5MsL0|XTF17fnkqNE|N4weK8sUDmM/.test(text))],
  ["官网发布信息统一为 1.6.6", sources["src/App.tsx"].includes("知潮 1.6.6 Android 安装包") && sources["public/invite/index.html"].includes("zhichao-mobile-release.apk?v=1.6.6")],
  ["官网不再展示旧包卸载迁移指引", !sources["src/App.tsx"].includes("旧版用户迁移说明") && !sources["public/invite/index.html"].includes("再卸载旧版 HuaiPet")],
  ["官网提供忘记密码双通道说明", sources["src/App.tsx"].includes("忘记密码怎么办？") && sources["src/App.tsx"].includes("只提供注册邮箱")],
  ["记账政策写明周期复盘与金额隐私开关", sources["public/legal/privacy.html"].includes("日、周、月、季度、半年和年度复盘") && sources["public/legal/privacy.html"].includes("显示具体金额") && sources["public/legal/terms.html"].includes("计划提醒默认不展示具体金额")],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length > 0) {
  for (const [label] of failed) console.error(`FAIL: ${label}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${checks.length} 项公开文案一致性检查`);
}
