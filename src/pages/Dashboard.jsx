import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {
  LuPlus, LuClock, LuChevronRight, LuUpload, LuChartBar, LuFileText, LuCalendar,
  LuTrendingUp, LuLightbulb, LuSend, LuUsers, LuTarget, LuRocket,
  LuImage, LuType, LuSparkles
} from 'react-icons/lu'
import { HiSparkles } from 'react-icons/hi2'
import { FaInstagram, FaLinkedin, FaFacebook, FaXTwitter } from 'react-icons/fa6'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import { useAuth } from '../context/AuthContext'
import { useAssistant } from '../context/AssistantContext'
import { api } from '../services/api'

// Dummy datasets aligned with reference image metrics
const engagementOverviewData = [
  { day: 'Mon', engagement: 25, reach: 10 },
  { day: 'Tue', engagement: 42, reach: 20 },
  { day: 'Wed', engagement: 75, reach: 48 },
  { day: 'Thu', engagement: 90, reach: 62 },
  { day: 'Fri', engagement: 70, reach: 45 },
  { day: 'Sat', engagement: 42, reach: 20 },
  { day: 'Sun', engagement: 76, reach: 48 },
]

const platformPerformanceData = [
  { name: 'Instagram', value: 42, color: '#8B5CF6', icon: FaInstagram, iconColor: 'text-[#8B5CF6]' },
  { name: 'LinkedIn', value: 25, color: '#3B82F6', icon: FaLinkedin, iconColor: 'text-[#3B82F6]' },
  { name: 'Facebook', value: 18, color: '#1877F2', icon: FaFacebook, iconColor: 'text-[#1877F2]' },
  { name: 'Twitter (X)', value: 10, color: '#0F172A', icon: FaXTwitter, iconColor: 'text-[#0F172A]' },
  { name: 'Others', value: 5, color: '#94A3B8', icon: LuChartBar, iconColor: 'text-[#94A3B8]' },
]


const recentAnalysesData = [
  {
    id: 1,
    title: 'New Product Launch Post',
    date: 'May 24, 2024',
    platform: 'Instagram',
    platformIcon: FaInstagram,
    platformColor: 'text-[#E4405F]',
    score: 92,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&h=120&fit=crop',
  },
  {
    id: 2,
    title: 'AI Tools Carousel',
    date: 'May 23, 2024',
    platform: 'LinkedIn',
    platformIcon: FaLinkedin,
    platformColor: 'text-[#0A66C2]',
    score: 85,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&h=120&fit=crop',
  },
  {
    id: 3,
    title: 'Motivational Quote',
    date: 'May 22, 2024',
    platform: 'Facebook',
    platformIcon: FaFacebook,
    platformColor: 'text-[#1877F2]',
    score: 78,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&h=120&fit=crop',
  },
]

const contentScoreDistributionData = [
  { name: '90 – 100', value: 35, color: '#10B981' },
  { name: '70 – 89', value: 40, color: '#3B82F6' },
  { name: '50 – 69', value: 15, color: '#F59E0B' },
  { name: 'Below 50', value: 10, color: '#EF4444' },
]

const aiInsightsData = [
  {
    id: 1,
    bg: 'bg-[#F4F1FF]',
    icon: LuTrendingUp,
    iconColor: 'text-[#633DF2]',
    text: 'Your content performs best on Instagram between 7PM – 10PM.',
  },
  {
    id: 2,
    bg: 'bg-[#F0FDF4]',
    icon: LuLightbulb,
    iconColor: 'text-[#10B981]',
    text: 'Using 5-8 hashtags increases engagement by up to 22%.',
  },
  {
    id: 3,
    bg: 'bg-[#FFFBEB]',
    icon: LuChartBar,
    iconColor: 'text-[#F59E0B]',
    text: 'Carousel posts get 30% more engagement than single image posts.',
  },

]

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('This Week')
  const { openAssistant } = useAssistant()
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    async function loadDash() {
      try {
        const data = await api.getDashboardAnalytics()
        if (data) setDashboardData(data)
      } catch (err) {
        console.log('Using local dashboard metrics')
      }
    }
    loadDash()
  }, [])

  const cards = dashboardData?.summaryCards

  return (
    <DashboardLayout title="Dashboard">
      {/* Top Header Greeting + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1E1B39] dark:text-white font-display">
            Welcome back, {user?.name || 'Umar Faruk'}! 👋
          </h1>
          <p className="text-xs text-[#64748B] dark:text-ink-400 mt-0.5 font-medium">
            Here's what's happening with your content today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-[#633DF2] hover:bg-[#522DE0] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <LuPlus className="text-base" /> Upload Content
          </Link>
          <button
            onClick={openAssistant}
            className="flex items-center gap-2 bg-white dark:bg-ink-800 border border-[#E0D7FE] dark:border-ink-700 text-[#633DF2] dark:text-primary-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:bg-[#F4F1FF] transition"
          >
            <HiSparkles className="text-base text-[#633DF2]" /> AI Assistant
          </button>
        </div>
      </div>

      {/* 5 Top Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Analyses" value={cards?.[0]?.value || "128"} delta={cards?.[0]?.delta || "18.2%"} icon={LuChartBar} color="purple" spark={cards?.[0]?.spark || [4, 6, 5, 8, 7, 9, 8, 11, 9, 12]} delay={0.05} />

        <StatCard label="Avg. Content Score" value={cards?.[1]?.value || "87%"} delta={cards?.[1]?.delta || "9.4%"} icon={LuTarget} color="green" spark={cards?.[1]?.spark || [7, 7, 8, 7, 9, 8, 9, 10, 9, 10]} delay={0.1} />
        <StatCard label="Engagement Score" value={cards?.[2]?.value || "76%"} delta={cards?.[2]?.delta || "12.7%"} icon={LuRocket} color="blue" spark={cards?.[2]?.spark || [5, 6, 6, 7, 6, 8, 7, 8, 9, 8]} delay={0.15} />
        <StatCard label="Total Reach" value={cards?.[3]?.value || "245K"} delta={cards?.[3]?.delta || "21.5%"} icon={LuUsers} color="orange" spark={cards?.[3]?.spark || [3, 5, 4, 6, 8, 7, 9, 10, 11, 12]} delay={0.2} />
        <StatCard label="Predicted Posts" value={cards?.[4]?.value || "56"} delta={cards?.[4]?.delta || "15.1%"} icon={LuSend} color="pink" spark={cards?.[4]?.spark || [6, 5, 7, 6, 8, 7, 9, 8, 10, 9]} delay={0.25} />
      </div>

      {/* Middle Row Grid (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Engagement Overview (Col 1: ~ 5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between" delay={0.15}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1E1B39] dark:text-white text-sm font-display">Engagement Overview</h3>
            <div className="relative">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="text-xs font-semibold border border-ink-200 dark:border-ink-600 rounded-xl px-3 py-1.5 text-ink-600 dark:text-ink-300 bg-white dark:bg-ink-800 focus:outline-none cursor-pointer"
              >
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 text-[11px] font-medium text-ink-500 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#633DF2]" /> Engagement Score
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> Reach
            </span>
          </div>

          {/* Line Chart */}
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementOverviewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F8" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis ticks={[0, 25, 50, 75, 100]} domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  name="Engagement Score"
                  stroke="#633DF2"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#633DF2', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="reach"
                  name="Reach"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform Performance (Col 2: ~ 4 cols) */}
        <Card className="lg:col-span-4 flex flex-col justify-between" delay={0.2}>
          <h3 className="font-bold text-[#1E1B39] dark:text-white text-sm font-display mb-2">Platform Performance</h3>

          <div className="flex items-center justify-between gap-4">
            {/* Donut Chart with Center Text */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformPerformanceData}
                    dataKey="value"
                    innerRadius={44}
                    outerRadius={65}
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {platformPerformanceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] font-medium text-ink-400 leading-tight">Total<br />Analyses</span>
                <span className="text-xl font-extrabold text-[#1E1B39] dark:text-white font-display leading-tight mt-0.5">128</span>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="flex-1 space-y-2.5">
              {platformPerformanceData.map((p) => {
                const Icon = p.icon
                return (
                  <div key={p.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className={`text-sm ${p.iconColor}`} />
                      <span className="font-medium text-ink-600 dark:text-ink-300">{p.name}</span>
                    </div>
                    <span className="font-bold text-ink-900 dark:text-white">{p.value}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Upcoming Best Time & Quick Actions (Col 3: ~ 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Upcoming Best Time */}
          <Card delay={0.25} className="!p-4">
            <div className="flex items-center gap-2 mb-3">
              <LuClock className="text-[#633DF2] text-base" />
              <h3 className="font-bold text-[#1E1B39] dark:text-white text-xs font-display">Upcoming Best Time to Post</h3>
            </div>

            {/* Time highlight card */}
            <div className="p-3 rounded-xl bg-[#F0F5FE] dark:bg-ink-700/60 border border-[#DCE7FD] dark:border-ink-600 flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#633DF2]/10 flex items-center justify-center shrink-0 text-[#633DF2]">
                <LuCalendar className="text-base" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#10B981]">Today, 8:00 PM</p>
                <p className="text-[11px] text-ink-500 font-medium">High engagement time</p>
              </div>
            </div>

            <button className="w-full bg-[#633DF2] hover:bg-[#522DE0] text-white text-xs font-bold py-2 rounded-xl transition shadow-sm">
              View All Best Times
            </button>
          </Card>

          {/* Quick Actions */}
          <Card delay={0.3} className="!p-4">
            <h3 className="font-bold text-[#1E1B39] dark:text-white text-xs font-display mb-3">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: LuUpload, label: 'Upload Content', to: '/upload', iconBg: 'bg-[#EBF3FE] text-[#3B82F6]' },
                { icon: LuChartBar, label: 'New Analysis', to: '/analysis', iconBg: 'bg-[#ECE7FE] text-[#633DF2]' },
                { icon: LuFileText, label: 'View Reports', to: '/analytics', iconBg: 'bg-[#E8F8F0] text-[#10B981]' },
                { icon: LuCalendar, label: 'Schedule Post', to: '/calendar', iconBg: 'bg-[#FEF4E8] text-[#F59E0B]' },

              ].map((act) => {
                const ActIcon = act.icon
                return (
                  <Link
                    key={act.label}
                    to={act.to}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700 transition text-center group"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${act.iconBg} group-hover:scale-105 transition-transform`}>
                      <ActIcon className="text-lg" />
                    </div>
                    <span className="text-[10px] font-medium text-ink-600 dark:text-ink-300 leading-tight">
                      {act.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Lower Row Grid (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Recent Analyses (Col 1: ~ 5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between" delay={0.35}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1E1B39] dark:text-white text-sm font-display">Recent Analyses</h3>
            <Link to="/history" className="text-xs font-semibold text-[#633DF2] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentAnalysesData.map((item) => {
              const PlatformIconComp = item.platformIcon
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-ink-50/70 dark:hover:bg-ink-700/50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <PlatformIconComp className={`text-xs ${item.platformColor}`} />
                        <p className="text-xs font-bold text-[#1E1B39] dark:text-white truncate">{item.title}</p>
                      </div>
                      <p className="text-[10px] text-ink-400 font-medium mt-0.5">
                        {item.date} • {item.platform}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#E8F8F0] dark:bg-emerald-950/40 text-[#10B981] font-bold text-xs">
                      Score {item.score}
                    </span>
                    <LuChevronRight className="text-ink-400 text-sm" />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Content Score Distribution (Col 2: ~ 4 cols) */}
        <Card className="lg:col-span-4 flex flex-col justify-between" delay={0.4}>
          <h3 className="font-bold text-[#1E1B39] dark:text-white text-sm font-display mb-2">Content Score Distribution</h3>

          <div className="flex items-center justify-between gap-4">
            {/* Donut Chart */}
            <div className="w-32 h-32 relative shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentScoreDistributionData}
                    dataKey="value"
                    innerRadius={36}
                    outerRadius={56}
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {contentScoreDistributionData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Breakdown */}
            <div className="flex-1 space-y-2.5">
              {contentScoreDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-ink-600 dark:text-ink-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-ink-900 dark:text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* AI Insights (Col 3: ~ 3 cols) */}
        <Card className="lg:col-span-3 flex flex-col justify-between" delay={0.45}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <LuSparkles className="text-[#633DF2] text-base" />
              <h3 className="font-bold text-[#1E1B39] dark:text-white text-xs font-display">AI Insights</h3>
            </div>
            <button className="text-[11px] font-semibold text-[#633DF2] hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {aiInsightsData.map((insight) => {
              const IconComp = insight.icon
              return (
                <div key={insight.id} className={`p-2.5 rounded-xl ${insight.bg} dark:bg-ink-700/60 flex items-start gap-2.5`}>
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-ink-800 shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                    <IconComp className={`text-sm ${insight.iconColor}`} />
                  </div>
                  <p className="text-[11px] text-ink-700 dark:text-ink-200 font-medium leading-snug">
                    {insight.text}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Feature Banner: Let AI Optimise Your Content */}
      <div className="mt-6 rounded-3xl bg-[#F3EFFF] dark:bg-ink-800 border border-[#E8DEFF] dark:border-ink-700 p-6 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        {/* Left Side: Robot Illustration graphic */}
        <div className="flex items-center gap-5 w-full lg:w-auto">
          {/* Custom SVG Artwork matching the reference 3D robot */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8072FB" />
                  <stop offset="100%" stopColor="#633DF2" />
                </linearGradient>
                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E1B39" />
                  <stop offset="100%" stopColor="#2D2952" />
                </linearGradient>
              </defs>
              {/* Outer Glow Circle */}
              <circle cx="100" cy="100" r="90" fill="#EAE2FF" opacity="0.6" />
              {/* Robot Body */}
              <rect x="65" y="105" width="70" height="55" rx="18" fill="url(#botGrad)" />
              {/* Robot Head */}
              <rect x="60" y="45" width="80" height="55" rx="20" fill="url(#botGrad)" />
              {/* Face Screen */}
              <rect x="70" y="55" width="60" height="35" rx="12" fill="url(#screenGrad)" />
              {/* Glowing Eyes */}
              <circle cx="85" cy="72" r="6" fill="#00F0FF" />
              <circle cx="115" cy="72" r="6" fill="#00F0FF" />
              <path d="M 90 82 Q 100 87 110 82" stroke="#00F0FF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Robot Antenna */}
              <rect x="97" y="32" width="6" height="15" rx="3" fill="#633DF2" />
              <circle cx="100" cy="28" r="7" fill="#00F0FF" />
              {/* Floating Social Icons surrounding */}
              <circle cx="35" cy="65" r="14" fill="#E4405F" />
              <circle cx="165" cy="65" r="14" fill="#3B82F6" />
              <circle cx="160" cy="135" r="12" fill="#10B981" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E1B39] dark:text-white font-display">
              Let AI Optimise Your Content
            </h2>
            <p className="text-xs text-ink-500 dark:text-ink-300 font-medium max-w-md mt-1 leading-relaxed">
              Get smart recommendations, improve engagement and grow faster with our AI-powered insights.
            </p>
            <button
              onClick={openAssistant}
              className="mt-3 bg-[#633DF2] hover:bg-[#522DE0] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              Try AI Assistant
            </button>
          </div>
        </div>

        {/* Right Side: AI Suggestions for You */}
        <div className="w-full lg:w-auto bg-white/90 dark:bg-ink-900/80 backdrop-blur-sm p-4 rounded-2xl border border-white/80 dark:border-ink-700 space-y-2.5 min-w-[290px]">
          <p className="text-xs font-bold text-[#1E1B39] dark:text-white">AI Suggestions for You</p>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F7F8FC] dark:bg-ink-800 border border-ink-100 dark:border-ink-700 text-xs font-medium text-ink-700 dark:text-ink-200">
            <LuImage className="text-[#633DF2] text-sm shrink-0" />
            <span className="truncate">Add more visuals to your carousel</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F7F8FC] dark:bg-ink-800 border border-ink-100 dark:border-ink-700 text-xs font-medium text-ink-700 dark:text-ink-200">
            <LuType className="text-[#633DF2] text-sm shrink-0" />
            <span className="truncate">Use engaging keywords in caption</span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F7F8FC] dark:bg-ink-800 border border-ink-100 dark:border-ink-700 text-xs font-medium text-ink-700 dark:text-ink-200">
            <LuClock className="text-[#633DF2] text-sm shrink-0" />
            <span className="truncate">Post between 7PM – 10PM for better reach</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

