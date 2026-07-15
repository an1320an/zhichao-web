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
  { icon: aiChatIcon, title: 'AI 学习对话', desc: 'DeepSeek 驱动，能记住你的学习进度与薄弱点（AI 生成内容，仅供学习参考）' },
  { icon: examIcon, title: '智能考试系统', desc: 'AI 围绕医学考点自动生成练习题、错题本、三种学习模式，供日常练习（AI 生成，仅供学习参考，以官方教材/大纲为准）' },
  { icon: forgettingCurveIcon, title: '遗忘曲线复习', desc: '1h→1d→2d→4d→7d→15d→30d，科学安排复习节奏' },
  { icon: careerIcon, title: '职业成长路线', desc: '医学生、医生、护士、药师，等级阈值触发晋升与徽章' },
  { icon: cloudSyncIcon, title: '云端数据同步', desc: '账号、学习记录与聊天记忆存在云端，换设备也能同步（当前提供 Android 客户端）' },
]

const roadmap = [
  {
    status: '已完成',
    items: [
      '虚拟伙伴养成系统（等级、成长曲线）',
      'AI 聊天陪伴（DeepSeek 驱动，自动摘取长期记忆）',
      '智能考试系统（AI 出题、错题本、三种学习模式）',
      '遗忘曲线复习（1h→1d→2d→4d→7d→15d→30d）',
      '职业成长路线（医学生→医生/护士/药师，职称阶梯）',
      '云端账号与数据同步（当前提供 Android 客户端）',
      '合规与健康使用保护（18+ 门槛、AI 显著标识、使用时长提醒、危机干预、数据导出与删除）',
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
  ios: '检测到你可能在用 iOS/iPadOS 设备——HuaiPet 目前只支持 Android，iOS 版本还在开发中，敬请期待。',
  harmonyos: '检测到你可能在用鸿蒙系统——HuaiPet 目前只支持 Android，鸿蒙原生版本我们还在评估适配方案。',
}

const platforms = [
  { name: 'Windows 桌面端', desc: '透明置顶桌面悬浮窗，学习提醒与轻量互动', status: '开发中', downloadUrl: null },
  {
    name: 'Android 移动端',
    desc: '手机端学习搭子，随时复习',
    status: '内测招募中',
    downloadUrl: 'https://huaipet.com/download/huaipet-mobile-release.apk',
    qrCode: androidQrCode,
  },
]

const cocreateRoles = [
  {
    title: '剪辑 / 视频创作',
    desc: '槐序 HuaiPet 的抖音开发日记需要人帮忙剪素材、把开发过程做成好看的内容，一起把这个项目的故事讲给更多人听。',
  },
  {
    title: '插画 / 角色设计',
    desc: '朵朵的皮肤、时装系统还在早期设计阶段，需要会画画、懂角色设计的人一起参与——从定风格、定格式，到画出第一批皮肤。',
  },
  {
    title: '医学内容顾问',
    desc: 'AI 出题与解析涉及大量医学知识，希望有执业资格 / 医学背景的人帮忙抽审内容、把关考点设计，降低 AI 生成内容出错的风险（目前该岗位仍在招募中，AI 生成内容暂未经执业人员逐条审核）。',
  },
  {
    title: '宣传 / 拉新',
    desc: '好产品也需要被更多人看到，需要懂社群运营、擅长宣传推广的人帮忙把 HuaiPet 带给更多医学生和医护人员。',
  },
]

const contributors = [
  {
    name: '知许',
    title: 'HuaiPet 第一批共创成员',
    contribution: '宣传协助、内测反馈',
    thanks: '感谢知许在 HuaiPet 早期内测阶段参与共创，协助宣传、反馈体验，并和我们一起打磨这个给医学人用的 AI 学习工具。',
  },
]

const faq = [
  {
    q: '有年龄限制吗？',
    a: '有。本服务包含 AI 拟人化陪伴功能，按《人工智能拟人化互动服务管理暂行办法》仅面向年满 18 周岁的用户。注册时需填写出生年月用于年龄核验；已注册的老用户在新版客户端中也需要补填。',
  },
  {
    q: 'HuaiPet 免费吗？',
    a: '目前免费，且不提供任何付费购买功能——App 内的金币只能通过学习、答题、完成任务获得，不能用真实货币购买。如果未来提供自愿支持类功能，我们会另行明确告知，并且不会以"增进与朵朵的情感关系"作为付费卖点。',
  },
  {
    q: '支持哪些平台？',
    a: 'Android 移动端已开启邀请制内测。想参与内测的话，通过抖音 @槐序学长 或 QQ 2014302010 联系我们获取邀请码。',
  },
  {
    q: '我的数据存在哪里？会交给第三方吗？',
    a: '账号、学习记录与聊天内容保存在我们的服务器上，服务器目前位于中国香港，属于个人信息出境；聊天内容会发送给第三方大模型服务商 DeepSeek（深度求索）用于生成回复。注册时我们会就这两件事分别向你单独征求同意，你也可以随时在设置页撤回 AI 数据授权（撤回后 AI 功能停用，其它功能仍可使用）。我们计划把服务器迁回中国内地。详见隐私政策。',
  },
  {
    q: '我能导出或删除我的数据吗？',
    a: '可以。App 内「设置 → 导出我的数据」可随时下载你的数据副本；你也可以随时注销账号，注销后我们会级联删除你的全部个人数据。',
  },
  {
    q: 'AI 给出的内容能直接当复习资料吗？',
    a: '不能作为最终依据。AI 生成的内容（聊天回复、考试题目与解析）仅供学习参考，不能替代正式教材、考试大纲和专业医学判断，更不能作为医疗、诊断、用药的依据。详见免责声明。',
  },
  {
    q: '朵朵是真人吗？我可以把它当心理咨询用吗？',
    a: '朵朵是 AI 程序，不是真人，也不具备任何医疗或心理咨询资质，不能替代专业帮助。如果你正处在情绪困境中，请联系全国统一心理援助热线 12356；如遇紧急情况请拨打 110 或 120。',
  },
]

const changelog = [
  {
    date: '2026-07-15',
    title: '合规更新：18+ 门槛、AI 标识与健康使用保护',
    desc: '依据《人工智能拟人化互动服务管理暂行办法》（2026-07-15 施行）：本服务仅面向年满 18 周岁用户，注册需提供出生年月（已注册的老用户在新版 App 中需补填，不补填将无法继续使用）；朵朵在首页与聊天页常驻「AI 程序，不是真人」标识；新增连续使用满 2 小时提醒与过度依赖提示；对涉及自伤、自杀的表述提供即时求助热线（12356）并由人工跟进；新增「导出我的数据」；上线《投诉举报》页并承诺受理时限。',
  },
  {
    date: '2026-07-08',
    title: 'Android 内测开启',
    desc: 'HuaiPet Android 移动端正式开启邀请制内测，通过抖音 @槐序学长 联系获取邀请码。',
  },
  {
    date: '2026-07-07',
    title: '官网上线',
    desc: '槐序 HuaiPet 官网正式上线，huaipet.com 可以访问了。',
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
          <span className="brand">槐序 HuaiPet</span>
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
            <img src={idleFace} alt="AI 学习搭子朵朵" className="hero-mascot" />
            <h1>给医学人的 AI 学习搭子</h1>
            <p className="hero-sub">
              把 <strong>AI 出题、错题复盘、遗忘曲线复习</strong> 和轻量养成激励做在一起的医学学习工具。
            </p>
            {/* 第十八条：必须显著标识"非真人"。官网是拉新的第一触点，App 里有而官网没有是说不过去的。 */}
            <p className="ai-notice">
              🤖 朵朵是 AI 程序，不是真人。AI 生成内容仅供学习参考，不能替代教材与专业医学判断。本服务仅面向年满 18 周岁的用户。
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
          <p className="download-note">Android 移动端已开启邀请制内测，Windows 桌面端还在开发中。</p>
          {platformNotice && <p className="download-platform-notice">{platformNotice}</p>}
          <div className="card-grid">
            {platforms.map((p) => (
              <div className="card platform-card reveal" key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <span className="platform-status">{p.status}</span>
                {p.downloadUrl && (
                  <a className="platform-download" href={p.downloadUrl}>
                    下载安装包
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
            内测需要邀请码才能注册，通过
            <a href="https://v.douyin.com/4vpWBY5MsL0/" target="_blank" rel="noopener noreferrer"> 抖音 · 槐序学长 </a>
            或 QQ 2014302010 联系我们获取邀请码。
          </p>
        </section>

        <section id="about" className="about">
          <h2 className="section-title reveal">关于我们</h2>
          <p className="reveal">
            槐序 HuaiPet 是一个正在开发中的独立项目，目标是做一个长期好用、越用越懂你薄弱点的医学学习工具，
            用轻量的陪伴让漫长的医学备考不那么枯燥。项目由个人开发者持续迭代打造，你可以在抖音
            <a href="https://v.douyin.com/4vpWBY5MsL0/" target="_blank" rel="noopener noreferrer"> @槐序学长 </a>
            关注最新进展，或通过邮箱
            <a href="mailto:an1320an@gmail.com"> an1320an@gmail.com </a>
            联系我们、提出建议。
          </p>
        </section>

        <section id="cocreate" className="cocreate-band">
          <div className="cocreate">
            <h2 className="section-title reveal">招募共创</h2>
            <p className="cocreate-intro">
              槐序 HuaiPet 目前是一个人在做的独立项目，还没有任何收入——这不是一份工作，是一次"为爱发电"的邀请。
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
              <a href="https://v.douyin.com/4vpWBY5MsL0/" target="_blank" rel="noopener noreferrer"> 抖音 · 槐序学长 </a>
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
            <div className="arch-node">浏览器</div>
            <div className="arch-arrow">↓</div>
          </div>
          <div className="arch-backend">后端（Fastify + SQLite）── DeepSeek API</div>
          <p className="arch-note">所有数据变更、所有 AI 调用、所有业务逻辑，统一经过后端。</p>
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
          href="https://v.douyin.com/4vpWBY5MsL0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" className="social-icon" aria-hidden="true">
            <path
              fill="currentColor"
              d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.28v13.9a3.16 3.16 0 0 1-5.6 2 3.16 3.16 0 0 1 3.34-5.05v-3.34a6.47 6.47 0 0 0-5.4 10.86 6.47 6.47 0 0 0 11.04-4.58V9.01a8.16 8.16 0 0 0 4.7 1.5V7.24a4.85 4.85 0 0 1-3.4-1.42z"
            />
          </svg>
          抖音：槐序学长
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
        <p>槐序 HuaiPet · 敬请期待</p>
        <p className="ai-notice-footer">
          🤖 朵朵是 AI 程序，不是真人。本站与 App 内的 AI 生成内容仅供学习参考，不构成医疗建议。
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
