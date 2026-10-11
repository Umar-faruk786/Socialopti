import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useInView, animate } from 'framer-motion'
import { useEffect, useRef, useState, useMemo } from 'react'
import {
  LuBrainCircuit, LuSparkles, LuTrendingUp, LuChartBar,
  LuHistory, LuClock, LuArrowRight, LuCheck,
  LuEye, LuHeart, LuShare2, LuMessageCircle,
  LuChevronRight, LuImagePlus, LuCopy, LuCheckCheck,
  LuRefreshCw, LuFlame, LuShieldCheck, LuUsers,
  LuGauge, LuLightbulb, LuLayers, LuChevronDown,
  LuMenu, LuX, LuTarget, LuZap, LuArrowUpRight,
  LuActivity, LuNetwork, LuBot, LuGlobe,
} from 'react-icons/lu'
import { HiSparkles } from 'react-icons/hi2'
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaTiktok, FaFacebookF } from 'react-icons/fa6'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid
} from 'recharts'
import WorkflowDemo from '../components/WorkflowDemo'
import './landing.css'

/* ─── Animation Variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const inViewOpts = { once: true, margin: '-60px' }

/* ─── Dynamic Preset Data for Hero Simulator ──────────────── */
const HERO_PRESETS = [
  {
    id: 'tech',
    title: '🚀 Tech Startup Launch',
    platform: 'Instagram',
    originalScore: 68,
    optimizedScore: 94,
    bestTime: '7:45 PM',
    caption: 'We just dropped our next-gen developer toolkit! ⚡ Supercharge your builds 10x faster with AI-driven pipelines. What is your biggest deployment bottleneck?',
    tags: ['#DeveloperTools', '#DevOps', '#TechInnovation', '#SoftwareEngineering', '#AI'],
    predicted: { reach: '34.2K', likes: '4.8K', comments: '920', shares: '680' },
    tip: 'Adding a question hook at the end increases comment participation by +48% on technical posts.',
    hookStrength: '9.6/10',
    sentiment: '98% Positive',
  },
  {
    id: 'lifestyle',
    title: '☕ Artisan Coffee Brand',
    platform: 'Instagram',
    originalScore: 72,
    optimizedScore: 96,
    bestTime: '8:15 AM',
    caption: 'Mornings made better ☕ Handcrafted single-origin pour-overs now brewing daily at our downtown flagship. Tag your coffee partner in crime!',
    tags: ['#CoffeeCulture', '#SpecialtyCoffee', '#BaristaLife', '#MorningRitual', '#Foodie'],
    predicted: { reach: '48.6K', likes: '6.4K', comments: '1.2K', shares: '890' },
    tip: 'Visual color warmth matches peak lifestyle aesthetics; morning post timing captures commute scrolling.',
    hookStrength: '9.4/10',
    sentiment: '96% Positive',
  },
  {
    id: 'b2b',
    title: '💡 B2B Growth Strategy',
    platform: 'LinkedIn',
    originalScore: 64,
    optimizedScore: 93,
    bestTime: '9:00 AM',
    caption: '0 to 10k users in 90 days: here are the 4 counter-intuitive retention frameworks nobody talks about on LinkedIn 🧵👇',
    tags: ['#B2BMarketing', '#SaaSGrowth', '#StartupStrategy', '#FounderLife', '#ProductManagement'],
    predicted: { reach: '28.9K', likes: '3.1K', comments: '640', shares: '780' },
    tip: 'Numbered breakdown format drives 3.4x higher bookmarking & repost rate on professional feeds.',
    hookStrength: '9.8/10',
    sentiment: '94% Positive',
  },
  {
    id: 'fitness',
    title: '🏋️‍♂️ Fitness & Wellness',
    platform: 'TikTok',
    originalScore: 70,
    optimizedScore: 95,
    bestTime: '6:30 PM',
    caption: 'No gym? No excuse. Try this 15-minute high-intensity core & cardio blast you can do in your living room right now 🔥 Save for later!',
    tags: ['#HomeWorkout', '#FitnessMotivation', '#HIITRoutine', '#HealthGoals', '#QuickWorkout'],
    predicted: { reach: '72.4K', likes: '9.8K', comments: '1.8K', shares: '3.4K' },
    tip: 'Call-to-action "Save for later" elevates TikTok save-rate algorithm boost by +65%.',
    hookStrength: '9.5/10',
    sentiment: '97% Positive',
  },
]

/* ─── Infinite Marquee Ticker Items ──────────────────────── */
const MARQUEE_ITEMS = [
  { icon: '🚀', user: '@growth_lead', action: 'Boosted LinkedIn reach by +380%', platform: 'LinkedIn' },
  { icon: '✨', user: '@design_daily', action: 'Scored 98/100 viral hook potential', platform: 'Instagram' },
  { icon: '📈', user: '@saas_founder', action: 'Post optimized: 48.2K predicted impressions', platform: 'X / Twitter' },
  { icon: '⚡', user: '@fitness_core', action: 'Algorithm timing calibrated: 6:30 PM', platform: 'TikTok' },
  { icon: '🔥', user: '@ai_insider', action: 'Hashtag synergy index raised by +34%', platform: 'Instagram' },
  { icon: '🎯', user: '@ecom_master', action: 'Engagement rate jumped from 1.8% to 6.4%', platform: 'LinkedIn' },
]

/* ─── Multi-Agent Nodes Definition ───────────────────────── */
const MULTI_AGENT_NODES = [
  {
    id: 'nlp',
    name: 'Agent 1: NLP Semantic Parser',
    role: 'Language & Emotion Engine',
    desc: 'Deconstructs vocabulary, sentiment tone, readability metrics, and sentence urgency to ensure optimal audience resonance.',
    icon: LuBrainCircuit,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    badge: 'Semantic NLP',
    metric: '99.2% Accuracy',
  },
  {
    id: 'vision',
    name: 'Agent 2: Visual & Hook Radar',
    role: 'Aesthetic & Thumbnail Scoring',
    desc: 'Analyzes visual composition, contrast balance, headline friction, and stop-the-scroll psychological triggers.',
    icon: LuTarget,
    color: 'text-accent-purple',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    badge: 'Computer Vision',
    metric: '9.7/10 Hook Score',
  },
  {
    id: 'algorithm',
    name: 'Agent 3: Platform Algorithm Sync',
    role: 'Feed Ranking Intelligence',
    desc: 'Calibrates posting timing, hashtag synergy clusters, and platform-specific algorithmic ranking factors in real-time.',
    icon: LuNetwork,
    color: 'text-accent-blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'Algorithmic Sync',
    metric: '4 Platform Models',
  },
  {
    id: 'prediction',
    name: 'Agent 4: Virality Predictor Engine',
    role: 'Engagement & Reach Forecasting',
    desc: 'Forecasts estimated impressions, likes, comment velocity, and share ratios using gradient boosted predictive models.',
    icon: LuTrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'Predictive ML',
    metric: '94.8% Precision',
  },
]

/* ─── Platform Coverage Data ─────────────────────────────── */
const PLATFORM_GRID = [
  {
    name: 'Instagram',
    icon: FaInstagram,
    color: '#E1306C',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    features: ['Carousel & Reel retention scoring', 'Visual aesthetic & color warmth check', 'Hashtag tiering (High/Mid/Niche)'],
    peakWindow: '7:00 PM – 9:00 PM',
    predictedBoost: '+42% Reach',
  },
  {
    name: 'LinkedIn',
    icon: FaLinkedinIn,
    color: '#0077B5',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    features: ['First-line hook dwell-time analysis', 'B2B thought leadership tone tuning', 'Document carousel formatting'],
    peakWindow: '8:00 AM – 10:30 AM',
    predictedBoost: '+3.8x Reposts',
  },
  {
    name: 'X / Twitter',
    icon: FaXTwitter,
    color: '#0F1419',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    features: ['Thread breakdown structuring', 'Viral quotation & question hooks', 'Fast algorithmic velocity signals'],
    peakWindow: '12:00 PM – 2:00 PM',
    predictedBoost: '+55% Replies',
  },
  {
    name: 'TikTok',
    icon: FaTiktok,
    color: '#000000',
    bg: 'bg-zinc-50',
    border: 'border-zinc-200',
    features: ['3-second hook retention radar', 'Save-for-later CTA optimization', 'Audio & sound synchronization tips'],
    peakWindow: '6:30 PM – 9:30 PM',
    predictedBoost: '+68% Watch-time',
  },
]

/* ─── Animated Counter Component ─────────────────────────── */
function AnimatedCounter({ value, suffix = '', prefix = '', duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const num = typeof value === 'number' ? value : parseFloat(value) || 0
    const ctrl = animate(0, num, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v % 1 === 0 ? Math.round(v) : parseFloat(v.toFixed(1))),
    })
    return () => ctrl.stop()
  }, [inView, value, duration])

  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>
}

/* ─── Dynamic Circular Score Ring ────────────────────────── */
function DynamicScoreRing({ score = 92, size = 120, stroke = 8, label = 'Content Score' }) {
  const [display, setDisplay] = useState(0)
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const targetOffset = circ * (1 - score / 100)

  useEffect(() => {
    const ctrl = animate(0, score, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => ctrl.stop()
  }, [score])

  return (
    <div className="relative flex items-center justify-center mx-auto" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={targetOffset}
          className="lp-ring-stroke"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#635BFF" />
            <stop offset="60%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10 relative">
        <p className="text-2xl font-black font-display text-ink-900 leading-none">{display}%</p>
        <p className="text-[10px] text-ink-400 font-bold mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )
}

/* ─── Interactive Hero Simulator Card ────────────────────── */
function InteractiveHeroSimulator() {
  const [activePreset, setActivePreset] = useState(HERO_PRESETS[0])
  const [copied, setCopied] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSelectPreset = (preset) => {
    if (preset.id === activePreset.id) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setActivePreset(preset)
      setIsAnalyzing(false)
    }, 320)
  }

  const handleCopyTags = () => {
    navigator.clipboard?.writeText(activePreset.tags.join(' '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative w-full max-w-[500px] mx-auto">
      {/* Floating Interactive Badges around Hero Card */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -left-5 z-20 hidden sm:flex items-center gap-2.5 bg-white border border-slate-200/90 shadow-[0_12px_24px_rgba(99,91,255,0.12)] px-3.5 py-2 rounded-2xl"
      >
        <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <LuFlame className="text-amber-500 text-sm" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">Hook Rating</p>
          <p className="text-xs font-black text-ink-900">{activePreset.hookStrength}</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-5 -right-5 z-20 hidden sm:flex items-center gap-2.5 bg-white border border-slate-200/90 shadow-[0_12px_24px_rgba(139,92,246,0.12)] px-3.5 py-2 rounded-2xl"
      >
        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <LuClock className="text-emerald-600 text-sm" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">Peak Time</p>
          <p className="text-xs font-black text-ink-900">{activePreset.bestTime}</p>
        </div>
      </motion.div>

      {/* Main Glass Dashboard Card */}
      <div className="lp-dashboard-card overflow-hidden">
        {/* Browser Topbar */}
        <div className="lp-db-topbar">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="lp-db-url">
            <HiSparkles className="text-primary-500 text-xs" />
            <span>socialopti.ai/live-simulator</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 lp-live-dot" />
            Live AI
          </div>
        </div>

        {/* Preset Switcher Tabs */}
        <div className="p-3.5 bg-slate-50/70 border-b border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">Sample Drafts:</span>
            <span className="text-[11px] text-primary-600 font-bold">{activePreset.platform}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {HERO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all truncate ${
                  activePreset.id === preset.id
                    ? 'bg-white text-primary-600 shadow-sm border border-primary-200'
                    : 'text-ink-500 hover:bg-white/60 hover:text-ink-800'
                }`}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Card Body */}
        <div className="p-5 space-y-3.5">
          {/* Post Snippet Box */}
          <div className="rounded-2xl border border-slate-200/90 p-3.5 bg-white shadow-2xs relative">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center flex-shrink-0 shadow-sm">
                <LuImagePlus className="text-white text-base" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-ink-900 truncate">SocialOpti Content Studio</span>
                  <span className="text-[10px] bg-primary-50 text-primary-600 font-bold px-2 py-0.5 rounded-full border border-primary-100">
                    {activePreset.platform}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activePreset.id}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-ink-600 leading-relaxed font-normal mb-1.5"
                  >
                    "{activePreset.caption}"
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Score comparison pill */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-ink-400 font-medium">Raw Draft:</span>
                <span className="font-bold text-ink-500">{activePreset.originalScore}/100</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-primary-600 font-bold">AI Optimized:</span>
                <span className="font-extrabold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200">
                  {activePreset.optimizedScore}/100 ⚡
                </span>
              </div>
            </div>
          </div>

          {/* 4 Predicted Metric Badges */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Reach', value: activePreset.predicted.reach, icon: LuEye, color: 'text-primary-600', bg: 'bg-primary-50' },
              { label: 'Likes', value: activePreset.predicted.likes, icon: LuHeart, color: 'text-rose-500', bg: 'bg-rose-50' },
              { label: 'Comments', value: activePreset.predicted.comments, icon: LuMessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Shares', value: activePreset.predicted.shares, icon: LuShare2, color: 'text-violet-500', bg: 'bg-violet-50' },
            ].map((m) => (
              <div key={m.label} className={`${m.bg} rounded-xl p-2 text-center border border-white`}>
                <m.icon className={`text-xs mx-auto mb-1 ${m.color}`} />
                <p className="text-xs font-black font-display text-ink-900 leading-tight">{m.value}</p>
                <p className="text-[9px] text-ink-400 font-semibold">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Hashtag Cloud */}
          <div className="bg-slate-50/60 border border-slate-200/80 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider flex items-center gap-1">
                <LuSparkles className="text-primary-500" /> Optimal Hashtags
              </span>
              <button
                onClick={handleCopyTags}
                className="text-[10px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                {copied ? <LuCheckCheck className="text-emerald-500" /> : <LuCopy />}
                {copied ? 'Copied' : 'Copy All'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activePreset.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-white text-primary-700 border border-primary-200/70 px-2 py-0.5 rounded-md font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Dynamic AI Agent Feedback Bar */}
          <div className="flex items-start gap-2.5 bg-violet-50/80 border border-violet-100 rounded-xl p-2.5 text-left">
            <div className="w-5 h-5 rounded-lg bg-violet-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <LuBrainCircuit className="text-xs" />
            </div>
            <p className="text-[11px] text-violet-900 font-medium leading-relaxed">
              {activePreset.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Interactive Live Playground Component ──────────────── */
const PROMPT_SUGGESTIONS = [
  'Launching our new eco-friendly hydration bottle this Friday',
  '3 productivity hacks that saved me 20 hours a week as a developer',
  'Behind the scenes look at how we designed our new AI interface',
  'Why most startups fail at customer retention in month one',
]

function InteractivePlayground() {
  const [caption, setCaption] = useState(PROMPT_SUGGESTIONS[0])
  const [platform, setPlatform] = useState('Instagram')
  const [tone, setTone] = useState('Viral & Punchy')
  const [status, setStatus] = useState('idle') // 'idle' | 'analyzing' | 'done'
  const [activeStep, setActiveStep] = useState(0)
  const [copiedResult, setCopiedResult] = useState(false)

  const steps = [
    { title: 'NLP Semantic Parser', desc: 'Evaluating readability, sentiment & tone consistency' },
    { title: 'Visual & Hook Radar', desc: 'Analyzing headline friction & stop-the-scroll appeal' },
    { title: 'Platform Algorithm Sync', desc: `Benchmarking against 100k+ trending ${platform} patterns` },
    { title: 'Virality Predictor Engine', desc: 'Forecasting reach multiplier & comment velocity' },
  ]

  const runSimulation = () => {
    setStatus('analyzing')
    setActiveStep(0)
    let current = 0
    const interval = setInterval(() => {
      current += 1
      if (current < steps.length) {
        setActiveStep(current)
      } else {
        clearInterval(interval)
        setStatus('done')
      }
    }, 600)
  }

  // Dynamic calculated scores based on input length and tone
  const scoreResult = useMemo(() => {
    const base = Math.min(98, 88 + (caption.length % 10))
    return {
      score: base,
      reachBoost: '+48.5%',
      readability: '96/100',
      hookScore: '9.7/10',
      timeSlot: platform === 'LinkedIn' ? '8:30 AM' : platform === 'TikTok' ? '7:15 PM' : '8:00 PM',
      generatedHook: caption.includes('?') ? caption : `🔥 Stop scrolling: ${caption}. Here is what you need to know 👇`,
      tags: ['#Innovation', `#${platform.replace(/\s+/g, '')}`, '#ContentStrategy', '#ViralGrowth', '#TrendingNow'],
    }
  }, [caption, platform, tone])

  return (
    <section id="playground" className="max-w-7xl mx-auto px-6 py-20 relative">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">Interactive Playground</span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900 mt-2 mb-3 tracking-tight">
          Test-Drive The Multi-Agent Optimizer Live
        </h2>
        <p className="text-ink-500 text-sm sm:text-base leading-relaxed">
          Type any draft caption or select a template below to watch our 4 AI agents optimize and score your content in real time.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_16px_40px_rgba(99,91,255,0.06)] p-6 sm:p-8 max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Input & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Prompts */}
          <div>
            <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider block mb-2">
              ⚡ Quick Sample Prompts:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PROMPT_SUGGESTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setCaption(p); if (status === 'done') setStatus('idle'); }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all truncate max-w-full ${
                    caption === p
                      ? 'bg-primary-50 border-primary-300 text-primary-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-ink-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Input Area */}
          <div>
            <label className="text-xs font-bold text-ink-700 block mb-2">
              Your Draft Caption / Hook
            </label>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => { setCaption(e.target.value); if (status === 'done') setStatus('idle'); }}
              placeholder="Type or paste your social media post caption here..."
              className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl p-4 text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all leading-relaxed resize-none"
            />
          </div>

          {/* Selectors: Platform & Tone */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-ink-400 uppercase tracking-wider block mb-1.5">
                Target Platform
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['Instagram', 'LinkedIn', 'X / Twitter', 'TikTok'].map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPlatform(p); if (status === 'done') setStatus('idle'); }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      platform === p
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                        : 'bg-white text-ink-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-400 uppercase tracking-wider block mb-1.5">
                Desired Tone
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['Viral & Punchy', 'B2B Thought Leader', 'Storytelling', 'Action CTA'].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTone(t); if (status === 'done') setStatus('idle'); }}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center truncate ${
                      tone === t
                        ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                        : 'bg-white text-ink-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Run Action Button */}
          <button
            onClick={runSimulation}
            disabled={status === 'analyzing' || !caption.trim()}
            className="w-full btn-primary py-3.5 text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
          >
            {status === 'analyzing' ? (
              <>
                <LuRefreshCw className="animate-spin text-base" />
                Agents Simulating Optimization...
              </>
            ) : (
              <>
                <LuZap className="text-amber-300 text-base group-hover:scale-110 transition-transform" />
                Run Live Multi-Agent Simulation
              </>
            )}
          </button>
        </div>

        {/* Right Column — Real-time Multi-Agent Pipeline & Output (5 cols) */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 min-h-[410px] flex flex-col justify-between">
          {status === 'idle' && (
            <div className="text-center py-10 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <LuBrainCircuit className="text-primary-600 text-2xl" />
              </div>
              <h4 className="font-display font-bold text-ink-900 text-base mb-1">
                Awaiting Content Analysis
              </h4>
              <p className="text-xs text-ink-400 max-w-xs mx-auto mb-4 leading-relaxed">
                Click "Run Live Multi-Agent Simulation" to trigger the multi-agent pipeline and see predicted virality metrics.
              </p>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold text-primary-600 bg-white border border-primary-100 px-3 py-1.5 rounded-full shadow-2xs">
                <span>⚡ 4 Multi-Agent Modules Ready</span>
              </div>
            </div>
          )}

          {status === 'analyzing' && (
            <div className="space-y-3.5 my-auto">
              <div className="text-center mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary-600">
                  Processing Agent Pipeline
                </p>
                <h4 className="font-display font-bold text-ink-900 text-sm mt-0.5">
                  {steps[activeStep].title}
                </h4>
              </div>

              <div className="space-y-2.5">
                {steps.map((st, i) => (
                  <div
                    key={st.title}
                    className={`p-2.5 rounded-xl border transition-all ${
                      i === activeStep
                        ? 'bg-white border-primary-300 shadow-sm'
                        : i < activeStep
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-white/40 border-slate-200/60 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-ink-800">{st.title}</span>
                      {i < activeStep ? (
                        <LuCheck className="text-emerald-600 text-xs font-bold" />
                      ) : i === activeStep ? (
                        <LuRefreshCw className="text-primary-600 text-xs animate-spin" />
                      ) : (
                        <span className="text-[9px] text-ink-400">Queued</span>
                      )}
                    </div>
                    <p className="text-[10px] text-ink-500 leading-tight">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === 'done' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3.5"
            >
              {/* Header result with Score Ring */}
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                <DynamicScoreRing score={scoreResult.score} size={84} stroke={7} label="Score" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {scoreResult.reachBoost} Reach Boost
                  </span>
                  <h4 className="font-display font-bold text-ink-900 text-sm mt-1 mb-0.5 truncate">
                    Optimization Complete!
                  </h4>
                  <p className="text-[10px] text-ink-500">
                    Calibrated for peak {platform} performance.
                  </p>
                </div>
              </div>

              {/* Enhanced Hook Box */}
              <div className="bg-white rounded-xl border border-primary-200 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1">
                    <LuSparkles /> Enhanced Output Hook
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(scoreResult.generatedHook)
                      setCopiedResult(true)
                      setTimeout(() => setCopiedResult(false), 2000)
                    }}
                    className="text-[10px] text-primary-600 font-bold hover:underline flex items-center gap-1"
                  >
                    {copiedResult ? <LuCheckCheck className="text-emerald-500" /> : <LuCopy />}
                    {copiedResult ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-ink-800 leading-relaxed font-medium">
                  "{scoreResult.generatedHook}"
                </p>
              </div>

              {/* Breakdown Metric Tiles */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white rounded-xl p-2 text-center border border-slate-200">
                  <p className="text-xs font-bold text-primary-600">{scoreResult.readability}</p>
                  <p className="text-[9px] text-ink-400 font-semibold mt-0.5">Readability</p>
                </div>
                <div className="bg-white rounded-xl p-2 text-center border border-slate-200">
                  <p className="text-xs font-bold text-violet-600">{scoreResult.hookScore}</p>
                  <p className="text-[9px] text-ink-400 font-semibold mt-0.5">Hook Power</p>
                </div>
                <div className="bg-white rounded-xl p-2 text-center border border-slate-200">
                  <p className="text-xs font-bold text-blue-600">{scoreResult.timeSlot}</p>
                  <p className="text-[9px] text-ink-400 font-semibold mt-0.5">Peak Time</p>
                </div>
              </div>

              {/* Recommended Hashtags */}
              <div className="flex flex-wrap gap-1">
                {scoreResult.tags.map((t) => (
                  <span key={t} className="text-[10px] bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md font-semibold border border-primary-100">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ─── Dedicated AI Multi-Agent Architecture Section ──────── */
function MultiAgentArchitectureSection() {
  const [selectedAgent, setSelectedAgent] = useState(MULTI_AGENT_NODES[0])

  return (
    <section className="py-20 bg-slate-50/60 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-label">System Architecture</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900 mt-2 mb-3 tracking-tight">
            Coordinated Multi-Agent Intelligence
          </h2>
          <p className="text-ink-500 text-sm sm:text-base leading-relaxed">
            Instead of a single generic model, our framework orchestrates 4 specialized autonomous agents working in harmony to score and optimize content.
          </p>
        </div>

        {/* Multi-Agent Architecture Grid & Central Orchestrator */}
        <div className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Agent Node List (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            {MULTI_AGENT_NODES.map((agent) => {
              const isSelected = selectedAgent.id === agent.id
              const Icon = agent.icon
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-white border-primary-400 shadow-md shadow-primary-500/10 translate-x-1'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${agent.bg} ${agent.border} border`}>
                      <Icon className={`text-lg ${agent.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-ink-900 truncate">{agent.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${agent.bg} ${agent.color}`}>
                          {agent.badge}
                        </span>
                      </div>
                      <p className="text-xs text-ink-500 leading-relaxed font-normal">
                        {agent.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Central Orchestrator Visual Showcase (6 cols) */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-7 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center shadow-sm">
                    <LuBot className="text-white text-base" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-ink-900 leading-tight">Master Orchestrator</h4>
                    <p className="text-[10px] text-ink-400">Autonomous Workflow Coordinator</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 lp-live-dot" /> Active Pipeline
                </span>
              </div>

              {/* Dynamic Agent Visualizer Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6 text-center">
                <div className="relative w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary-100 lp-pulse-node" />
                  <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center shadow-md">
                    <selectedAgent.icon className="text-white text-2xl" />
                  </div>
                </div>
                <h3 className="font-display font-extrabold text-ink-900 text-base">
                  {selectedAgent.name}
                </h3>
                <p className="text-xs text-primary-600 font-bold mt-0.5 mb-2">
                  {selectedAgent.role}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-ink-700 shadow-2xs">
                  <LuSparkles className="text-amber-500" /> Benchmark: {selectedAgent.metric}
                </div>
              </div>

              {/* Connected Pipeline Steps */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                  <span className="font-semibold text-ink-600">Inter-Agent Message Bus</span>
                  <span className="font-bold text-emerald-600">Zero-Latency Sync</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100">
                  <span className="font-semibold text-ink-600">Decision Aggregation Layer</span>
                  <span className="font-bold text-primary-600">Bayesian Ensemble</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Interactive Tabbed Features Engine ──────────────────── */
const FEATURE_TABS = [
  {
    id: 'analysis',
    label: 'Content Analysis',
    icon: LuBrainCircuit,
    title: 'Multi-Agent Semantic & Visual Parsing',
    desc: 'Our autonomous agents analyze post copy, visual hierarchy, hashtags and narrative structure against millions of high-performing data points.',
    badge: 'NLP + Computer Vision',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    metrics: [
      { label: 'Readability Score', val: '96/100' },
      { label: 'Sentiment Index', val: '+0.88' },
      { label: 'Hook Retention', val: '94.2%' },
    ],
  },
  {
    id: 'recommendations',
    label: 'Smart Recommendations',
    icon: LuSparkles,
    title: 'Actionable Copy & Hashtag Refinements',
    desc: 'Instant, concrete suggestions to fix weak hooks, add engagement triggers, optimize hashtag clusters, and align with platform algorithms.',
    badge: 'Real-Time Guidance',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    metrics: [
      { label: 'Avg Score Lift', val: '+28.4%' },
      { label: 'Hashtag Synergy', val: '98%' },
      { label: 'Viral Propensity', val: 'High' },
    ],
  },
  {
    id: 'prediction',
    label: 'Engagement Forecast',
    icon: LuTrendingUp,
    title: 'Platform-Specific Reach & Interaction Models',
    desc: 'Predict estimated likes, comments, bookmarks, and algorithmic reach before publishing with over 94.8% accuracy.',
    badge: 'Predictive ML Models',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    metrics: [
      { label: 'Reach Accuracy', val: '94.8%' },
      { label: 'Like Variance', val: '±4.2%' },
      { label: 'Audience Match', val: '91%' },
    ],
  },
  {
    id: 'timing',
    label: 'Optimal Timing Radar',
    icon: LuClock,
    title: 'Dynamic Audience Activity Heatmaps',
    desc: 'Pinpoint precise 30-minute peak windows when your specific niche audience is most responsive and active on each platform.',
    badge: 'Time-Series Intelligence',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    metrics: [
      { label: 'Timing Accuracy', val: '96.2%' },
      { label: 'Engagement Gain', val: '+34%' },
      { label: 'Peak Windows', val: 'Daily' },
    ],
  },
]

function DynamicFeatureShowcase() {
  const [activeTab, setActiveTab] = useState(FEATURE_TABS[0])

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="section-label">Core Capabilities</span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900 mt-2 mb-3 tracking-tight">
          Engineered for Maximum Virality & Engagement
        </h2>
        <p className="text-ink-500 text-sm sm:text-base leading-relaxed">
          Explore the autonomous multi-agent intelligence modules powering SocialOpti.
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {FEATURE_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab.id === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-ink-900 text-white shadow-md shadow-ink-900/10 scale-105'
                  : 'bg-white text-ink-600 border border-slate-200 hover:bg-slate-50 hover:text-ink-900'
              }`}
            >
              <Icon className={isActive ? 'text-primary-400' : 'text-ink-400'} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Active Tab Showcase Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 grid lg:grid-cols-2 gap-8 sm:gap-10 items-center max-w-5xl mx-auto"
        >
          {/* Left Text */}
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <LuZap className="text-xs" />
              {activeTab.badge}
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900 mb-3 leading-snug">
              {activeTab.title}
            </h3>
            <p className="text-ink-500 text-sm sm:text-base leading-relaxed mb-6">
              {activeTab.desc}
            </p>

            <div className="grid grid-cols-3 gap-2.5">
              {activeTab.metrics.map((m) => (
                <div key={m.label} className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                  <p className="text-base sm:text-lg font-black font-display text-ink-900">{m.val}</p>
                  <p className="text-[10px] text-ink-400 font-semibold mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual Simulation */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl ${activeTab.bg} flex items-center justify-center`}>
                  <activeTab.icon className={`text-base ${activeTab.color}`} />
                </div>
                <span className="text-xs font-bold text-ink-800">Live Agent Stream</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                Synchronized
              </span>
            </div>

            <div className="space-y-2">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuBrainCircuit className="text-primary-500 text-sm" />
                  <span className="text-xs font-semibold text-ink-700">Semantic Hook Friction</span>
                </div>
                <span className="text-xs font-bold text-emerald-600">Low (Optimal)</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuTarget className="text-violet-500 text-sm" />
                  <span className="text-xs font-semibold text-ink-700">Niche Audience Match</span>
                </div>
                <span className="text-xs font-bold text-violet-600">98.4% Confidence</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuTrendingUp className="text-blue-500 text-sm" />
                  <span className="text-xs font-semibold text-ink-700">Algorithmic Velocity</span>
                </div>
                <span className="text-xs font-bold text-blue-600">+4.2x Baseline</span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
              <p className="text-[11px] text-ink-500">
                ⚡ Processed across 4 neural decision layers in <span className="font-bold text-ink-800">420ms</span>
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

/* ─── Social Media Platform Coverage Section ─────────────── */
function PlatformCoverageSection() {
  return (
    <section className="py-20 bg-white border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">Platform Intelligence</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900 mt-2 mb-3 tracking-tight">
            Tailored Algorithms for Every Channel
          </h2>
          <p className="text-ink-500 text-sm sm:text-base leading-relaxed">
            Each social network ranks content differently. SocialOpti calibrates your posts to platform-specific algorithmic factors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PLATFORM_GRID.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.name}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${p.bg} ${p.border} border`}
                    >
                      <Icon style={{ color: p.color }} className="text-lg" />
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                      {p.predictedBoost}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-ink-900 text-lg mb-3">
                    {p.name}
                  </h3>

                  <ul className="space-y-2 text-xs text-ink-600 mb-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <LuCheck className="text-primary-500 text-xs mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-ink-400 font-medium">Optimal Window:</span>
                  <span className="font-bold text-ink-800">{p.peakWindow}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Interactive Recharts Analytics Visualizer ──────────── */
const CHART_DATA = {
  All: [
    { day: 'Day 1', reach: 12000, optimized: 18500 },
    { day: 'Day 5', reach: 14500, optimized: 26000 },
    { day: 'Day 10', reach: 16000, optimized: 34000 },
    { day: 'Day 15', reach: 18500, optimized: 45000 },
    { day: 'Day 20', reach: 21000, optimized: 58000 },
    { day: 'Day 25', reach: 23500, optimized: 72000 },
    { day: 'Day 30', reach: 26000, optimized: 91000 },
  ],
  Instagram: [
    { day: 'Day 1', reach: 8000, optimized: 14000 },
    { day: 'Day 5', reach: 11000, optimized: 21000 },
    { day: 'Day 10', reach: 13500, optimized: 31000 },
    { day: 'Day 15', reach: 16000, optimized: 44000 },
    { day: 'Day 20', reach: 19000, optimized: 59000 },
    { day: 'Day 25', reach: 21000, optimized: 76000 },
    { day: 'Day 30', reach: 24000, optimized: 98000 },
  ],
  LinkedIn: [
    { day: 'Day 1', reach: 4000, optimized: 7500 },
    { day: 'Day 5', reach: 6500, optimized: 14000 },
    { day: 'Day 10', reach: 8000, optimized: 22000 },
    { day: 'Day 15', reach: 11000, optimized: 31000 },
    { day: 'Day 20', reach: 14000, optimized: 42000 },
    { day: 'Day 25', reach: 16500, optimized: 54000 },
    { day: 'Day 30', reach: 19000, optimized: 68000 },
  ],
  TikTok: [
    { day: 'Day 1', reach: 15000, optimized: 24000 },
    { day: 'Day 5', reach: 19000, optimized: 38000 },
    { day: 'Day 10', reach: 22000, optimized: 54000 },
    { day: 'Day 15', reach: 26000, optimized: 78000 },
    { day: 'Day 20', reach: 31000, optimized: 104000 },
    { day: 'Day 25', reach: 36000, optimized: 138000 },
    { day: 'Day 30', reach: 42000, optimized: 182000 },
  ],
}

function DynamicAnalyticsSection() {
  const [platform, setPlatform] = useState('All')
  const data = CHART_DATA[platform] || CHART_DATA.All

  return (
    <section id="analytics" className="bg-slate-50/50 py-20 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="section-label">Data-Driven Proof</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900 mt-2 mb-3 tracking-tight">
            Predictable Growth Across Every Channel
          </h2>
          <p className="text-ink-500 text-sm sm:text-base leading-relaxed">
            Compare standard baseline post reach with SocialOpti multi-agent optimized trajectory over 30 days.
          </p>
        </div>

        {/* Platform Switcher */}
        <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
          {['All', 'Instagram', 'LinkedIn', 'TikTok'].map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                platform === p
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                  : 'bg-white text-ink-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Interactive Chart Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">30-Day Trajectory</p>
              <h3 className="font-display font-extrabold text-ink-900 text-xl">
                Impression Velocity ({platform})
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="text-ink-500">Unoptimized Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary-600" />
                <span className="text-primary-600 font-bold">SocialOpti Multi-Agent</span>
              </div>
            </div>
          </div>

          <div className="h-[280px] sm:h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BFF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.2)',
                  }}
                />
                <Area type="monotone" dataKey="optimized" stroke="#635BFF" strokeWidth={3} fillOpacity={1} fill="url(#colorOpt)" />
                <Area type="monotone" dataKey="reach" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorBase)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Interactive ROI & Growth Calculator ────────────────── */
function DynamicGrowthCalculator() {
  const [postsPerWeek, setPostsPerWeek] = useState(4)
  const [followers, setFollowers] = useState(15000)

  const monthlyExtraReach = Math.round(postsPerWeek * 4 * (followers * 0.42))
  const monthlyExtraEngagements = Math.round(monthlyExtraReach * 0.078)
  const hoursSaved = (postsPerWeek * 4 * 1.2).toFixed(1)

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Sliders */}
          <div>
            <span className="text-xs font-bold tracking-widest text-primary-600 uppercase block mb-2">
              ⚡ ROI & Impact Estimator
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-ink-900 mb-3 tracking-tight">
              Calculate Your Content Growth Potential
            </h2>
            <p className="text-ink-500 text-sm mb-6 leading-relaxed">
              Adjust your monthly publishing cadence and audience size to see estimated algorithmic lift powered by multi-agent optimization.
            </p>

            <div className="space-y-6">
              {/* Slider 1: Posts per week */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-ink-700">Posts Published Per Week</label>
                  <span className="text-xs font-extrabold text-primary-700 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full">
                    {postsPerWeek} posts/wk
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={postsPerWeek}
                  onChange={(e) => setPostsPerWeek(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Slider 2: Follower base */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-ink-700">Average Audience Reach</label>
                  <span className="text-xs font-extrabold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                    {followers.toLocaleString()} users
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={followers}
                  onChange={(e) => setFollowers(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Right Computed Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
              <p className="text-xs font-bold text-ink-500 mb-1">Est. Extra Monthly Reach</p>
              <p className="text-2xl sm:text-3xl font-black font-display text-emerald-600">
                +{monthlyExtraReach.toLocaleString()}
              </p>
              <p className="text-[11px] text-ink-400 mt-1">Impressions gained</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
              <p className="text-xs font-bold text-ink-500 mb-1">Extra Engagements</p>
              <p className="text-2xl sm:text-3xl font-black font-display text-primary-600">
                +{monthlyExtraEngagements.toLocaleString()}
              </p>
              <p className="text-[11px] text-ink-400 mt-1">Likes, comments & shares</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
              <p className="text-xs font-bold text-ink-500 mb-1">Strategy Time Saved</p>
              <p className="text-2xl sm:text-3xl font-black font-display text-amber-500">
                ~{hoursSaved} hrs
              </p>
              <p className="text-[11px] text-ink-400 mt-1">Per month in manual review</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
              <p className="text-xs font-bold text-ink-500 mb-1">Engagement Jump</p>
              <p className="text-2xl sm:text-3xl font-black font-display text-violet-600">
                +3.8x
              </p>
              <p className="text-[11px] text-ink-400 mt-1">Average benchmark multiplier</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Interactive FAQ Accordion Component ─────────────────── */
const FAQ_ITEMS = [
  {
    q: 'How does the Multi-Agent Framework work?',
    a: 'SocialOpti utilizes specialized autonomous AI agents. Agent 1 analyzes text semantics and readability; Agent 2 scores visual aesthetics and hook strength; Agent 3 checks platform algorithm synergy; and Agent 4 predicts expected likes, comments, and reach.',
  },
  {
    q: 'Which social media platforms are supported?',
    a: 'SocialOpti currently supports Instagram, LinkedIn, X (Twitter), and TikTok, each with custom algorithmic prediction models tailored to platform-specific ranking parameters.',
  },
  {
    q: 'How accurate is the engagement prediction model?',
    a: 'Our engagement forecasting engine achieves a 94.8% accuracy rate on predicted virality bands, trained on over 2.5 million verified creator data points.',
  },
  {
    q: 'Can I test my content before signing up?',
    a: 'Yes! You can use our Interactive Playground right on this landing page to run real-time simulations and see instant score breakdowns without registration.',
  },
]

function DynamicFAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <span className="section-label">Frequently Asked Questions</span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900 mt-2 mb-3 tracking-tight">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={item.q}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="font-display font-bold text-ink-900 text-sm sm:text-base">
                  {item.q}
                </span>
                <LuChevronDown
                  className={`text-ink-400 text-lg transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-primary-600' : ''
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-ink-500 leading-relaxed border-t border-slate-100">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ─── Main Landing Component ─────────────────────────────── */
export default function Landing() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsub = scrollY.on('change', (y) => setScrolled(y > 20))
    return () => unsub()
  }, [scrollY])

  return (
    <div className="lp-bg-canvas text-ink-800 overflow-x-hidden font-sans min-h-screen">
      {/* ═══════════════════════════════════════════════════════
          TOP ANNOUNCEMENT RIBBON
          ═══════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-primary-600 via-violet-600 to-blue-600 text-white text-xs font-semibold py-2 px-4 text-center select-none flex items-center justify-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 lp-live-dot" />
        <span>⚡ Multi-Agent Intelligence v2.4 Live · 14,800+ Posts Optimized Today</span>
        <a href="#playground" className="hidden sm:inline-flex items-center gap-1 underline font-bold hover:text-white/90 ml-2">
          Test Playground Live →
        </a>
      </div>

      {/* ═══════════════════════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.04)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <HiSparkles className="text-white text-lg" />
            </div>
            <div>
              <span className="font-display font-extrabold text-ink-900 text-lg tracking-tight block leading-none">
                SocialOpti
              </span>
              <span className="text-[9px] font-bold text-primary-600 uppercase tracking-widest block mt-0.5">
                AI Multi-Agent
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-ink-600">
            <a href="#playground" className="lp-nav-link hover:text-ink-900 transition-colors">
              Playground
            </a>
            <a href="#features" className="lp-nav-link hover:text-ink-900 transition-colors">
              Features
            </a>
            <a href="#workflow" className="lp-nav-link hover:text-ink-900 transition-colors">
              Workflow
            </a>
            <a href="#analytics" className="lp-nav-link hover:text-ink-900 transition-colors">
              Analytics
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-bold text-ink-700 hover:text-ink-900 px-4 py-2 rounded-xl hover:bg-slate-100/80 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm py-2.5 px-5 shadow-md hover:shadow-lg font-bold"
            >
              Get Started Free <LuArrowRight />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-ink-700"
          >
            {mobileMenuOpen ? <LuX className="text-xl" /> : <LuMenu className="text-xl" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 shadow-xl"
            >
              <nav className="flex flex-col gap-3 font-bold text-ink-700 text-sm">
                <a onClick={() => setMobileMenuOpen(false)} href="#playground" className="py-1">Playground</a>
                <a onClick={() => setMobileMenuOpen(false)} href="#features" className="py-1">Features</a>
                <a onClick={() => setMobileMenuOpen(false)} href="#workflow" className="py-1">Workflow</a>
                <a onClick={() => setMobileMenuOpen(false)} href="#analytics" className="py-1">Analytics</a>
              </nav>
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link to="/login" className="btn-secondary text-sm text-center py-2.5">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm text-center py-2.5">Get Started Free</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden lp-hero-glow lp-grid-pattern pt-6 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 xl:gap-16 items-center w-full relative z-10">
          {/* Left Column — Text & CTAs (6 cols) */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 xl:col-span-6 space-y-6"
          >
            {/* Pulsing Pill Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-wider text-primary-700 uppercase bg-primary-50 border border-primary-200 px-4 py-1.5 rounded-full shadow-2xs">
                <HiSparkles className="text-primary-600 text-sm animate-pulse" />
                Intelligent Multi-Agent Framework
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-display font-black text-4xl sm:text-5xl xl:text-[56px] leading-[1.1] text-ink-900 tracking-tight"
            >
              Create Better Content.{' '}
              <span className="lp-gradient-text">
                Predict Viral Engagement.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="text-ink-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
            >
              Harness autonomous multi-agent AI to analyze captions, optimize visual hooks, calibrate posting times, and forecast reach <span className="font-semibold text-ink-800">before</span> you publish.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/register"
                className="btn-primary py-3.5 px-7 text-sm sm:text-base font-bold shadow-md hover:shadow-lg group"
              >
                Start Optimizing Free <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#playground"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-ink-700 bg-white border border-slate-200 px-6 py-3.5 rounded-2xl hover:bg-slate-50 transition-all shadow-2xs"
              >
                <LuZap className="text-primary-600" />
                Test Live Playground
              </a>
            </motion.div>

            {/* Trust / Stats Strip */}
            <motion.div variants={fadeUp} className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-sm">
              <div>
                <p className="text-2xl font-black font-display text-ink-900 leading-none">
                  <AnimatedCounter value={94.8} suffix="%" />
                </p>
                <p className="text-xs text-ink-400 font-semibold mt-1">Accuracy Score</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black font-display text-primary-600 leading-none">
                  <AnimatedCounter value={4.2} suffix="x" />
                </p>
                <p className="text-xs text-ink-400 font-semibold mt-1">Avg Reach Boost</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-black font-display text-violet-600 leading-none">
                  <AnimatedCounter value={250} suffix="K+" />
                </p>
                <p className="text-xs text-ink-400 font-semibold mt-1">Posts Analyzed</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column — Interactive Simulator (6 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-6 flex justify-center"
          >
            <InteractiveHeroSimulator />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INFINITE LIVE ACTIVITY MARQUEE TICKER (Light Theme)
          ═══════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-slate-200/80 py-3.5 overflow-hidden select-none shadow-2xs lp-marquee-mask">
        <div className="lp-marquee-track flex items-center gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
              <span className="text-sm">{item.icon}</span>
              <span className="font-bold text-primary-600">{item.user}</span>
              <span className="text-ink-600">{item.action}</span>
              <span className="text-[10px] bg-slate-100 text-ink-500 font-bold px-2 py-0.5 rounded-full border border-slate-200/60">
                {item.platform}
              </span>
              <span className="text-slate-300 ml-4">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INTERACTIVE PLAYGROUND SECTION
          ═══════════════════════════════════════════════════════ */}
      <InteractivePlayground />

      {/* ═══════════════════════════════════════════════════════
          DEDICATED AI MULTI-AGENT ARCHITECTURE SECTION
          ═══════════════════════════════════════════════════════ */}
      <MultiAgentArchitectureSection />

      {/* ═══════════════════════════════════════════════════════
          INTERACTIVE WORKFLOW PIPELINE SIMULATOR
          ═══════════════════════════════════════════════════════ */}
      <section id="workflow" className="bg-slate-50/70 py-20 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-label">Full Architecture Walkthrough</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900 mt-2 mb-3 tracking-tight">
              From Raw Draft to Optimized Viral Post
            </h2>
            <p className="text-ink-500 text-sm sm:text-base leading-relaxed">
              Watch our 5-stage pipeline synthesize linguistic parsing, visual cues, and platform algorithms.
            </p>
          </div>

          {/* Embedded Dynamic Interactive Workflow Component */}
          <WorkflowDemo />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          DYNAMIC FEATURE MATRIX
          ═══════════════════════════════════════════════════════ */}
      <DynamicFeatureShowcase />

      {/* ═══════════════════════════════════════════════════════
          SOCIAL MEDIA PLATFORM INTELLIGENCE
          ═══════════════════════════════════════════════════════ */}
      <PlatformCoverageSection />

      {/* ═══════════════════════════════════════════════════════
          INTERACTIVE RECHARTS ANALYTICS SECTION
          ═══════════════════════════════════════════════════════ */}
      <DynamicAnalyticsSection />

      {/* ═══════════════════════════════════════════════════════
          DYNAMIC ROI & GROWTH CALCULATOR
          ═══════════════════════════════════════════════════════ */}
      <DynamicGrowthCalculator />

      {/* ═══════════════════════════════════════════════════════
          DYNAMIC FAQ SECTION
          ═══════════════════════════════════════════════════════ */}
      <DynamicFAQSection />

      {/* ═══════════════════════════════════════════════════════
          HIGH-CONVERTING GLOWING CTA
          ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOpts}
          transition={{ duration: 0.55 }}
          className="relative bg-gradient-to-br from-primary-600 via-violet-600 to-indigo-700 rounded-3xl px-8 py-16 text-center overflow-hidden shadow-2xl text-white"
        >
          {/* Subtle Ambient Shapes */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-md">
              <HiSparkles /> Free Instant Access
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Ready to Optimize Your Next Post?
            </h2>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-lg mx-auto font-normal">
              Join thousands of creators and growth marketers using multi-agent AI to achieve predictable engagement.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/register"
                className="lp-shimmer-btn inline-flex items-center gap-2 bg-white text-primary-700 font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-xl hover:bg-white/95 transition-all hover:scale-105 active:scale-95"
              >
                Get Started Free <LuArrowRight />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl backdrop-blur-md transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center shadow-sm">
                <HiSparkles className="text-white text-sm" />
              </div>
              <span className="font-display font-extrabold text-ink-900 text-base tracking-tight">SocialOpti</span>
            </div>
            <p className="text-xs text-ink-400 leading-relaxed max-w-[220px]">
              Autonomous Multi-Agent Framework for Social Media Optimization & Virality Prediction.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs font-semibold text-ink-500">
              <li><a href="#playground" className="hover:text-primary-600 transition-colors">Playground</a></li>
              <li><a href="#features" className="hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#workflow" className="hover:text-primary-600 transition-colors">Workflow</a></li>
              <li><a href="#analytics" className="hover:text-primary-600 transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Modules */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-4">AI Framework</h4>
            <ul className="space-y-2 text-xs font-semibold text-ink-500">
              <li><Link to="/analysis" className="hover:text-primary-600 transition-colors">Semantic NLP Agent</Link></li>
              <li><Link to="/recommendations" className="hover:text-primary-600 transition-colors">Smart Recommendations</Link></li>
              <li><Link to="/engagement-prediction" className="hover:text-primary-600 transition-colors">Virality Predictor</Link></li>
              <li><Link to="/calendar" className="hover:text-primary-600 transition-colors">Timing Heatmaps</Link></li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-ink-400 mb-4">Engineering</h4>
            <ul className="space-y-2 text-xs font-semibold text-ink-500">
              <li><span className="text-ink-600">Final Year Project</span></li>
              <li><span className="text-emerald-600 font-bold">● IEEE Standard System</span></li>
              <li>
                <Link to="/register" className="text-primary-600 font-bold hover:underline">
                  Launch App →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-100 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-400">
            <p>Intelligent Multi-Agent Social Media Content Optimization & Engagement Prediction System</p>
            <p>© 2026 SocialOpti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
