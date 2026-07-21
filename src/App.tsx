import { useState, useEffect } from 'react'
import './App.css'
import idleFace from '/mascot/idle.webp'
import happyFace from '/mascot/happy.webp'
import companionBanner from '/hero-companion-banner.webp'
import petGrowthIcon from '/features/feature-pet-growth.webp'
import aiChatIcon from '/features/feature-ai-chat.webp'
import examIcon from '/features/feature-exam.webp'
import forgettingCurveIcon from '/features/feature-forgetting-curve.webp'
import careerIcon from '/features/feature-career.webp'
import cloudSyncIcon from '/features/feature-cloud-sync.webp'
import androidQrCode from '/qr-android-download.svg'

const DOUYIN_URL = 'https://v.douyin.com/Tmm7e_p2rMM/'
const DOUYIN_NAME = '槐序工作室'

// 合规改造 2026-07-15：原来这四条把"让用户感觉朵朵在陪我，而不是在用一个工具"当卖点，
// 那是把"模糊人机边界、培养情感依赖"写成产品纲领对外宣传，直接撞《人工智能拟人化互动
// 服务管理暂行办法》第八条（不得诱导情感依赖）与第十八条（须显著标识非真人）；
// 另一条"共情比准确更重要"对一个医学考试产品更是致命——它和 App 里刚上线的医疗拒答
// 红线自相矛盾。重写为：学习效果优先、准确优先，陪伴是手段不是目的。
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
  { icon: petGrowthIcon, title: '轻量养成激励', desc: '等级 1-99，成长曲线，学历、打工、商店一应俱全。金币只能通过学习获得，不支持任何形式的付费购买' },
  { icon: aiChatIcon, title: '朵朵 AI / 离线双引擎', desc: '邀请内测用户授权后可使用 DeepSeek 实时生成；所有 AI 内容均带来源标识，并保留审核文案库与规则引擎作为一键回退能力' },
  { icon: examIcon, title: '考试与题库系统', desc: '预置题库、错题本、三种学习模式与静态解析，供日常练习（以官方教材与考试大纲为准）' },
  { icon: forgettingCurveIcon, title: '遗忘曲线复习', desc: '1h→1d→2d→4d→7d→15d→30d，科学安排复习节奏' },
  { icon: careerIcon, title: '职业成长路线', desc: '医学生、医生、护士、药师，等级阈值触发晋升与徽章' },
  { icon: cloudSyncIcon, title: '云端数据同步', desc: '账号、学习记录与聊天记忆存在云端，换设备也能同步（当前提供 Android 客户端）' },
]

const roadmap = [
  {
    status: '已完成',
    items: [
      '虚拟伙伴养成系统（等级、成长曲线）',
      '朵朵文字聊天（邀请内测 AI、内容安全闸门、AI 标识与离线规则回退）',
      '考试与题库系统（预置题库、静态解析、错题本、三种学习模式）',
      '遗忘曲线复习（1h→1d→2d→4d→7d→15d→30d）',
      '职业成长路线（医学生→医生/护士/药师，职称阶梯）',
      '云端账号与数据同步（当前提供 Android 客户端）',
      '安全与健康使用保护（18+ 门槛、回复来源标识、使用时长提醒、危机干预、数据导出与删除）',
    ],
  },
  {
    status: '进行中',
    items: [
      '等级制职称身份系统升级',
      '视觉奖励——等级边框、晋升徽章',
      '庆祝动画——晋升烟花 + 朵朵祝贺',
      '学习节奏提醒——阶段复盘、考前复习计划',
      '更多职业身份（检验、影像、公卫、口腔、中医……）',
    ],
  },
  {
    status: '未来方向',
    items: [
      '多端接入——微信小程序（规划中，方便随手打开、无需下载）',
      '学习功能深化——阶段学习总结、考前复习计划、考后错题复盘报告',
      '成长可视化——成长时间线、知识图谱、学习报告',
      '技术基建——推送通知、离线模式、多语言',
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
    desc: '知潮 1.3.4 Android 安装包',
    status: '内测更新',
    downloadUrl: 'https://huaipet.com/download/zhichao-mobile-release.apk',
    downloadLabel: '下载知潮新包',
    qrCode: androidQrCode,
  },
  { name: '微信小程序', desc: '随手打开、无需下载（正在评估）', status: '评估中', downloadUrl: null, downloadLabel: null, qrCode: null },
  { name: 'Windows 桌面端', desc: '透明置顶桌面悬浮窗，学习提醒与轻量互动', status: '暂缓开发', downloadUrl: null, downloadLabel: null, qrCode: null },
]

const cocreateRoles = [
  {
    title: '剪辑 / 视频创作',
    desc: '槐序工作室的知潮开发日记需要人帮忙剪素材、把开发过程做成好看的内容，一起把这个项目的故事讲给更多人听。',
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
    a: '目前免费，且不提供任何付费购买功能——App 内的金币只能通过学习、答题、完成任务获得，不能用真实货币购买。如果未来提供自愿支持类功能，我们会另行明确告知，并且不会以"增进与朵朵的情感关系"作为付费卖点。',
  },
  {
    q: '支持哪些平台？',
    a: `Android 移动端目前为邀请制内测（面向年满 18 周岁的用户）。想参与内测的话，通过抖音 @${DOUYIN_NAME} 或 QQ 2014302010 联系我们获取邀请码。`,
  },
  {
    q: '我的数据存在哪里？会交给第三方吗？',
    a: '账号、学习记录与聊天内容保存在我们的服务器上，服务器目前位于中国香港，属于个人信息出境。你主动开启一项「内测 AI 数据授权」后，相关对话或学习输入会交给 DeepSeek 生成本次结果；同一授权还允许系统把通过安全筛选、脱敏和去身份化的短表达汇总为离线资源候选，不包含账号身份，也不把模型回复当作样本。撤回授权后两项同时停止。我们计划在 huaix.cn 完成备案后迁回中国内地。详见隐私政策。',
  },
  {
    q: '我能导出或删除我的数据吗？',
    a: '可以。App 内「设置 → 导出我的数据」可随时下载你的数据副本；你也可以随时注销账号。注销后会级联删除账号与业务数据，仅保留隐私政策中说明的最小同意凭证。',
  },
  {
    q: '朵朵和题库内容能直接当最终复习依据吗？',
    a: '不能。AI 或规则回复、题目与解析都只用于学习辅助，AI 内容可能出现错误、遗漏或虚构，不能替代正式教材、考试大纲和专业医学判断，更不能作为医疗、诊断、用药的依据。详见免责声明。',
  },
  {
    q: '朵朵是真人吗？我可以把它当心理咨询用吗？',
    a: '朵朵是由 AI 或规则引擎驱动的自动回应程序，不是真人，也不具备任何医疗或心理咨询资质，不能替代专业帮助。如果你正处在情绪困境中，请联系全国统一心理援助热线 12356；如遇紧急情况请拨打 110 或 120。',
  },
  {
    q: '邀请制内测是不是代表不用履行生成式 AI 相关手续？',
    a: '不是。邀请制内测不等于当然豁免。当前模型服务商公开的备案信息为 Deepseek Chat（Beijing-DeepseekChat-202404280016）和深度求索大模型算法（网信算备110108970550101240011号）；这些信息不等于知潮已经完成作为下游应用可能需要履行的全部手续。我们会按实际服务方式继续评估并推进相应合规工作。',
  },
  {
    q: '为什么上传题库或生成知识树前要同意公共内容共创？',
    a: '这些功能会产生可复用的学习内容。只有你明确开启公共内容共创后才能使用；题库原文件由管理员人工整理，不再自动解析，合格整理结果会经过隐私拦截、去重和 3～5 轮自动交叉复核，再进入公共题库或公共知识池，不公开原文件、邮箱、昵称等身份信息。拒绝或关闭不影响已有题库、错题本和公开内容浏览。',
  },
]

const changelog = [
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
    desc: '向邀请码注册的内测用户开放 AI 对话、AI 出题与知识树能力；加入请求安全闸门、AI 来源标识、使用限制与可一键切回的离线规则引擎。一项可撤回的内测 AI 数据授权同时覆盖本次生成和经安全筛选、脱敏、去身份化后的短表达离线资源改进；公共内容共创另行授权，上传题库、个人知识树/知识卡片和公共题目只在明确同意后开放，合格内容经多轮自动复核后进入公共池。同步修复共创题库 TXT、DOCX、PDF 文件在手机端未真正发出的问题，并改进多轮上下文、足迹线程、装扮与提醒可靠性。',
  },
  {
    date: '2026-07-19',
    title: '朵朵切换为审核文案规则聊天',
    desc: '聊天界面与历史记录继续保留，回复改由服务端审核文案库、关键词规则和学习数据组合，不实时调用云端大模型。经用户单独授权的脱敏缺口可用于后台改进静态内容；以后如具备合规条件，可受控切换回复引擎。',
  },
  {
    date: '2026-07-16',
    title: '注册流程简化 + AI 授权可延后',
    desc: '注册改为两步完成，出生年月改用滑动选择更省心；AI 陪伴授权不再强制在注册时同意，可在首次使用 AI 功能时再单独开启（不影响计划、学习、足迹等基础功能）。目前仍为邀请制内测。',
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
            <a href="#philosophy">理念</a>
            <a href="#features">功能</a>
            <a href="#about">关于</a>
            <a href="#cocreate">共创</a>
            <a href="#roadmap">成长路线图</a>
            <a href="#changelog">更新日志</a>
            <a href="#download" className="nav-cta">下载</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-inner">
            <img src={idleFace} alt="学习搭子朵朵" className="hero-mascot" />
            <h1>给医学人的学习搭子</h1>
            <p className="hero-sub">
              把 <strong>题库练习、错题复盘、遗忘曲线复习</strong> 和轻量养成激励做在一起的医学学习工具。
            </p>
            <p className="ai-notice">
              🧪 邀请内测用户可在一项知情授权下使用 DeepSeek 驱动的 AI 对话、出题与知识树能力；AI 内容均会标识来源，可能出现错误，也不是真人。通过安全筛选、脱敏和去身份化的用户短表达可用于改进离线资源库；撤回授权后实时生成与新样本收集同时停止。内容仅供学习辅助，不能替代教材与专业医学判断。本服务仅面向年满 18 周岁的用户。
            </p>
            <img src={companionBanner} alt="朵朵陪你复习医学知识点" className="hero-companion" />
            <div className="hero-cta-group">
              <a className="cta" href="#download">立即下载 / 参与内测</a>
              <a className="cta cta-secondary" href="#features">了解更多</a>
            </div>
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
          <div className="card-grid">
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
          <div className="download-migration reveal">
            <h3>旧版用户迁移说明</h3>
            <p>这次知潮更换了 Android 安装包身份，因此会作为一个新 App 安装，不会覆盖手机里的旧版 HuaiPet。</p>
            <ol>
              <li>下载安装知潮新包。</li>
              <li>使用原来的账号登录，云端学习记录会继续保留。</li>
              <li>确认知潮内的数据和功能正常后，再卸载旧版 HuaiPet。</li>
            </ol>
          </div>
          <p className="download-note">Android 移动端为邀请制内测，通过 抖音 · {DOUYIN_NAME} 或 QQ 2014302010 联系获取邀请码；微信小程序正在评估中；Windows 桌面端暂缓开发。</p>
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
            知潮（原 HuaiPet）是槐序工作室持续开发的学习工具，目标是长期好用、越用越懂你的薄弱点，
            用轻量的陪伴让漫长的医学备考不那么枯燥。项目由旬阳市槐序软件工作室（个体工商户）持续迭代打造，你可以在抖音
            <a href={DOUYIN_URL} target="_blank" rel="noopener noreferrer"> @{DOUYIN_NAME} </a>
            关注最新进展，或通过邮箱
            <a href="mailto:an1320an@gmail.com"> an1320an@gmail.com </a>
            联系我们、提出建议。
          </p>
        </section>

        <section id="cocreate" className="cocreate-band">
          <div className="cocreate">
            <h2 className="section-title reveal">招募共创</h2>
            <p className="cocreate-intro">
              知潮目前是槐序工作室主理人独立推进的项目，还没有任何收入——这不是一份工作，是一次"为爱发电"的邀请。
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
              <a href="mailto:an1320an@gmail.com"> 邮箱 </a>
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
            {changelog.map((entry) => (
              <li key={entry.date} className="reveal">
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
          <h2 className="section-title reveal">一处记录，处处同步</h2>
          <div className="arch-diagram reveal">
            <div className="arch-node">手机端</div>
            <div className="arch-node">电脑端</div>
            <div className="arch-node">微信小程序</div>
            <div className="arch-arrow">↓</div>
          </div>
          <div className="arch-backend">后端（Fastify + SQLite）── 安全闸门、AI 编排与离线资源库</div>
          <p className="arch-note">邀请内测用户知情授权后，后端才会把必要输入交给 DeepSeek；危机、医疗咨询及违法违规请求先行拦截，AI 内容明确标识，并可通过服务端开关一键回退至离线规则引擎。</p>
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
            共创成员名单仅用于感谢早期参与者，不代表股权、雇佣、商业代理或官方授权关系。
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
          联系邮箱：<a href="mailto:an1320an@gmail.com">an1320an@gmail.com</a>
        </p>
        <p>旬阳市槐序软件工作室（个体工商户） · 知潮</p>
        <p className="ai-notice-footer">
          🧪 朵朵在邀请内测阶段可由 DeepSeek 或离线规则引擎自动回应，不是真人。开启一项内测 AI 数据授权后才会进行实时生成，并可将安全筛选、脱敏、去身份化的用户短表达用于改进离线资源；撤回后两项同时停止。AI 内容可能有误，仅供学习辅助，不构成医疗建议。
        </p>
        <p className="ai-notice-footer">
          如果你正处在情绪困境中，请联系全国统一心理援助热线{' '}
          <a href="tel:12356">12356</a>；紧急情况请拨打 <a href="tel:110">110</a> 或 <a href="tel:120">120</a>。
        </p>
        <nav className="legal-links">
          <a href="#faq">常见问题</a>
          <a href="#architecture">架构</a>
          <a href="/legal/privacy.html">隐私政策</a>
          <a href="/legal/terms.html">用户协议</a>
          <a href="/legal/disclaimer.html">免责声明</a>
          <a href="/legal/complaints.html">投诉举报</a>
        </nav>
      </footer>
    </div>
  )
}

export default App
