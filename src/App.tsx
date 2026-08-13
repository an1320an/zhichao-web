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

const SUPPORT_DOUYIN_URL = 'https://v.douyin.com/4Tl7oRzN9KM/'
const SUPPORT_DOUYIN_NAME = '槐序学长'
const STUDIO_DOUYIN_URL = 'https://v.douyin.com/fs6MHFOU5q4/'
const STUDIO_DOUYIN_NAME = '槐序工坊'
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

const APP_VERSION = '3.0.82'
const APP_RELEASED_AT = 'PENDING_3_0_82_RELEASED_AT'
const APP_RELEASED_AT_LABEL = '正式发布后更新'

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
    label: '关怀',
    title: '个人资料保持可选，周期关怀由你决定是否开启',
    desc: '性别认同与生日不是注册必填；生理期关怀默认关闭，可自定提前天数、提醒时间和锁屏隐私。“关心重要的人”只做通用提醒，不记录对方身份或健康状态。',
  },
  {
    label: '对话',
    title: '长按朵朵回复，局部复制并直达创作与练习',
    desc: '回复文字支持选择部分内容复制，也可从有界对话创建流程图、文档、保存到笔记或生成练习题；直接说“出一道题”会优先进入结构化答题卡并明确单选或多选。',
  },
  {
    label: '听背',
    title: '朗读有明确反馈，听背可在系统播放面板控制',
    desc: '单卡朗读和连续听背不再静默失败；后台听背由原生媒体服务承接，可暂停或继续。朗读设置可按设备已安装音色选择语言、音色、语速与停顿。',
  },
  {
    label: '整理',
    title: '笔记额度和学习内容回收边界更清楚',
    desc: '活跃笔记、归档只读和服务端展示的金币扩容形成闭环；自建记忆卡支持归档、最近删除、30 天内恢复或提前永久删除，公共来源不会被个人操作删除。',
  },
  {
    label: '反馈',
    title: '医学边界提示可以匿名评价是否有帮助',
    desc: '医学提示下只提交随机反馈编号、页面、固定原因、处理结果和“有帮助/没帮助”，不提交聊天正文、邮箱、账号 ID、IP 或自由文本，匿名事件保存 180 天。',
  },
  {
    label: '稳定',
    title: '页面轮询、后台任务和服务器资源治理继续减负',
    desc: '学习列表只在页面可见且 App 位于前台时轮询，并防止请求重叠；服务端清理任务采用有界批次，发布链保留资源熔断与失败闭锁，减少无意义刷新和重 I/O。',
  },
]

const releaseSchemaCapabilities = [
  {
    version: 'V79',
    title: '笔记活跃额度、归档与扩容',
    desc: '每个账号保留免费活跃笔记位，归档定义为只读保留；金币扩容必须先展示服务端当时有效的档位、价格、期限与退款窗口。',
  },
  {
    version: 'V80',
    title: '可选资料与本机周期关怀',
    desc: '性别认同与生日都不是注册必填，可只填年份或不提供；生理期关怀默认关闭，最近开始日期只在用户主动开启后处理，关心重要的人不记录对方身份或健康状态。',
  },
  {
    version: 'V81',
    title: '学习内容归档与最近删除',
    desc: '自建卡组支持单卡移入最近删除、30 天内恢复或提前永久删除；公共卡、词书卡和内置医学卡不允许按个人操作删除公共来源。',
  },
  {
    version: 'V82–V83',
    title: '广播幂等与知识底座就绪检查',
    desc: '后台原子写入、重复提交防护和内容源变化检查继续收紧；它们不代表远程 Push 已经开启。',
  },
  {
    version: 'V84',
    title: '匿名医学边界反馈',
    desc: '客户端只显示服务端给出的医学边界上下文并提交固定选项；持久记录不含正文、邮箱、账号 ID 或 IP，180 天后由有界任务清理，管理员只查看 7、30 或 90 天聚合。',
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
      '计划、课程表、排班表、倒数日与纪念日',
      '结构化图示、知识卡片、用药学习卡与临床案例训练',
      '足迹图文记录、图片文字识别与朵朵回应',
      '朵朵笔记全新内核（书架、PDF 阅读、手写批注、文字编辑与旧笔记只读导出）',
      '刷卡学习（四级、六级、考研与医学英语首组学习、复习、词测和朗读听书）',
      '问朵朵·找功能（自然语言匹配现有功能入口）',
    ],
  },
  {
    status: '进行中',
    items: [
      '护理考研四科题库覆盖与章节体验',
      '题库关闭副本零模型终审与护理考研章节体验',
      '学习目标、掌握度和下一步建议持续优化',
      '提醒响铃、悬浮搭子看门狗与不同手机系统稳定性',
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
    desc: `知潮 ${APP_VERSION} Android 安装包`,
    status: '学习闭环、内容整理、创作与海洋回看升级',
    downloadUrl: 'https://huaix.cn/download/index.html',
    downloadLabel: '下载知潮新包',
    qrCode: androidQrCode,
  },
]

const cocreateRoles = [
  {
    title: '剪辑 / 视频创作',
    desc: '槐序工坊的知潮开发日记需要人帮忙剪素材、把开发过程做成好看的内容，一起把这个项目的故事讲给更多人听。',
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
  {
    name: '黄晨晨',
    title: '知潮共创成员',
    contribution: '产品体验共创、功能反馈',
    thanks: '谢谢黄晨晨愿意把认真而具体的体验感受交给知潮。每一次反馈都像替潮汐点亮一盏岸灯——愿我们一起把知潮做成更懂学习、也更懂人的长期伙伴。',
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
    a: `Android 移动端目前为邀请制内测（面向年满 18 周岁的用户）。想参与内测的话，通过抖音 @${SUPPORT_DOUYIN_NAME} 或 QQ 2014302010 联系获取邀请码。`,
  },
  {
    q: '忘记密码怎么办？',
    a: `仍在登录状态时，可以在 App「设置 → 账号安全」生成并妥善保存恢复码；退出登录或卸载重装后，可在登录页点「忘记密码」用恢复码自助重置。没有恢复码时，登录页也会引导你通过抖音 @${SUPPORT_DOUYIN_NAME} 私信人工核验，请只提供注册邮箱，不要发送旧密码、恢复码或其他敏感信息。`,
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
]

const changelog = [
  {
    date: '2026-08-14',
    title: '知潮 3.0.82：私密关怀、对话创作、听背与数据治理升级',
    desc: '性别认同与生日改为可选资料，生理期关怀默认关闭并由用户自定提前天数、提醒时间和锁屏隐私；关心重要的人只做通用提醒，不记录对方身份或健康状态。长按朵朵回复可选择部分文字复制，并从有界对话创建流程图、文档、保存到笔记或生成练习题；聊天里直接出题会优先呈现结构化答题卡并标明单选或多选。刷卡朗读和听背补齐明确反馈，后台听背可在系统播放面板暂停或继续，朗读设置可选择设备已安装的语言、音色、语速与停顿。活跃笔记、归档只读与金币扩容形成闭环，自建记忆卡支持最近删除、30 天内恢复和提前永久删除。医学边界提示可匿名评价是否有帮助，只提交固定选项且不提交正文或账号标识，保存 180 天。页面轮询与服务器有界清理继续减负；远程 Push 仍未开放，COS 也未承接用户附件。本次为非强制更新。',
  },
  {
    date: '2026-08-13',
    title: '知潮 3.0.81：身份、流畅度、时光海洋与内容管理升级',
    desc: '特殊身份在搭子主页显示专属铭牌；改名投票在提交后可查看当前票况，并保留长期回看入口。主题状态栏与页面过渡继续统一，头像进入设置及返回后的刷新改在切页动画完成后执行，金额键盘与输入法切换更稳定。时光海岸和深海探索扩大可拖动画布，优化贝壳分布、沙埋层次与差异化海洋生物。安装后弹窗按新功能导览、后续活动提示的确定顺序出现，维护结束会主动刷新。已解锁的成就、主题和套装继续展示解锁原因；聊天支持长按删除所选完整一轮及其后续上下文，已确认收藏、笔记和记忆不会随聊天自动删除。本次为已正式发布的非强制更新。',
  },
  {
    date: '2026-08-13',
    title: '知潮 3.0.80：旧账编辑与备注输入体验修复',
    desc: '编辑以前记录的账单时，会保留原来的收支类型、分类和账户，不必重新选择即可保存。备注改为完整多行编辑区，支持选中、退格和清空；输入备注时金额键盘会自动折叠，也可按需重新展开。账单卡片重新分配文字空间，朵朵短评不再被金额列挤成半句话。本次不改变已有账目、金币、隐私授权或投票功能，为非强制修复更新。',
  },
  {
    date: '2026-08-13',
    title: '知潮 3.0.79：页面导航与记账删除紧急修复',
    desc: '修复更换主题后，从搭子页打开头像设置、小屋、天气，以及从足迹进入时光海洋和彩蛋册、从学习页进入学习工具时，页面瞬间返回搭子首页的问题；导航容器现在保持稳定，不再因背景层切换而被重新创建。记账删除遇到版本冲突时会刷新并同步当前账单，再由用户重新确认，不会反复拿旧版本提交。本次为非强制修复更新。',
  },
  {
    date: '2026-08-12',
    title: '知潮 3.0.78：全局主题、功能直达与潮汐信箱体验升级',
    desc: '多主题继续统一一级到多级页面的状态栏过渡、文字对比与页面底色，并减少重复背景和高成本装饰；功能中心补齐五运六气、沟通大字板、文档工坊等入口，问朵朵·找功能仍可自然语言直达。时光海岸与深海探索使用差异化场景、贝壳、漂流瓶和海洋生物，足迹首页降低回忆工具和彩蛋册的视觉权重。新增潮汐信箱：在满足足迹数量、安全筛查和授权条件时，朵朵可结合少量近期足迹生成私密来信；潮汐来信每周最多三封且每天最多一封，鲸歌保持更稀有，支持已读、归档、恢复和系统分享，最近删除保留 30 天，也可提前永久删除；分享前不自动带出足迹原文或账号标识。更新摘要只在安装前提示，安装后改为新功能导览；普通管理员公告仍在打开、回到或刷新 App 后拉取，远程 Push 仍未开放。聊天表格横向拖动与消息列表纵向滚动的手势冲突同步修复。本次为非强制更新。',
  },
  {
    date: '2026-08-12',
    title: '知潮 3.0.77：政策、功能导览与官网更新记录同步',
    desc: '用户协议和隐私政策同步沟通大字板投稿、个人学习内容归档与最近删除、时光海洋本机潜水日志和云端私密回声等真实处理规则；隐私确认升级后会重新展示一次。新功能导览改为学习闭环、个人内容管理、笔记与文档、大字板、时光海洋五步直达。官网更新日志固定显示最近三次并移除失效的长历史入口，避免移动端展开后空白或卡顿。远程 Push 仍未开放，打开、回到或刷新 App 后的公告拉取与本机系统通知保持。本次为非强制更新。',
  },
  {
    date: '2026-08-12',
    title: '知潮 3.0.76：学习闭环、内容整理、创作与海洋回看升级',
    desc: '学习教练会把目标、真实学习证据、推荐练习、短复测和动态重排连成闭环；个人记忆卡组、知识树与遗忘曲线内容新增归档、最近删除、恢复和永久清理。朵朵笔记提升图片与 PDF 清晰度并补齐从原页面进入画笔的路径，文档工坊加强 PPT、PDF、长图、流程图和图示的分页、缩放与完整性检查。关于页信件、全局主题、聊天表格、足迹图片、长通知和通知图片的交互同步优化；打开、回到或刷新 App 后可拉取新公告并按系统权限提示，杀进程后的远程 Push 尚未开放。新增沟通大字板及系统模板，个人模板投稿公共库前需另行授权并经过审核。足迹时光回看重做为彼此分工的时光海岸与深海探索，仍由原足迹统一编辑、删除和导出。本次为非强制更新。',
  },
  {
    date: '2026-08-12',
    title: '知潮 3.0.75：专属学习计划与服务器维护提示',
    desc: '学习教练升级为“专属学习计划”：通过不超过五步的简短定制建立目标，结合已有掌握度、错题、遗忘与计划证据生成阶段路线、当前站点和每日行动；目标日期可随时修改，路线会随真实进度和薄弱科目动态重排，不承诺考试结果。新增登录前、注册和登录后统一的服务器维护提示，可显示维护原因、预计恢复时间并自动刷新，普通网络失败不会被误报成维护。系统更新弹窗改为短摘要，完整说明保留在本页；修复“给你的一封信”点击后返回搭子主页，并补充个人私密记录不得存储违法违规、侵权、医疗谣言或他人隐私信息等合理使用边界。本次为非强制更新。',
  },
  {
    date: '2026-08-11',
    title: '知潮 3.0.74：正式安装包与发布基线维护',
    desc: '将已经完成的首页找功能、英语刷卡提示、全局主题、九图足迹与时光回看、朵朵彩蛋和回应优化统一到新的正式安装包，并补齐版本、启动、签名、产权扫描和公开下载身份校验。本次不改变账号数据、金币奖励或既有安全规则，为非强制更新，可按自己的时间安装。',
  },
  {
    date: '2026-08-11',
    title: '知潮 3.0.73：首页、刷卡、主题与足迹体验升级',
    desc: '首页的“问朵朵·找功能”重新整理小屏布局，标题、说明、输入框与搜索操作分开呈现。英语刷卡学习可按个人习惯选择是否显示中文释义，填词练习会给出足够的词义提示，卡片信息与记忆操作也重新分层。新增全局主题设置，可跟随当前朵朵装扮或单独选择界面配色；普通主题初始为每套 1000 金币并永久解锁，六套限定主题随对应成就永久解锁，不提供金币购买入口。足迹支持九图长按排序和当天上下文详情，并加入四种时光回看场景与 AI 日签；《朵朵百态·初遇篇》收录 20 张免费心情彩蛋，可在彩蛋册查看、分享或提交文字创意参与共创，彩蛋低频出现且不保证每条回应都有。账单朵朵短评会完整显示，MDT 等普通医学学习吐槽不再一刀切；黄赌毒政、未成年人犯罪、暴力、危机与提示注入保护保持。AI 智能服务统一使用一次简洁授权，同意并在线时优先使用 AI，离线或服务失败时使用规则兜底。少量授权后的最终可见片段经安全筛查和去标识后才进入知潮自身改进候选；聊天与足迹的离线文案包会在多轮安全复核后形成版本化更新并可回滚，记账短评仅作人工审核参考，不会自动训练第三方模型。软件下载确认页保留“访问知潮官网”入口，并继续由用户主动开始下载。',
  },
  {
    date: '2026-08-11',
    title: '知潮 3.0.72：英语复习、九图足迹与找功能体验升级',
    desc: '英语刷卡学习补齐由服务端掌握度驱动的到期复习队列，并新增 25 分钟模拟考试，覆盖单项选择、完形填空和阅读理解，提交后可查看逐题解析；每日新词仍设上限，四本词书当前先提供已校验的首组内容，后续内容会按校验结果扩充。足迹一次最多选择九张图片，按数量自动排版并支持点开看大图，此刻状态与标签可多选；已穿戴装扮会同步影响足迹封面、悬浮朵朵和截图问朵朵的配色与边框。“问朵朵·找功能”补充入口名称、说明和命中理由，并改进“病历”等自然语言表达的匹配。医疗内容改为分级提示，避免把普通学习与生活内容一概拦截；黄赌毒政、未成年人犯罪、暴力以及提示词注入和越狱防护继续启用。AI 生成的学习内容可能有误，请结合教材、考试大纲和可靠来源核对。',
  },
  {
    date: '2026-08-11',
    title: '知潮 3.0.71：朵朵笔记的纸面体验再升级',
    desc: '朵朵笔记进一步靠近 GoodNotes 式的纸面工作流：书架更容易找到最近的笔记本与资料，PDF 和图片可直接导入为可阅读、可批注的页面；手写工具与页面操作更集中，并优化翻页、缩放、连续书写和长笔记渲染时的流畅度。本次未改变笔记的数据处理方式。',
  },
  {
    date: '2026-08-11',
    title: '知潮 3.0.70：刷卡学习、找功能与学习体验升级',
    desc: '新增“刷卡学习”：四级、六级、考研和医学英语词书可直接开始首组学习，支持翻卡自评、内建键盘缺字补全、多种词测、朗读与听书，并可按需生成单项选择、完形填空和阅读理解。搭子页新增“问朵朵·找功能”，可用自然语言从现有功能中找到入口，未开启 AI 数据授权时仍可使用本机字面匹配和功能中心。计划提醒改由系统闹钟、系统日历或普通通知承接；足迹个人页重排名片、置顶和按日时间线，并修复部分图片不显示。同步完善账本旧数据恢复、分享卡与品牌落款，以及官方安装包校验和内容接口防滥用保护。AI 生成的学习内容可能有误，请结合教材、考试大纲和可靠来源核对。',
  },
  {
    date: '2026-08-10',
    title: '知潮 3.0.67：朵朵笔记升级全新内核',
    desc: '朵朵笔记改用纸面优先的新体验：书架、PDF 阅读与手写批注、文字编辑和可收起工具栏统一到同一套资料库。切换前会先备份旧笔记；更新后仍可在“旧笔记”入口查看和导出，文字内容会尽力单向导入，未导入内容仍保留在旧笔记中。收藏、临床文书、图示、Markdown、截图文字与知识卡片等既有链路继续可用。',
  },
  {
    date: '2026-08-10',
    title: '知潮 3.0.66：记账界面与长期账本能力升级',
    desc: '记账首页、账单列表、记一笔和统计页统一采用更清晰的账本、月份、分类与金额布局；日期筛选支持本月、上月、近 3 个月和自定义区间。补齐分类层级与分类预算、24 个月趋势、周期复盘、归档账户恢复和跨设备快捷模板；新旧记账内核继续由系统按账本安全选择，基础记账、查询和统计保持一致。',
  },
  {
    date: '2026-08-09',
    title: '知潮 3.0.64：新增文档工坊',
    desc: '新增不限领域的文档工坊：可从一句需求、导入资料、自己的知识卡、朵朵笔记或图示开始，生成后继续编辑标题、正文、表格、插图、图示与分页，并导出带来源标识的 Word、PPT、PDF 和长图。支持自由创作及讲课、教学PPT、试卷、工作汇报、会议纪要、复习讲义、病例汇报等快捷模板；辅助代写关闭、断网或预算耗尽时仍可手动填写、排版和导出。',
  },
  {
    date: '2026-08-09',
    title: '知潮 3.0.63：提醒可靠性与学习整理体验升级',
    desc: '修复计划提醒和专注结束在后台、进程退出或锁屏时可能不响的问题；朵朵聊天新增表格、层级与重点提示等本地结构化呈现，并完善快捷功能卡片。足迹补齐封面、签名、置顶与图片同步；图示支持二次修改、批注和独立疾病思维导图，复习页新增动态节奏统计。同步优化旧笔记迁移恢复、欢迎信、新功能导览与快捷互动布局。',
  },
  {
    date: '2026-08-09',
    title: '知潮 3.0.62：图示生成与交互呈现修复',
    desc: '修复部分历史缓存导致图示生成失败的问题，并加强图示语法校验与自动修复；优化朵朵聊天记账确认卡片及入账后的回复，减少重复文案。同步修复 Android 新功能导览在部分设备上文字被逐字挤成竖排的问题，并统一“给你的一封信”的状态栏、正文与底部留白节奏。',
  },
  {
    date: '2026-08-09',
    title: '知潮 3.0.61：朵朵天气关怀、主动回忆与交互可靠性升级',
    desc: '新增朵朵专属天气关怀，可按已设置地区在未来 8 小时降雨、明显升降温、强风或高紫外线前给出克制提醒；知识卡片加入主动回忆遮挡练习，图示补齐完整预览、主题配色、自定义颜色、图片与 PDF 导出及来源水印。同步优化口语化记账与功能路由、病例训练资料梳理、笔记迁移失败恢复、精确闹钟设置、足迹图文信息流、更新下载和给用户的一封信。',
  },
  {
    date: '2026-08-08',
    title: '知潮 3.0.60：学习工作流、内容整理与可靠性升级',
    desc: '常用功能补齐病例模拟、用药学习卡、课程表和排班表等入口；朵朵聊天改为单一路由协调提醒、计划、记账与学习请求，减少离线规则和在线回复互相抢答。同步升级图示模板、图片与 PDF 导出、足迹图文排版、知识卡片操作、临床案例训练、闹钟看门狗、账单附件显示、计划层级、笔记批量管理与截图解读隔离，并统一柔和 Dock 玻璃效果。',
  },
  {
    date: '2026-08-08',
    title: '知潮 3.0.59：知识卡片整理、聊天体验与稳定性修复',
    desc: '知识卡片新增结构化分段展示，支持单卡内容重新整理、结合内容生成练习题和记忆卡片。朵朵聊天优化：记账、足迹、日程与长期记忆这类需要确认的回复不再和确认卡片重复啰嗦，闹钟提醒答非所问的情况也已改善。修复搭子页常用工具编辑面板视觉问题、天气页定位权限交互、快捷互动页面视觉（头像跟随装扮），以及多处答题与图示页面切换卡顿、选中图标对比度和闹钟响铃服务被系统提前终止时的误判问题。',
  },
  {
    date: '2026-08-06',
    title: '知潮 3.0.43：病历模拟、用药学习卡与笔记记账升级',
    desc: '病历模拟升级为完整训练流程：文书时间线按真实收治顺序解锁，先写入院记录再写后续文书，支持长按删除和导入 Word、TXT、PDF 文档，知情同意书等模板改为规范书面文体，整理成稿排版更有条理。新增用药学习卡：输入药名即可查看分类、作用机制、适应证概览、注意要点与考点提示，二次查询秒回。朵朵笔记新增 Markdown 预览、表格块与思维导图、流程图；随手记账界面瘦身、支持连续记账与常用分类，银行和支付平台图标一眼可辨，并修复图片凭证无法打开的问题。',
  },
  {
    date: '2026-08-02',
    title: '知潮 3.0.30：学习流程、朵朵联动与本地规培工作台升级',
    desc: '优化答题解析、遗忘曲线分轮复习、学习方式设置和趣味学习节奏；修复悬浮朵朵横竖屏贴边、当前应用隐藏及截图问朵朵弹层，并完善聊天对临床工具、知识树和医学学习问题的承接。随手记账现可按当前余额校准账户并优先采用支付通知中可靠识别的账户。新增仅处理虚构或彻底去标识训练资料的本地规培工作台，以及可关闭的应用内后台下载更新体验。',
  },
  {
    date: '2026-08-01',
    title: '知潮 3.0.29：学习、朵朵笔记与识别体验升级',
    desc: '重新梳理学习页视觉层级和二级页面导航，优化 Dock 与翻页、教程、协议等界面的玻璃效果；升级朵朵笔记书架、创建入口、纸张样式、PDF 阅读与手写体验；修复答题闪退、选项显示、OCR 开关更新后丢失等问题，并提升截图识别速度、稳定性与结果展示。登录、备案信息、个人学习包和多处手机/平板交互也同步完善。',
  },
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
    desc: `知潮（当时名为 HuaiPet）Android 移动端正式开启邀请制内测，通过抖音 @${SUPPORT_DOUYIN_NAME} 联系获取邀请码。`,
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

function useHashNavigation() {
  useEffect(() => {
    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      if (!id) return
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' })
      })
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
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
  useHashNavigation()

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
              <span className="hero-eyebrow">槐序工坊 · Android 邀请内测</span>
              <h1>今天学什么，<br /><span>下一步更清楚。</span></h1>
              <p className="hero-sub">
                选定主目标后，把刷题、模拟考、错题复习和知识练习变成掌握证据。知潮会随着真实进度，持续调整今天最值得先做的那一步。
              </p>
              <div className="hero-cta-group">
                <a className="cta" href="#download">下载知潮 {APP_VERSION}</a>
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
            <div className="release-story-meta">
              <span>知潮 3.0.82 候选更新</span>
              <time dateTime={APP_RELEASED_AT}>候选发布时间 · {APP_RELEASED_AT_LABEL}</time>
            </div>
            <h2 id="release-story-title">更私密的关怀，更好用的对话与听背，也更克制地处理数据</h2>
            <p>3.0.82 候选能力已经进入源码，但只有正式签名 APK、服务端迁移与发布链全部核验后，官网才会把它冻结为正式版本并切换下载目标。</p>
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
            <span>已上线能力回顾 · Android 桌面组件</span>
            <h2 id="widget-story-title">不用先打开 App，今天该做什么已经在桌面</h2>
            <p>
              以下桌面组件在此前版本已经上线，本页保留为能力回顾，不列作 3.0.82 本版新增。六类组件会根据桌面空间自动增减信息；
              天气可看当前、24 小时和 7 天，日程可切换计划、课程和值班，学习组件会把真实进度和下一步放在一起。
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
          <p className="section-lead reveal">以下是知潮长期已上线能力回顾，不列作 3.0.82 本版新增；九项能力各司其职，最后都落到一件事：让你更清楚自己学到哪、下一步先做什么。</p>
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
            <div className="download-current-heading">
              <div>
                <span className="download-current-kicker">最新邀请内测版</span>
                <h3>知潮 {APP_VERSION}</h3>
              </div>
              <time dateTime={APP_RELEASED_AT}>{APP_RELEASED_AT_LABEL}</time>
            </div>
            <p>下载安装后，已有知潮账号可直接登录并继续使用云端数据；新用户请先向邀请人或抖音 @槐序学长 获取邀请码。</p>
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
            <a href={SUPPORT_DOUYIN_URL} target="_blank" rel="noopener noreferrer"> 抖音 · {SUPPORT_DOUYIN_NAME} </a>
            或 QQ 2014302010 联系获取邀请码；已有账号可直接登录。
          </p>
        </section>

        <section id="about" className="about">
          <h2 className="section-title reveal">关于我们</h2>
          <p className="reveal">
            知潮是槐序工坊持续开发的学习工具，目标是长期好用、越用越懂你的薄弱点，
            用轻量的陪伴让漫长的医学备考不那么枯燥。项目由旬阳市槐序软件工作室（个体工商户）持续迭代打造，你可以在抖音
            <a href={SUPPORT_DOUYIN_URL} target="_blank" rel="noopener noreferrer"> @{SUPPORT_DOUYIN_NAME} </a>
            咨询邀请码、加入粉丝群或反馈问题；工作室动态、内容共创与合作可联系
            <a href={STUDIO_DOUYIN_URL} target="_blank" rel="noopener noreferrer"> @{STUDIO_DOUYIN_NAME} </a>。也可以通过邮箱
            <a href={`mailto:${CONTACT_EMAIL}`}> {CONTACT_EMAIL} </a>
            联系我们、提出建议。
          </p>
        </section>

        <section id="next-release" className="next-release" aria-labelledby="next-release-title">
          <div className="next-release-heading reveal">
            <span>3.0.82 数据结构与边界 · 候选尚未发布</span>
            <h2 id="next-release-title">V79–V84 随 3.0.82 候选进入同一条核验链</h2>
            <p>
              当前公开下载仍是知潮 3.0.81、生产服务端 schema 仍是 78。下面的 V79–V84 是 3.0.82 候选的真实能力，
              仍需离机备份、连续迁移、正式 Android 构建和安装启动验收后，才能一并公开。
            </p>
          </div>
          <div className="next-release-grid">
            {releaseSchemaCapabilities.map((item) => (
              <article className="next-release-card reveal" key={item.version}>
                <span>{item.version}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
          <p className="next-release-boundary reveal">
            50 GB COS 私有桶已在北京创建并启用 SSE-COS 与版本控制，但生命周期规则尚未提交、上传专用最小权限凭据尚未创建，也没有真实上传、对象核账或恢复收据，因此没有承接用户附件，也不是已经验证的离机备份目的地；
            远程 Push 也仍未启用。具体数据处理、上传限制与删除规则见
            <a href="/legal/privacy.html">《知潮隐私政策》</a>。
          </p>
        </section>

        <section id="cocreate" className="cocreate-band">
          <div className="cocreate">
            <h2 className="section-title reveal">招募共创</h2>
            <p className="cocreate-intro">
              知潮目前是槐序工坊主理人独立推进的项目，还没有任何收入——这不是一份工作，是一次"为爱发电"的邀请。
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
              <a href={STUDIO_DOUYIN_URL} target="_blank" rel="noopener noreferrer"> 抖音 · {STUDIO_DOUYIN_NAME} </a>
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
          <h2 className="section-title">更新日志</h2>
          <p className="changelog-note">官网固定展示最近三次正式更新，避免长历史列表影响浏览；当前版本的完整说明可在上方更新专题与下载页查看。</p>
          <ul className="changelog-list">
            {changelog.slice(0, 3).map((entry) => (
              <li key={`${entry.date}-${entry.title}`}>
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
          href={SUPPORT_DOUYIN_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" className="social-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.28v13.9a3.16 3.16 0 0 1-5.6 2 3.16 3.16 0 0 1 3.34-5.05v-3.34a6.47 6.47 0 0 0-5.4 10.86 6.47 6.47 0 0 0 11.04-4.58V9.01a8.16 8.16 0 0 0 4.7 1.5V7.24a4.85 4.85 0 0 1-3.4-1.42z"
            />
          </svg>
          用户支持：{SUPPORT_DOUYIN_NAME}
        </a>
        <a className="social-link" href={STUDIO_DOUYIN_URL} target="_blank" rel="noopener noreferrer">
          工作室与合作：{STUDIO_DOUYIN_NAME}
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
          {' · '}
          <a
            className="gongan-filing"
            href="https://beian.mps.gov.cn/#/query/webSearch?code=61092802000137"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/gongan.png" alt="" width={18} height={18} />
            陕公网安备61092802000137号
          </a>
        </p>
        <nav className="legal-links">
          <a href="#faq">常见问题</a>
          <a href="#architecture">数据与规则</a>
          <a href="/legal/terms.html">用户协议</a>
          <a href="/legal/privacy.html">App 隐私政策</a>
          <a href="/website-privacy.html">网站隐私说明</a>
          <a href={`mailto:${CONTACT_EMAIL}`}>联系我们</a>
        </nav>
      </footer>
    </div>
  )
}

export default App
