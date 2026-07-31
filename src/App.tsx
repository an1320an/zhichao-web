import { useState, useEffect } from 'react'
import './App.css'
import happyFace from '/mascot/happy.webp'
import heroVisual from '/brand/zhichao-studio-hero-v2.webp'
import studyCoachIcon from '/features/study-coach.webp'
import petGrowthIcon from '/features/pet-growth.webp'
import dodoAssistantIcon from '/features/dodo-assistant.webp'
import examBankIcon from '/features/exam-bank.webp'
import spacedReviewIcon from '/features/spaced-review.webp'
import careerPathIcon from '/features/career-path.webp'
import bookkeepingIcon from '/features/bookkeeping.webp'
import floatingDodoIcon from '/features/floating-dodo.webp'
import cloudSyncIcon from '/features/cloud-sync.webp'
import androidQrCode from '/qr-android-download.svg'

const DOUYIN_URL = 'https://v.douyin.com/C8lWv7zLhz8/'
const DOUYIN_NAME = '槐序学长工作室'
const CONTACT_EMAIL = '2014302010@qq.com'

const philosophy = [
  {
    title: '学习效果 > 停留时长',
    desc: '每个功能都要落到"今天多记住了什么"，而不是让你在 App 里多待一会儿。',
  },
  {
    title: '轻养成 ≠ 功利化',
    desc: '等级、称号、徽章是学习进度的回馈，不是 KPI，也不是让你舍不得走的筹码。',
  },
  {
    title: '准确 > 煽情',
    desc: '医学内容以准确为第一位。鼓励只是润滑剂，绝不以牺牲准确性为代价；朵朵不做个人诊断和用药建议。',
  },
  {
    title: '漫漫医学路，工具要经得起用',
    desc: '产品的时间尺度是"几年"不是"几天"——我们优化的是你的长期学习曲线，不是你的在线时长。',
  },
]

const features = [
  { icon: studyCoachIcon, title: '学习教练与动态下一步', desc: '主目标由你确定，刷题、模考、错题和复习形成真实证据。掌握情况变了，下一步也会跟着更新。' },
  { icon: petGrowthIcon, title: '轻量养成激励', desc: '等级、成长曲线、学历、打工和商店陪你走完整段学习路；金币只通过学习获得。' },
  { icon: dodoAssistantIcon, title: '朵朵学习助手', desc: '日常交流、学习提醒和快捷入口连在一起，固定功能优先由规则库与题库完成。' },
  { icon: examBankIcon, title: '考试与题库系统', desc: '按考试、科目、题型、难度和章节练习，支持错题本、模拟考试与详细解析。' },
  { icon: spacedReviewIcon, title: '遗忘曲线复习', desc: '按 1 小时到 30 天的节奏安排回看，把“看过”逐步变成“真正记住”。' },
  { icon: careerPathIcon, title: '职业成长路线', desc: '覆盖医学生、医生、护士与药师方向，让学习积累在成长路线与徽章里看得见。' },
  { icon: bookkeepingIcon, title: '随手记账与周期复盘', desc: '手动记账、聊天草稿和可选截图识别都先给你确认，再按日、周、月回看收支。' },
  { icon: floatingDodoIcon, title: '悬浮朵朵快捷入口', desc: '把常用的学习、计划、记账和工具入口放到手边，支持自动贴边与按需授权。' },
  { icon: cloudSyncIcon, title: '云端数据同步', desc: '账号、学习记录、计划、笔记和账本按账号同步，换设备也能继续使用。' },
]

const releaseHighlights = [
  {
    label: '目标',
    title: '方向由你定，不从聊天里猜',
    desc: '可以有多个学习目标，但只有一个主目标负责当前推荐；暂停、完成和调整都由你确认。',
  },
  {
    label: '证据',
    title: '真正做过的题，才改变掌握判断',
    desc: '刷题、模拟考、错题复习和知识点练习会留下证据；只答对一题，不会直接被判成已经掌握。',
  },
  {
    label: '行动',
    title: '建议能落到练习、知识卡和计划',
    desc: '没数据时先安排起点练习；有证据后优先补薄弱、续学或巩固。是否采纳，仍由你决定。',
  },
]

const widgetHighlights = [
  {
    kind: 'weather',
    eyebrow: '天气预报',
    title: '安康市  ☁️  多云  33°',
    desc: '固定地区不用定位；跟随位置只在打开知潮、回到前台或手动刷新时更新。',
  },
  {
    kind: 'agenda',
    eyebrow: '计划日程',
    title: '今天先做这 3 件事',
    desc: '可筛选计划、课程、值班和自定义日程，大尺寸组件还能查看未来 7 天。',
  },
  {
    kind: 'study',
    eyebrow: '学习进度',
    title: '薄弱点变了，下一步也会变',
    desc: '把目标、答题、模考、错题和复习证据汇总起来，在桌面给出当前最值得做的一步。',
  },
  {
    kind: 'dodo',
    eyebrow: '朵朵状态',
    title: '今天也来看看朵朵吧',
    desc: '等级、心情、体力、饱腹和精神状态一眼可见，点击直接回到搭子页。',
  },
]

const roadmap = [
  {
    status: '已完成',
    items: [
      '虚拟伙伴养成系统（等级、成长曲线）',
      '朵朵文字交流（规则优先与安全保护）',
      '考试与题库系统（预置题库、静态解析、错题本、三种学习模式）',
      '遗忘曲线复习（1h→1d→2d→4d→7d→15d→30d）',
      '职业成长路线（医学生→医生/护士/药师，职称阶梯）',
      '随手记账（手动、聊天确认草稿、可选截图 OCR 与周期复盘）',
      '悬浮朵朵（套装联动、自定义快捷操作与自动贴边）',
      '云端账号与数据同步（当前提供 Android 客户端）',
      '安全与健康使用保护（18+ 门槛、使用时长提醒、危机干预、数据导出与删除）',
    ],
  },
  {
    status: '进行中',
    items: [
      '护理考研四科题库覆盖与章节体验',
      '学习目标、掌握度和下一步建议持续优化',
      '朵朵笔记附件备份与换机恢复体验',
      '天气、计划与异步学习通知稳定性',
    ],
  },
  {
    status: '未来方向',
    items: [
      '阶段学习总结与考前复习计划',
      '成长时间线、薄弱点趋势和学习报告',
      '更可靠的离线体验与恢复能力',
    ],
  },
]

function detectPlatform() {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/HarmonyOS/i.test(ua)) return 'harmonyos'
  if (/Android/i.test(ua)) return 'android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios'
  return 'other'
}

const platformNotices: Record<string, string> = {
  ios: '检测到你可能在用 iOS/iPadOS 设备——知潮目前只支持 Android，iOS 版本还在开发中，敬请期待。',
  harmonyos: '检测到你可能在用鸿蒙系统——知潮目前只支持 Android，鸿蒙原生版本我们还在评估适配方案。',
}

const platforms = [
  {
    name: 'Android 移动端',
    desc: '知潮 3.0.7 Android 安装包',
    status: '首页、Dock 与交互细节更新',
    downloadUrl: 'https://huaix.cn/download/zhichao-mobile-release.apk?v=3.0.7',
    downloadLabel: '下载知潮新包',
    qrCode: androidQrCode,
  },
]

const cocreateRoles = [
  {
    title: '剪辑 / 视频创作',
    desc: '槐序学长工作室的知潮开发日记需要人帮忙剪素材、把开发过程做成好看的内容，一起把这个项目的故事讲给更多人听。',
  },
  {
    title: '插画 / 角色设计',
    desc: '朵朵的皮肤、时装系统还在早期设计阶段，需要会画画、懂角色设计的人一起参与——从定风格、定格式，到画出第一批皮肤。',
  },
  {
    title: '医学内容顾问',
    desc: '题库与解析涉及大量医学知识，希望有执业资格 / 医学背景的人帮忙抽审内容、把关考点设计，持续降低内容错误风险。',
  },
  {
    title: '宣传 / 拉新',
    desc: '好产品也需要被更多人看到，需要懂社群运营、擅长宣传推广的人帮忙把知潮带给更多医学生和医护人员。',
  },
]

const contributors = [
  {
    name: '知许',
    title: '知潮第一批共创成员',
    contribution: '宣传协助、内测反馈',
    thanks: '感谢知许在知潮（原 HuaiPet）早期内测阶段参与共创，协助宣传、反馈体验，并和我们一起打磨这个给医学人用的学习工具。',
  },
]

const faq = [
  {
    q: '有年龄限制吗？',
    a: '有。当前内测版本按年满 18 周岁提供服务，注册时需填写出生年月用于年龄核验；已注册的老用户在新版客户端中也需要补填。',
  },
  {
    q: '知潮免费吗？',
    a: '目前免费，不提供付费购买功能。App 内金币通过学习、答题和完成任务获得，不能用真实货币购买。',
  },
  {
    q: '支持哪些平台？',
    a: `Android 移动端目前为邀请制内测（面向年满 18 周岁的用户）。想参与内测的话，通过抖音 @${DOUYIN_NAME} 或 QQ 2014302010 联系我们获取邀请码。`,
  },
  {
    q: '忘记密码怎么办？',
    a: `仍在登录状态时，可以在 App「设置 → 账号安全」生成并妥善保存恢复码；退出登录或卸载重装后，可在登录页点「忘记密码」用恢复码自助重置。没有恢复码时，登录页也会引导你通过抖音 @${DOUYIN_NAME} 私信人工核验，请只提供注册邮箱，不要发送旧密码、恢复码或其他敏感信息。`,
  },
  {
    q: '学习教练会替我自动改计划吗？',
    a: '不会。你决定学习方向和主目标，知潮根据真实答题、模考、错题和复习记录整理下一步；是否采纳、什么时候做，都由你确认。',
  },
  {
    q: '密码和账本安全吗？管理员能直接看到吗？',
    a: '密码采用 bcrypt 单向哈希保存，我们无法还原或查看你的明文密码。账本、学习和聊天属于账号私有业务数据，不会公开展示，也不用于广告；只有在安全排障、履行法律义务或处理你的请求确有必要时，受权限控制的人员才可按职责处理必要数据。你可以随时导出数据或注销清理。',
  },
  {
    q: '学习范围需要每次重新设置吗？',
    a: '不用。日常练习会记住你上次选择的考试、科目、题型、难度和章节，下次打开可以直接继续，也可以随时重新调整。',
  },
  {
    q: '我能导出或删除我的数据吗？',
    a: '可以。App 内「设置 → 导出我的数据」可随时下载你的数据副本；你也可以随时注销账号。注销后会级联删除账号与业务数据，仅保留履行必要安全与合规义务所需的最小同意凭证。',
  },
  {
    q: '朵朵和题库内容能直接当最终复习依据吗？',
    a: '不能。朵朵回复、题目与解析都只用于学习辅助，可能出现错误、遗漏或过时内容。请以正式教材、考试大纲和权威资料为准，也不要把它用于真实诊断或用药决定。',
  },
  {
    q: '现在还支持用户上传题库吗？',
    a: '不再支持。为避免扫描文本、联系方式和题目结构错位影响学习质量，用户题库上传、题库分享和加入他人题库功能已经停止；历史用户上传题目也已从练习题池撤下。个人知识树、知识卡片和系统题库仍可继续使用，符合授权和质量要求的知识结构可进入公共知识池。',
  },
]

const changelog = [
  {
    date: '2026-07-30',
    title: '知潮 3.0.7：首页、Dock 与交互细节修复',
    desc: '修复首页常用功能下拉、悬浮朵朵大小与贴边方向、佩戴成就同步，以及底部 Dock 的胶囊圆角、重复内层、暖色残影和内容遮挡；统一聊天页底色并增强液态玻璃透明模糊。答题把握度新增用途说明和明确可点击选项，记账编辑弹窗取消割裂遮罩，朵朵笔记使用说明现在可从卡片和文字区域直接上下滑动。',
  },
  {
    date: '2026-07-30',
    title: '知潮 3.0.6：自适应学习闭环与朵朵体验更新',
    desc: '学习教练新增 5/10/15 分钟任务、薄弱原因识别、答题信心、停滞换策略和完成后 3 题复测，并只维护一条由用户主动开启的动态学习提醒。同步更新计划完成入口、临床计算工具、桌面天气与朵朵状态组件、朵朵小屋和传说衣柜、首页单成就佩戴、场景化记账反馈、连续手写与常用功能抽屉，并完善 App 内法律文本、联系入口和内容安全边界。同一天的改进统一归入本条记录。',
  },
  {
    date: '2026-07-29',
    title: '知潮 3.0.3 归潮纪念版：国内服务、桌面组件与学习下一步',
    desc: '知潮服务与官网主域已经迁回国内，旧账号、学习记录、计划和搭子数据继续沿用；本次发布前已注册用户会收到永久限定称号「归潮见证者」。安卓桌面组件扩展为今日总览、天气预报、计划日程、学习进度、朵朵状态和快速记账六类，可按尺寸展示 24 小时或 7 天天气、未来日程、主目标与动态下一步。天气支持固定地区和跟随位置两种方式，跟随位置只在应用前台按需更新，不申请后台定位。同一版本的改动统一归入这一条记录。',
  },
  {
    date: '2026-07-28',
    title: '知潮 3.0.2：安卓桌面小组件与细节完善',
    desc: '新增今日总览、计划日程、学习进度和快速记账四类安卓桌面小组件，可从设置页查看添加方法；升级后会自动展示三步新功能导览。学习目标与建议改为分开加载，天气卡片、区县定位和考试倒计时显示更稳；默认图标与官网视觉同步更新，聊天内容安全边界和提示也进一步收拢。',
  },
  {
    date: '2026-07-28',
    title: '知潮 3.0.1：学习下一步、天气与答题等待体验修复',
    desc: '学习目标补充大白话说明、日期选择和建议落地入口；题库会显示当前范围题量、章节并记住上次练习范围。天气卡片、定位精度与 24 小时预报布局更清楚；后台缺题、详细解析和知识树生成会显示真实状态，完成后通过计划通知直达。同步修复账单图片、朵朵书页手写与分享、学习笔记来源返回、考试锁定，以及手机和平板上的内容宽度和弹层布局。',
  },
  {
    date: '2026-07-27',
    title: '知潮 3.0.0：护理考研学习路径、题组与学习教练',
    desc: '学习目录、目标、掌握度与下一步建议现在连成完整路径，护理考研按四科和真实题型边界呈现。答题支持闭合 B1、A3/A4 题组与 X 型多选，缺题时会显示供题状态、可用替代项，并在题组准备完成后通过通知直达。朵朵笔记的私有附件进入分块上传、哈希校验和云备份状态边界；学习教练只读取明确的学习上下文生成只读建议，不会替你改答案、目标或计划。升级后会自动展示本版五步新功能导览，设置中也能随时重看。',
  },
  {
    date: '2026-07-26',
    title: '知潮 2.0.0：朵朵日程、PDF 笔记与账单附件',
    desc: '新增朵朵日程，可集中管理课程、值班和自定义安排，并支持重复规则、单次调整、ICS 导入导出与确认后写入系统日历。朵朵笔记加入 PDF 逐页浏览、手写和文字批注，以及保留 7 天、尽量恢复原位置的回收站。账单现在可长期保存最多 3 张账号私有图片附件。模拟考场扩展模块化考试分类和口腔执业两级考试，解析按选项、核心推理与易错点分层展示；首页和聊天天气更紧凑，衣柜在数据可靠时可按稀有度排序。升级后会自动展示本版五步新功能导览，设置中也能随时重看。',
  },
  {
    date: '2026-07-24',
    title: '知潮 1.8.0：朵朵天气、功能引导与足迹体验升级',
    desc: '新增版本化新功能引导，新注册、升级、重装登录或切换账号时会介绍本次重点能力，设置中也可随时重看。朵朵天气支持当前天气、未来 24 小时和 7 天预报，天气设置独立管理；聊天询问天气时可直接引用已设置城市的数据。悬浮朵朵按模块展示真实的屏幕节律、知识闪卡和随机陪伴频次。足迹新增用户与朵朵身份头像、回应装扮快照、学习回顾长文自动换行，并重做卡片化记录编辑器。',
  },
  {
    date: '2026-07-23',
    title: '知潮 1.6.6：截图记账入口与装扮联动更新',
    desc: '记账页保留底部“记一笔”作为唯一新增入口，右上角改为截图记账状态按钮，可一眼区分运行中、未开启或权限不完整；移除重复的中部说明卡和手动导入截图入口。更换朵朵装扮后，悬浮朵朵、贴边形态与截图识别提示会同步使用新形象；继续沿用“系统截屏后先询问、本机识别、核对草稿后保存”的隐私边界。',
  },
  {
    date: '2026-07-23',
    title: '知潮 1.6.0：朵朵长期记忆升级',
    desc: '长期记忆现在会区分身份、偏好、学习、习惯、重要日期和临时事项；稳定偏好可在安全筛查后自动整理，身份、日期和低置信内容会先请你确认。新增待确认候选、编辑、置顶、忽略和删除，冲突事实会保留新值并停用旧值，临时事项会自动过期。聊天、学习建议、搭子气泡和记账短评只取当前场景真正相关的少量记忆，离线规则模式也能回答“你记得我什么”。',
  },
  {
    date: '2026-07-22',
    title: '知潮 1.5.2：密码找回、记账复盘与陪伴细节更新',
    desc: '登录页新增恢复码自助重置与抖音人工核验双通道；快捷记支出、收入和转账会自动聚焦金额输入。账单详情完整展示朵朵个性化短评，并新增日、周、月、季度、半年和年度消费复盘及隐私化计划提醒；搭子页的具体金额开关现在会真实控制收支金额展示，默契度同时显示下一称号进度。',
  },
  {
    date: '2026-07-22',
    title: '知潮 1.4.0：成长成就、平板适配与学习体验升级',
    desc: '重构朵朵成长、打工学习时长与金币收支节奏，新增 57 项成长成就、五档稀有度、成就图鉴和头像下方荣誉角，已佩戴成就可在首页展示。优化学习页信息分层、遗忘曲线说明、通用倒计时与纪念日能力，并针对手机和平板横竖屏调整字号、间距和内容宽度。',
  },
  {
    date: '2026-07-22',
    title: '知潮 1.3.9：知识树巩固、遗忘曲线与错题提醒更新',
    desc: '修复计划页“知识树待巩固”点击后无法进入的问题，现在可以查看待巩固节点并直达对应知识点，再次练习全对后自动移出。学习页与搭子首页明确展示“遗忘曲线复习”入口、到期与掌握状态，并说明“记住了、模糊、没记住”会调整下次复习时间。恢复搭子首页真实错题提醒，有可用错题时会展示题干、正确答案和知识点。',
  },
  {
    date: '2026-07-21',
    title: '知潮 1.3.8：聊天键盘、互动题卡与长解析体验更新',
    desc: '修复部分 Android 手机上聊天输入框被键盘遮挡、弹收割裂或掉帧的问题，并统一状态栏背景。聊天与功能中心的练习题支持可点击选项、单选和多选判题、彩色结果与解析卡片；长题目和长解析现在可以完整滚动查看。聊天可按高血压、糖尿病等知识范围以及 A1、A2、B、X、判断题等题型抽题，并优先复用现有题库。',
  },
  {
    date: '2026-07-21',
    title: '知潮 1.3.7：换装提示与安装包发布链路修复',
    desc: '换上朵朵装扮前会明确提示桌面图标也将同步变化，并说明部分手机可能短暂返回桌面或重新打开，避免误以为应用卡死。修复官网固定下载文件可能被旧版自动同步任务覆盖的问题；更新发布改为先完成安装包版本、签名与哈希核验及公网回读，再展示新版和发送通知。',
  },
  {
    date: '2026-07-21',
    title: '知潮 1.3.6：消息长按、提醒卡与键盘体验更新',
    desc: '聊天消息改为长按操作：朵朵回复可复制、收藏到长期记忆、换种回答，学习内容还能加入复习提醒；自己的消息可复制、重新编辑或确认后再次发送。移除每条回复下方常驻的快捷按钮，让聊天流更简洁；低置信提醒卡固定为主确认独占一行、改时间与不用了位于第二行，避免窄屏标签溢出；继续减少键盘弹收时列表滚动与底栏动画叠加造成的卡顿。',
  },
  {
    date: '2026-07-21',
    title: '知潮 1.3.5：聊天输入、提醒卡与文字答题修复',
    desc: '重构聊天输入区与 Android 键盘避让逻辑，减少输入框被遮挡和页面弹跳；提醒确认卡改为窄屏自适应两行布局，避免“不用了”等按钮溢出。聊天里说“出一道题”后不再弹出答题框，而是在对话中展示题目和选项，回复 A～E 后判断对错并给出解析。题库人工整理通知同步启用结构化邮件工单，按批次准确关联上传用户，原始文件仍不会作为邮件附件发送。',
  },
  {
    date: '2026-07-21',
    title: '知潮 1.3.4：聊天、衣柜与更新提醒体验修复',
    desc: '优化聊天输入框与键盘的开合动画，减少页面跳动并确保输入框始终位于键盘上方；修复朵朵衣柜从卡片中间起手无法滑动的问题；修复重要更新在冷启动首轮同步时可能不弹窗的问题。现在在聊天里说“出道题”“来一道题”等指令，会从现有题库打开可直接选择、判题并查看解析的答题卡，作答计入学习记录。',
  },
  {
    date: '2026-07-21',
    title: '知潮 1.3.3：题库上传改为100金币人工整理',
    desc: '停止使用不稳定的文件自动解析。新版上传的 Word、PDF、TXT 会安全进入管理员人工整理队列，提交成功消耗 100 金币；管理员确认无法处理或用户在完成前取消会自动退回。管理员收到计划待办，配置专用 SMTP 授权后可同时收到邮件提醒；原文件不作为邮件附件，最长保留 14 天。旧版上传协议会提示先更新，避免继续产生失败批次。',
  },
  {
    date: '2026-07-21',
    title: '知潮 1.3.2：错题复习、聊天交互与朵朵衣柜更新',
    desc: '今日错题复习恢复完整选项与点击作答；从知识卡片等学习工具返回时保留原来的页面位置。重构聊天输入区的键盘避让与滚动逻辑，并为错题复习、专注、计划、足迹等快捷互动提供真实功能入口。朵朵衣柜改为双列模块卡片，新增青竹研习、云端研习、桃气小憩、秋日行动、雪夜藏书 5 套成就装扮；连同既有装扮，十套造型均补齐待机、开心、思考、休息、探头、饥饿、疲惫、学习、打工、玩耍十种状态和轻量动画。',
  },
  {
    date: '2026-07-20',
    title: '知潮 1.3.1：公共内容共创授权与自动复核更新',
    desc: '完善朵朵交流、练习题与知识树入口，增加请求安全保护、使用限制和可随时切回的离线规则库。公共内容共创另行授权，个人知识树、知识卡片和公共题目只在明确同意后开放，合格内容经过自动复核后进入公共池。同步修复共创题库 TXT、DOCX、PDF 文件在手机端未真正发出的问题，并改进上下文、足迹线程、装扮与提醒可靠性。',
  },
  {
    date: '2026-07-19',
    title: '朵朵切换为审核文案规则聊天',
    desc: '聊天界面与历史记录继续保留，回复优先由服务端审核文案库、关键词规则和学习数据组合。经用户单独授权的脱敏缺口可用于后台改进静态内容，并可按运行状态受控切换回复引擎。',
  },
  {
    date: '2026-07-16',
    title: '注册流程简化 + 可选服务授权延后',
    desc: '注册改为两步完成，出生年月改用滑动选择更省心；可选服务授权不再强制在注册时同意，可在首次使用对应功能时再单独开启，不影响计划、学习、足迹等基础功能。目前仍为邀请制内测。',
  },
  {
    date: '2026-07-15',
    title: '安全更新：18+ 内测门槛、来源标识与健康使用保护',
    desc: '出于未成年人保护与审慎运营考虑，当前内测仅面向年满 18 周岁用户，注册需提供出生年月（已注册的老用户在新版 App 中也需补填，不补填将无法继续使用）；朵朵常驻自动程序与回复来源标识；新增连续使用满 2 小时提醒与过度依赖提示；对涉及自伤、自杀的表述提供即时求助热线（12356），独立运行记录仅保留匿名处置元数据；新增「导出我的数据」与投诉举报入口。',
  },
  {
    date: '2026-07-08',
    title: 'Android 内测开启',
    desc: `知潮（当时名为 HuaiPet）Android 移动端正式开启邀请制内测，通过抖音 @${DOUYIN_NAME} 联系获取邀请码。`,
  },
  {
    date: '2026-07-07',
    title: '官网上线',
    desc: '知潮前身“槐序 HuaiPet”的官网正式上线，huaipet.com 可以访问了。',
  },
  {
    date: '2026-07-06',
    title: 'v0.1.0',
    desc: '虚拟伙伴养成、学历系统、打工系统、商店系统、聊天系统、任务系统、记忆系统、偏好系统、账号系统、云同步、桌面浮窗宠物、手机浮窗宠物、管理员后台、考试系统、三种学习模式、遗忘曲线复习、职业系统全部跑通。',
  },
]

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function handleCardTilt(e: React.MouseEvent<HTMLDivElement>) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const rotateX = ((y / rect.height) - 0.5) * -8
  const rotateY = ((x / rect.width) - 0.5) * 8
  card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
}

function resetCardTilt(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = ''
}

function App() {
  const [platform] = useState(detectPlatform)
  const platformNotice = platformNotices[platform]
  useScrollReveal()

  return (
    <div className="page">
      <header className="nav">
        <div className="nav-inner">
          <span className="brand">槐序 · 知潮</span>
          <nav>
            <a href="#features">功能</a>
            <a href="#changelog">更新</a>
            <a href="#about">关于</a>
            <a href="#download" className="nav-cta">下载</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-shell">
            <div className="hero-copy">
              <span className="hero-eyebrow">槐序学长工作室 · Android 邀请内测</span>
              <h1>今天学什么，<br /><span>下一步更清楚。</span></h1>
              <p className="hero-sub">
                选定主目标后，把刷题、模拟考、错题复习和知识练习变成掌握证据。知潮会随着真实进度，持续调整今天最值得先做的那一步。
              </p>
              <div className="hero-cta-group">
                <a className="cta" href="#download">下载知潮 3.0.7</a>
                <a className="cta cta-secondary" href="#widgets">了解学习教练与组件</a>
              </div>
              <div className="hero-signals" aria-label="核心能力">
                <span>真实学习证据</span>
                <span>动态掌握判断</span>
                <span>可执行下一步</span>
              </div>
            </div>
            <div className="hero-art">
              <img src={heroVisual} alt="医学备考学习桌、学习计划与朵朵形象" />
              <div className="hero-art-note">
                <span className="hero-art-dot" />
                <div>
                  <strong>把目标落到今天</strong>
                  <span>每次学习后，路线都会更新</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="release-story" aria-labelledby="release-story-title">
          <div className="release-story-heading reveal">
            <span>知潮核心学习能力</span>
            <h2 id="release-story-title">不只提醒什么时候学，还回答先学什么</h2>
            <p>普通计划负责时间，知潮把目标、真实学习证据和下一次行动连起来。</p>
          </div>
          <div className="release-story-grid">
            {releaseHighlights.map((item, index) => (
              <article className={`release-story-card release-story-card--${index + 1} reveal`} key={item.title}>
                <span className="release-story-index">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="widgets" className="widget-story" aria-labelledby="widget-story-title">
          <div className="widget-story-copy reveal">
            <span>Android 桌面组件</span>
            <h2 id="widget-story-title">不用先打开 App，今天该做什么已经在桌面</h2>
            <p>
              六类组件会根据桌面空间自动增减信息。天气可看当前、24 小时和 7 天；日程可切换计划、课程和值班；
              学习组件会把真实进度和下一步放在一起。
            </p>
            <div className="widget-story-tags" aria-label="桌面组件能力">
              <span>可调整大小</span>
              <span>点击直达</span>
              <span>摘要最小化</span>
              <span>前台刷新</span>
            </div>
          </div>
          <div className="widget-preview-grid">
            {widgetHighlights.map((item) => (
              <article className={`widget-preview widget-preview--${item.kind} reveal`} key={item.kind}>
                <div className="widget-preview-topline">
                  <span>{item.eyebrow}</span>
                  <small>刚刚同步</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {item.kind === 'weather' && (
                  <div className="widget-weather-hours" aria-hidden="true">
                    <span>15时<br /><strong>33°</strong></span>
                    <span>18时<br /><strong>30°</strong></span>
                    <span>21时<br /><strong>27°</strong></span>
                    <span>明天<br /><strong>26°</strong></span>
                  </div>
                )}
                {item.kind === 'study' && (
                  <div className="widget-study-metrics" aria-hidden="true">
                    <span><strong>32%</strong>正确率</span>
                    <span><strong>20</strong>待复习</span>
                    <span><strong>10天</strong>连续学习</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="philosophy" className="philosophy">
          <h2 className="section-title reveal">产品哲学</h2>
          <div className="card-grid">
            {philosophy.map((item) => (
              <div className="card reveal" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="features">
          <h2 className="section-title reveal">功能亮点</h2>
          <p className="section-lead reveal">九项能力各司其职，最后都落到一件事：让你更清楚自己学到哪、下一步先做什么。</p>
          <div className="feature-grid">
            {features.map((item) => (
              <div
                className="card feature-card reveal"
                key={item.title}
                onMouseMove={handleCardTilt}
                onMouseLeave={resetCardTilt}
              >
                <img src={item.icon} alt="" className="feature-icon" loading="lazy" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="download" className="download">
          <h2 className="section-title reveal">下载</h2>
          <div className="download-migration download-current reveal">
            <h3>当前邀请内测版</h3>
            <p>下载安装后，已有知潮账号可直接登录并继续使用云端数据；新用户请先向邀请人或槐序学长工作室获取邀请码。</p>
            <div className="release-badges" aria-label="当前版本能力">
              <span>Android</span>
              <span>邀请内测</span>
              <span>云端同步</span>
              <span>规则库 · 学习助手</span>
            </div>
            <p className="release-privacy">截图 OCR 记账默认关闭，只有你主动授权并点击识别后才会处理截图；识别结果会先成为可修改草稿，不会自动入账。</p>
          </div>
          {platformNotice && <p className="download-platform-notice">{platformNotice}</p>}
          <div className="card-grid">
            {platforms.map((p) => (
              <div className="card platform-card reveal" key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <span className="platform-status">{p.status}</span>
                {p.downloadUrl && (
                  <a className="platform-download" href={p.downloadUrl}>
                    {p.downloadLabel}
                  </a>
                )}
                {p.qrCode && (
                  <div className="platform-qr">
                    <img src={p.qrCode} alt={`扫码下载 ${p.name}`} />
                    <span>扫码下载</span>
                  </div>
                )}
                {!p.downloadUrl && (
                  <div className="platform-placeholder">敬请期待</div>
                )}
              </div>
            ))}
          </div>
          <p className="download-note">
            Android 移动端当前为邀请制内测。年满 18 周岁的用户可通过
            <a href={DOUYIN_URL} target="_blank" rel="noopener noreferrer"> 抖音 · {DOUYIN_NAME} </a>
            或 QQ 2014302010 联系获取邀请码；已有账号可直接登录。
          </p>
        </section>

        <section id="about" className="about">
          <h2 className="section-title reveal">关于我们</h2>
          <p className="reveal">
            知潮是槐序学长工作室持续开发的学习工具，目标是长期好用、越用越懂你的薄弱点，
            用轻量的陪伴让漫长的医学备考不那么枯燥。项目由旬阳市槐序软件工作室（个体工商户）持续迭代打造，你可以在抖音
            <a href={DOUYIN_URL} target="_blank" rel="noopener noreferrer"> @{DOUYIN_NAME} </a>
            关注最新进展，或通过邮箱
            <a href={`mailto:${CONTACT_EMAIL}`}> {CONTACT_EMAIL} </a>
            联系我们、提出建议。
          </p>
        </section>

        <section id="cocreate" className="cocreate-band">
          <div className="cocreate">
            <h2 className="section-title reveal">招募共创</h2>
            <p className="cocreate-intro">
              知潮目前是槐序学长工作室主理人独立推进的项目，还没有任何收入——这不是一份工作，是一次"为爱发电"的邀请。
              如果你也觉得"医学备考是场持久战，需要一个长期好用、越用越懂你薄弱点的学习工具"这件事值得做，欢迎一起加入，把它做出来。
            </p>
            <div className="card-grid">
              {cocreateRoles.map((role) => (
                <div className="card cocreate-card reveal" key={role.title}>
                  <h3>{role.title}</h3>
                  <p>{role.desc}</p>
                </div>
              ))}
            </div>
            <p className="cocreate-offer">
              我们没法开工资，但可以：把你的名字放进网站"共创伙伴"名单里；让你的作品变成产品里活生生的一部分——皮肤真的会有人穿，内容真的会有人学；新功能你能第一个看到、第一个玩到。
            </p>
            <p className="cocreate-contact">
              有兴趣的话，通过
              <a href={DOUYIN_URL} target="_blank" rel="noopener noreferrer"> 抖音 · {DOUYIN_NAME} </a>
              、QQ 2014302010 或
              <a href={`mailto:${CONTACT_EMAIL}`}> 邮箱 </a>
              找我们聊聊。
            </p>
          </div>
        </section>

        <section id="roadmap" className="roadmap">
          <h2 className="section-title reveal">成长路线图</h2>
          <div className="roadmap-columns">
            {roadmap.map((column) => (
              <div className="roadmap-column reveal" key={column.status}>
                <h3 className={`roadmap-status roadmap-status--${column.status === '已完成' ? 'done' : column.status === '进行中' ? 'doing' : 'planned'}`}>
                  {column.status}
                </h3>
                <ul>
                  {column.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="changelog" className="changelog">
          <h2 className="section-title reveal">更新日志</h2>
          <ul className="changelog-list">
            {changelog.slice(0, 6).map((entry) => (
              <li key={`${entry.date}-${entry.title}`} className="reveal">
                <span className="changelog-date">{entry.date}</span>
                <div>
                  <h3>{entry.title}</h3>
                  <p>{entry.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" className="faq">
          <h2 className="section-title reveal">常见问题</h2>
          <div className="faq-list">
            {faq.map((item) => (
              <div className="faq-item reveal" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="architecture" className="architecture">
          <h2 className="section-title reveal">学习数据，按账号稳稳接住</h2>
          <div className="arch-diagram reveal">
            <div className="arch-node">Android 客户端</div>
            <div className="arch-node">账号与安全服务</div>
            <div className="arch-node">学习记录与云端备份</div>
          </div>
          <div className="arch-backend">规则库优先 · 账号隔离 · 可恢复任务</div>
          <p className="arch-note">固定功能优先由规则库和数据库完成。学习记录按账号隔离，关键后台任务保留状态与恢复入口；用户可以在 App 内管理授权、导出数据或注销账号。</p>
        </section>

        <section id="contributors" className="contributors">
          <h2 className="section-title-small">共创成员</h2>
          <ul className="contributors-list">
            {contributors.map((c) => (
              <li key={c.name} className="reveal">
                <img src={happyFace} alt="" className="contributor-avatar" />
                <div className="contributor-body">
                  <div className="contributor-header">
                    <strong>{c.name}</strong>
                    <span className="contributor-title">{c.title}</span>
                  </div>
                  <p className="contributor-role">参与方向：{c.contribution}</p>
                  <p className="contributor-thanks">{c.thanks}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="contributors-disclaimer">
            名单记录早期参与方向与贡献；具体合作安排以双方另行确认的内容为准。
          </p>
        </section>
      </main>

      <footer className="footer">
        <a
          className="social-link"
          href={DOUYIN_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" className="social-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.28v13.9a3.16 3.16 0 0 1-5.6 2 3.16 3.16 0 0 1 3.34-5.05v-3.34a6.47 6.47 0 0 0-5.4 10.86 6.47 6.47 0 0 0 11.04-4.58V9.01a8.16 8.16 0 0 0 4.7 1.5V7.24a4.85 4.85 0 0 1-3.4-1.42z"
            />
          </svg>
          抖音：{DOUYIN_NAME}
        </a>
        <a
          className="social-link"
          href="https://wpa.qq.com/msgrd?v=3&uin=2014302010&site=qq&menu=yes"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" className="social-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"
            />
          </svg>
          QQ：2014302010
        </a>
        <p>
          联系邮箱：<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p>旬阳市槐序软件工作室（个体工商户） · 知潮</p>
        <p className="site-filing">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            陕ICP备2026019822号
          </a>
        </p>
        <nav className="legal-links">
          <a href="#faq">常见问题</a>
          <a href="#architecture">数据与规则</a>
          <a href="/website-privacy.html">网站隐私说明</a>
          <a href={`mailto:${CONTACT_EMAIL}`}>联系我们</a>
        </nav>
      </footer>
    </div>
  )
}

export default App
