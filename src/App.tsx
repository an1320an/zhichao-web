import './App.css'
import idleFace from '/mascot/idle.webp'
import companionBanner from '/hero-companion-banner.webp'
import petGrowthIcon from '/features/feature-pet-growth.webp'
import aiChatIcon from '/features/feature-ai-chat.webp'
import examIcon from '/features/feature-exam.webp'
import forgettingCurveIcon from '/features/feature-forgetting-curve.webp'
import careerIcon from '/features/feature-career.webp'
import cloudSyncIcon from '/features/feature-cloud-sync.webp'

const philosophy = [
  {
    title: '陪伴 > 功能',
    desc: '每一个功能都应该让用户感觉"朵朵在陪我"，而不是"我在使用一个工具"。',
  },
  {
    title: '游戏化 ≠ 功利化',
    desc: '等级、称号、徽章是成长的回馈，不是 KPI。',
  },
  {
    title: '温度 > 效率',
    desc: '鼓励比效率更重要，共情比准确更重要。',
  },
  {
    title: '漫漫医学路，朵朵一直在',
    desc: '产品的时间尺度是"几年"，不是"几天"。',
  },
]

const features = [
  { icon: petGrowthIcon, title: '宠物养成', desc: '等级 1-99，成长曲线，学历、打工、商店一应俱全' },
  { icon: aiChatIcon, title: 'AI 陪伴对话', desc: 'DeepSeek 驱动，自动摘取长期记忆，越聊越懂你' },
  { icon: examIcon, title: '智能考试系统', desc: 'AI 出题、错题本、三种学习模式，专为医学考点设计' },
  { icon: forgettingCurveIcon, title: '遗忘曲线复习', desc: '1h→1d→2d→4d→7d→15d→30d，科学安排复习节奏' },
  { icon: careerIcon, title: '职业成长路线', desc: '医学生、医生、护士、药师，等级阈值触发晋升与徽章' },
  { icon: cloudSyncIcon, title: '跨端云同步', desc: '桌面、手机、浏览器，数据和聊天记忆随身带走' },
]

const roadmap = [
  {
    status: '已完成',
    items: [
      '宠物养成系统（等级、成长曲线）',
      'AI 聊天陪伴（DeepSeek 驱动，自动摘取长期记忆）',
      '智能考试系统（AI 出题、错题本、三种学习模式）',
      '遗忘曲线复习（1h→1d→2d→4d→7d→15d→30d）',
      '职业成长路线（医学生→医生/护士/药师，职称阶梯）',
      '跨端云同步（桌面、手机、浏览器）',
    ],
  },
  {
    status: '进行中',
    items: [
      '等级制职称身份系统升级',
      '视觉奖励——等级边框、晋升徽章',
      '庆祝动画——晋升烟花 + 朵朵祝贺',
      '陪伴对话系统——学习鼓励、考前安慰、考后共情',
      '更多职业身份（检验、影像、公卫、口腔、中医……）',
    ],
  },
  {
    status: '未来方向',
    items: [
      '陪伴深化——每日问候、学习总结、考前陪伴、考后反馈',
      '成长可视化——成长时间线、知识图谱、学习报告',
      '技术基建——推送通知、离线模式、多语言',
    ],
  },
]

const platforms = [
  { name: 'Windows 桌面端', desc: '透明置顶桌宠窗口，摸头、喂食、休息', status: '开发中', downloadUrl: null },
  {
    name: 'Android 移动端',
    desc: '手机浮窗宠物，随身陪伴',
    status: '内测招募中',
    downloadUrl: 'https://huaipet.com/download/huaipet-mobile-release.apk',
  },
]

const faq = [
  {
    q: 'HuaiPet 免费吗？',
    a: '目前处于开发阶段，暂无定价计划，具体收费模式会在正式上线前公布。',
  },
  {
    q: '支持哪些平台？',
    a: 'Android 移动端已开启邀请制内测，Windows 桌面端还在开发中。想参与内测的话，通过抖音 @槐序学长 或 QQ 2014302010 联系我们获取邀请码。',
  },
  {
    q: '我的数据安全吗？',
    a: 'HuaiPet 支持本地/云端双模式：本地模式下数据只保存在你的设备上；云端模式会加密存储在服务器用于跨设备同步。详见隐私政策。',
  },
  {
    q: 'AI 给出的内容能直接当复习资料吗？',
    a: 'AI 生成的内容（聊天回复、考试题目与解析）仅供学习参考，不能替代正式教材、考试大纲和专业医学判断，详见免责声明。',
  },
]

const changelog = [
  {
    date: '2026-07-08',
    title: 'Android 内测开启',
    desc: 'HuaiPet Android 移动端正式开启邀请制内测，通过抖音 @槐序学长 联系获取邀请码。',
  },
  {
    date: '2026-07-07',
    title: '官网上线',
    desc: '槐序·HuaiPet 官网正式上线，huaipet.com 可以访问了。',
  },
  {
    date: '2026-07-06',
    title: 'v0.1.0',
    desc: '宠物养成、学历系统、打工系统、商店系统、聊天系统、任务系统、记忆系统、偏好系统、账号系统、云同步、桌面浮窗宠物、手机浮窗宠物、管理员后台、考试系统、三种学习模式、遗忘曲线复习、职业系统全部跑通。',
  },
]

function App() {
  return (
    <div className="page">
      <header className="nav">
        <div className="nav-inner">
          <span className="brand">槐序 · HuaiPet</span>
          <nav>
            <a href="#philosophy">理念</a>
            <a href="#features">功能</a>
            <a href="#about">关于</a>
            <a href="#roadmap">路线图</a>
            <a href="#changelog">更新日志</a>
            <a href="#download" className="nav-cta">下载</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <img src={idleFace} alt="朵朵" className="hero-mascot" />
          <h1>一个会陪着医学人成长的 AI 小伙伴</h1>
          <p className="hero-sub">
            不是 AI 刷题软件，不是 AI 聊天机器人，是<strong>陪伴式医学学习伴侣</strong>。
          </p>
          <img src={companionBanner} alt="用户与朵朵彼此陪伴" className="hero-companion" />
          <div className="hero-cta-group">
            <a className="cta" href="#download">立即下载 / 参与内测</a>
            <a className="cta cta-secondary" href="#features">了解更多</a>
          </div>
        </section>

        <section id="philosophy" className="philosophy">
          <h2 className="section-title">产品哲学</h2>
          <div className="card-grid">
            {philosophy.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="features">
          <h2 className="section-title">功能亮点</h2>
          <div className="card-grid">
            {features.map((item) => (
              <div className="card feature-card" key={item.title}>
                <img src={item.icon} alt="" className="feature-icon" loading="lazy" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="download" className="download">
          <h2 className="section-title">下载</h2>
          <p className="download-note">Android 移动端已开启邀请制内测，Windows 桌面端还在开发中。</p>
          <div className="card-grid">
            {platforms.map((p) => (
              <div className="card platform-card" key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <span className="platform-status">{p.status}</span>
                {p.downloadUrl && (
                  <a className="platform-download" href={p.downloadUrl}>
                    下载安装包
                  </a>
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
          <h2 className="section-title">关于我们</h2>
          <p>
            槐序·HuaiPet 是一个正在开发中的独立项目，目标是做一个真正"陪伴"医学生和医护人员走过整条职业成长路的
            AI 搭子——不是刷题软件，也不是普通聊天机器人。项目由个人开发者持续迭代打造，你可以在抖音
            <a href="https://v.douyin.com/4vpWBY5MsL0/" target="_blank" rel="noopener noreferrer"> @槐序学长 </a>
            关注最新进展，或通过邮箱
            <a href="mailto:an1320an@gmail.com"> an1320an@gmail.com </a>
            联系我们、提出建议。
          </p>
        </section>

        <section id="roadmap" className="roadmap">
          <h2 className="section-title">路线图</h2>
          <div className="roadmap-columns">
            {roadmap.map((column) => (
              <div className="roadmap-column" key={column.status}>
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
          <ul className="changelog-list">
            {changelog.map((entry) => (
              <li key={entry.date}>
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
          <h2 className="section-title">常见问题</h2>
          <div className="faq-list">
            {faq.map((item) => (
              <div className="faq-item" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="architecture" className="architecture">
          <h2 className="section-title">一处陪伴，处处同步</h2>
          <div className="arch-diagram">
            <div className="arch-node">手机端</div>
            <div className="arch-node">电脑端</div>
            <div className="arch-node">浏览器</div>
            <div className="arch-arrow">↓</div>
          </div>
          <div className="arch-backend">后端（Fastify + SQLite）── DeepSeek API</div>
          <p className="arch-note">所有数据变更、所有 AI 调用、所有业务逻辑，统一经过后端。</p>
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
        <p>HuaiPet · 敬请期待</p>
        <nav className="legal-links">
          <a href="#faq">常见问题</a>
          <a href="#architecture">架构</a>
          <a href="/legal/privacy.html">隐私政策</a>
          <a href="/legal/terms.html">用户协议</a>
          <a href="/legal/disclaimer.html">免责声明</a>
        </nav>
      </footer>
    </div>
  )
}

export default App
