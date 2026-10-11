import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuUpload, LuCheck, LuHash, LuMessageSquare,
  LuImage, LuSparkles, LuTarget, LuZap, LuArrowRight,
  LuTrendingUp, LuRotateCcw
} from 'react-icons/lu'

/* ─── Constants ─────────────────────────────────────────── */
const STEP_DURATIONS = [3000, 4000, 4000, 4000, 3500]
const STEP_LABELS    = ['Upload', 'Processing', 'Recommendations', 'Prediction', 'Result']
const STEP_TITLES    = [
  'Post Upload',
  'Content Processing',
  'AI Recommendations',
  'Engagement Prediction',
  'Final Result',
]

const variants = {
  enter:  { opacity: 0, y: 16,  scale: 0.98 },
  center: { opacity: 1, y: 0,   scale: 1    },
  exit:   { opacity: 0, y: -12, scale: 0.98 },
}

/* ══════════════════════════════════════════════════════════
   STEP 1 — Post Upload
══════════════════════════════════════════════════════════ */
function StepUpload() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const dur   = 2400
    const id    = setInterval(() => {
      const p = Math.min(100, Math.round(((Date.now() - start) / dur) * 100))
      setProgress(p)
      if (p >= 100) clearInterval(id)
    }, 20)
    return () => clearInterval(id)
  }, [])

  const done = progress >= 100

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      {/* Mock social media post */}
      <motion.div
        className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
        animate={done ? { scale: 0.98, opacity: 0.85 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Post header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center flex-shrink-0 shadow-sm">
            <LuSparkles className="text-white text-xs" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-ink-900 leading-tight">TechBrand Co.</p>
            <p className="text-[10px] text-ink-400">@techbrand · just now</p>
          </div>
          <span className="text-[10px] bg-primary-50 text-primary-600 font-bold px-2 py-0.5 rounded-full border border-primary-100/60">
            Instagram
          </span>
        </div>

        {/* Image thumbnail */}
        <div
          className="h-28 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-50/70 via-indigo-50/50 to-blue-50/60"
        >
          <div className="relative z-10 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm border border-primary-200/60 flex items-center justify-center mx-auto mb-1.5 shadow-sm">
              <LuImage className="text-primary-500 text-lg" />
            </div>
            <p className="text-[11px] text-primary-600 font-bold">product-launch.jpg</p>
          </div>
        </div>

        {/* Caption */}
        <div className="p-4">
          <p className="text-xs font-bold text-ink-900 mb-1">New Product Launch 🚀</p>
          <p className="text-[11px] text-ink-500 leading-relaxed font-normal">
            Introducing our latest product — smarter, faster and built for you. Experience innovation today!
          </p>
          <div className="flex gap-4 mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-ink-400 font-medium">
            <span className="flex items-center gap-1">❤️ 240</span>
            <span className="flex items-center gap-1">💬 48</span>
            <span className="flex items-center gap-1">↗ 32</span>
          </div>
        </div>
      </motion.div>

      {/* Upload progress */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors duration-300 shadow-sm"
              style={{ background: done ? '#10B981' : '#635BFF' }}
            >
              {done
                ? <LuCheck className="text-white text-xs font-bold" />
                : <LuUpload className="text-white text-xs" />
              }
            </div>
            <span className="text-xs font-bold text-ink-800">
              {done ? 'Upload complete!' : 'Uploading content...'}
            </span>
          </div>
          <span className="text-xs font-extrabold text-primary-600 font-display">{progress}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #635BFF, #8B5CF6)',
              transition: 'width 0.06s linear',
            }}
          />
        </div>

        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-emerald-600 font-bold mt-2.5 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100"
            >
              <LuCheck className="flex-shrink-0 text-xs" /> Content ready for AI analysis
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STEP 2 — Content Processing
══════════════════════════════════════════════════════════ */
const AGENTS = [
  { icon: LuMessageSquare, label: 'Content Analysis',   color: '#635BFF', bg: 'bg-primary-50', border: 'border-primary-100' },
  { icon: LuImage,         label: 'Visual Analysis',    color: '#8B5CF6', bg: 'bg-violet-50', border: 'border-violet-100' },
  { icon: LuTrendingUp,    label: 'Trend Analysis',     color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-100' },
  { icon: LuTarget,        label: 'Engagement Analysis',color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-100' },
]

function StepProcessing() {
  const [active, setActive] = useState([])

  useEffect(() => {
    const timers = AGENTS.map((_, i) =>
      setTimeout(() => setActive(prev => [...prev, i]), 300 + i * 780)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  const allDone = active.length === AGENTS.length

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <motion.div
        className="text-xs font-bold text-center px-3.5 py-1.5 rounded-full border"
        animate={{
          backgroundColor: allDone ? '#ECFDF5' : '#F0F1FF',
          borderColor: allDone ? '#A7F3D0' : '#CBCDFF',
          color: allDone ? '#059669' : '#635BFF',
        }}
        transition={{ duration: 0.3 }}
      >
        {allDone ? '✓ Analysis complete!' : '🔍 Analyzing content with AI agents...'}
      </motion.div>

      {/* Central post chip */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center flex-shrink-0 shadow-sm">
            <LuImage className="text-white text-xs" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink-900 leading-tight">New Product Launch 🚀</p>
            <p className="text-[10px] text-ink-400">product-launch.jpg · Instagram</p>
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-primary-500 lp-live-dot flex-shrink-0" />
      </motion.div>

      {/* Agent grid */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {AGENTS.map((agent, i) => {
          const isActive = active.includes(i)
          return (
            <motion.div
              key={agent.label}
              animate={
                isActive
                  ? { opacity: 1, scale: 1, borderColor: '#A7F3D0' }
                  : { opacity: 0.6, scale: 0.98, borderColor: '#E2E8F0' }
              }
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border p-3 bg-white transition-all shadow-sm ${
                isActive ? 'border-emerald-200' : 'border-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${agent.bg}`}
                >
                  <agent.icon
                    className="text-sm"
                    style={{ color: isActive ? agent.color : '#94A3B8' }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-ink-800 truncate">{agent.label}</p>
                  <p
                    className="text-[10px] font-semibold transition-colors duration-200 mt-0.5"
                    style={{ color: isActive ? '#059669' : '#94A3B8' }}
                  >
                    {isActive ? '✓ Analyzed' : 'Waiting...'}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STEP 3 — Recommendations
══════════════════════════════════════════════════════════ */
const RECS = [
  {
    icon: LuMessageSquare,
    label: 'Recommended Caption',
    value: '"Discover the future of tech. Innovation starts here — shop now!"',
    color: '#635BFF',
    bg: 'bg-primary-50',
  },
  {
    icon: LuHash,
    label: 'Recommended Hashtags',
    value: '#Technology  #Innovation  #ProductLaunch  #Tech',
    color: '#8B5CF6',
    bg: 'bg-violet-50',
  },
  {
    icon: LuZap,
    label: 'Best Posting Time',
    value: 'Today at 8:00 PM · Peak engagement window',
    color: '#3B82F6',
    bg: 'bg-blue-50',
  },
  {
    icon: LuImage,
    label: 'Visual Improvement',
    value: 'Increase brightness & contrast → predicted +18% engagement lift',
    color: '#10B981',
    bg: 'bg-emerald-50',
  },
]

function StepRecommendations() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const timers = RECS.map((_, i) =>
      setTimeout(() => setVisible(i + 1), 300 + i * 820)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex flex-col gap-2.5 w-full max-w-sm mx-auto">
      <div className="text-xs font-bold text-center text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full w-fit mx-auto mb-1">
        {visible < RECS.length
          ? `✨ Generating recommendations... (${visible}/${RECS.length})`
          : '✓ All recommendations ready!'}
      </div>

      {RECS.map((rec, i) =>
        visible > i ? (
          <motion.div
            key={rec.label}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 flex items-start gap-3"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${rec.bg}`}
            >
              <rec.icon style={{ color: rec.color }} className="text-xs" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <LuCheck className="text-emerald-500 text-xs flex-shrink-0" />
                <p className="text-xs font-bold text-ink-800">{rec.label}</p>
              </div>
              <p className="text-[11px] text-ink-500 leading-relaxed font-medium">{rec.value}</p>
            </div>
          </motion.div>
        ) : null
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STEP 4 — Engagement Prediction
══════════════════════════════════════════════════════════ */
const CIRC = 2 * Math.PI * 48   // r = 48
const CHART_D  = 'M 0,54 L 22,46 L 44,35 L 66,24 L 88,16 L 110,10 L 132,5'
const CHART_LEN = 170

const METRICS = [
  { label: 'Reach',    value: '24.8K', color: '#635BFF', bg: 'bg-primary-50' },
  { label: 'Likes',    value: '3.6K',  color: '#8B5CF6', bg: 'bg-violet-50' },
  { label: 'Comments', value: '820',   color: '#3B82F6', bg: 'bg-blue-50' },
  { label: 'Shares',   value: '410',   color: '#10B981', bg: 'bg-emerald-50' },
]

function StepPrediction() {
  const [score,       setScore]       = useState(0)
  const [showMetrics, setShowMetrics] = useState(false)
  const [showChart,   setShowChart]   = useState(false)
  const TARGET = 87

  useEffect(() => {
    const start = Date.now()
    const dur   = 2000
    const id    = setInterval(() => {
      const t     = Math.min(1, (Date.now() - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setScore(Math.round(eased * TARGET))
      if (t >= 1) clearInterval(id)
    }, 16)
    const t1 = setTimeout(() => setShowMetrics(true), 900)
    const t2 = setTimeout(() => setShowChart(true),   1400)
    return () => { clearInterval(id); clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const dashOffset = CIRC * (1 - score / 100)

  return (
    <div className="flex flex-col items-center gap-3.5 w-full max-w-sm mx-auto">
      {/* Gauge + Metrics row */}
      <div className="flex items-center gap-4 w-full bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm">
        {/* Circular gauge */}
        <div className="relative flex-shrink-0 w-24 h-24 flex items-center justify-center">
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="42"
              fill="none"
              stroke="url(#scoreGradWD)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
            <defs>
              <linearGradient id="scoreGradWD" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#635BFF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-display font-extrabold text-2xl text-ink-900 leading-none">{score}</span>
            <span className="text-[9px] text-ink-400 font-bold uppercase tracking-wider mt-0.5">Eng. Score</span>
          </div>
        </div>

        {/* Metrics 2 × 2 */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {METRICS.map((m, i) =>
            showMetrics ? (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.25 }}
                className={`rounded-xl p-2 text-center border border-slate-100 ${m.bg}`}
              >
                <p className="text-[9px] text-ink-400 font-bold uppercase">{m.label}</p>
                <p
                  className="text-xs font-black font-display mt-0.5"
                  style={{ color: m.color }}
                >
                  {m.value}
                </p>
              </motion.div>
            ) : (
              <div key={m.label} className="bg-slate-50 rounded-xl h-11 border border-slate-100" />
            )
          )}
        </div>
      </div>

      {/* Mini line chart */}
      <AnimatePresence>
        {showChart && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3.5"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Predicted engagement trend</p>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                +48.2% Lift
              </span>
            </div>
            <svg
              width="100%" height="56"
              viewBox="0 0 140 60"
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              <defs>
                <linearGradient id="chartFillWD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#635BFF" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#635BFF" stopOpacity="0"    />
                </linearGradient>
              </defs>
              <motion.path
                d={`${CHART_D} L 132,60 L 0,60 Z`}
                fill="url(#chartFillWD)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              />
              <motion.path
                d={CHART_D}
                fill="none"
                stroke="#635BFF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={CHART_LEN}
                initial={{ strokeDashoffset: CHART_LEN }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <motion.circle
                cx="132" cy="5" r="4"
                fill="#635BFF"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.25 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   STEP 5 — Final Result
══════════════════════════════════════════════════════════ */
const SUMMARY = [
  { label: 'Content Score',         value: '92 / 100', color: '#635BFF' },
  { label: 'Engagement Prediction', value: '87%',       color: '#8B5CF6' },
  { label: 'Best Posting Time',     value: '8:00 PM',   color: '#10B981' },
]

function StepResult({ onReplay }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto text-center">
      {/* Animated success ring */}
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.05 }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto bg-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.3)]"
        >
          <LuCheck className="text-white text-xl font-bold" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full bg-emerald-400/30"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1, repeat: 2, ease: 'easeOut', delay: 0.25 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="font-display font-extrabold text-lg text-ink-900 mb-0.5">
          Your content is ready! 🎉
        </h3>
        <p className="text-xs text-ink-500">AI analysis complete. Here's your summary.</p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden text-left"
      >
        <div
          className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70"
        >
          <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest">
            Analysis Summary
          </p>
        </div>
        <div className="p-3.5 flex flex-col gap-2.5">
          {SUMMARY.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <LuCheck className="text-emerald-500 text-xs flex-shrink-0" />
                <span className="font-semibold text-ink-700">{item.label}</span>
              </div>
              <span
                className="font-extrabold font-display"
                style={{ color: item.color }}
              >
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-3 pt-1"
      >
        <button
          onClick={onReplay}
          className="inline-flex items-center gap-1.5 text-xs text-ink-600 hover:text-primary-600 font-bold transition-colors px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70"
        >
          <LuRotateCcw className="text-xs" /> Replay
        </button>
        <Link to="/register" className="btn-primary text-xs py-2 px-4 shadow-sm font-bold">
          Get Started <LuArrowRight />
        </Link>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN — WorkflowDemo
══════════════════════════════════════════════════════════ */
export default function WorkflowDemo() {
  const [step,    setStep]    = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const replay = useCallback(() => {
    setStep(0)
    setAnimKey(k => k + 1)
  }, [])

  /* Auto-advance + auto-restart */
  useEffect(() => {
    let restartId
    const id = setTimeout(() => {
      if (step < 4) {
        setStep(s => s + 1)
      } else {
        restartId = setTimeout(replay, 1800)
      }
    }, STEP_DURATIONS[step])
    return () => { clearTimeout(id); clearTimeout(restartId) }
  }, [step, animKey, replay])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator pills */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => { setStep(i); setAnimKey(k => k + 1); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                i === step
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/25 scale-105'
                  : i < step
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  : 'bg-white text-ink-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {i < step ? <LuCheck className="text-xs" /> : <span className="text-[10px] opacity-70">#{i + 1}</span>}
              {label}
            </button>
            {i < 4 && (
              <div
                className="w-3 h-0.5 rounded-full hidden sm:block"
                style={{ background: i < step ? '#10B981' : '#E2E8F0' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Browser-chrome demo card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_rgba(99,91,255,0.08)] overflow-hidden">
        {/* Browser top-bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="bg-white border border-slate-200/80 rounded-full px-3.5 py-1 flex items-center gap-1.5 text-[11px] text-ink-500 font-semibold shadow-2xs">
            <LuSparkles className="text-primary-500 text-xs flex-shrink-0" />
            socialopti.ai/pipeline-demo
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 lp-live-dot" />
            Auto-Play
          </div>
        </div>

        {/* Step header inside card */}
        <div className="pt-6 px-6 sm:px-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`hdr-${step}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase text-primary-600 mb-0.5">
                Stage {step + 1} of {STEP_LABELS.length}
              </p>
              <p className="font-display font-extrabold text-ink-900 text-lg">
                {STEP_TITLES[step]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Animated step content */}
        <div className="p-6 sm:p-8 pt-4 min-h-[380px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}-${animKey}`}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full"
            >
              {step === 0 && <StepUpload />}
              {step === 1 && <StepProcessing />}
              {step === 2 && <StepRecommendations />}
              {step === 3 && <StepPrediction />}
              {step === 4 && <StepResult onReplay={replay} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom progress strip */}
        <div className="h-1.5 bg-slate-100">
          <motion.div
            key={`bar-${step}-${animKey}`}
            className="h-full bg-gradient-to-r from-primary-600 via-accent-purple to-accent-blue"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: STEP_DURATIONS[step] / 1000, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  )
}
