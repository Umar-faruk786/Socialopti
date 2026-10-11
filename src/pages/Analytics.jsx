import { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { LuDownload, LuTrendingUp, LuUsers, LuChartBar, LuFileText } from 'react-icons/lu'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import {
  weeklyAnalytics as defaultWeekly,
  monthlyAnalytics as defaultMonthly,
  platformComparison as defaultPlatformComp,
  topPosts as defaultTopPosts,
  contentTypeDistribution as defaultContentType,
  heatmapData as defaultHeatmap,
} from '../data/dummyData'
import { api } from '../services/api'

const defaultStats = [
  { label: 'Total Reach', value: '245K', delta: '+21.5%', icon: LuUsers, color: 'bg-accent-orangeLight text-amber-600' },
  { label: 'Total Engagement', value: '18.6K', delta: '+14.8%', icon: LuTrendingUp, color: 'bg-accent-greenLight text-emerald-600' },
  { label: 'Avg. Engagement Rate', value: '7.6%', delta: '+8.2%', icon: LuChartBar, color: 'bg-accent-purpleLight text-purple-600' },
  { label: 'Total Posts', value: '56', delta: '+12.4%', icon: LuFileText, color: 'bg-accent-blueLight text-blue-600' },
]

function heatColor(v) {
  if (v < 20) return 'bg-primary-50'
  if (v < 40) return 'bg-primary-100'
  if (v < 60) return 'bg-primary-300'
  if (v < 80) return 'bg-primary-500'
  return 'bg-primary-700'
}

export default function Analytics() {
  const [range, setRange] = useState('This Month')
  const [analyticsData, setAnalyticsData] = useState(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await api.getAnalyticsOverview(range)
        if (data) setAnalyticsData(data)
      } catch (err) {
        console.log('Using default analytics metrics')
      }
    }
    loadAnalytics()
  }, [range])

  const weeklyAnalytics = analyticsData?.weeklyAnalytics || defaultWeekly
  const monthlyAnalytics = analyticsData?.monthlyAnalytics || defaultMonthly
  const platformComparison = analyticsData?.platformComparison || defaultPlatformComp
  const topPosts = analyticsData?.topPosts || defaultTopPosts
  const contentTypeDistribution = analyticsData?.contentTypeDistribution || defaultContentType
  const heatmapData = analyticsData?.heatmapData || defaultHeatmap
  const stats = defaultStats

  return (
    <DashboardLayout title="Analytics">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Track your content performance over time."
        actions={
          <>
            <select value={range} onChange={(e) => setRange(e.target.value)} className="text-sm font-medium border border-ink-200 dark:border-ink-600 rounded-xl2 px-3 py-2 text-ink-600 dark:text-ink-300 bg-white dark:bg-ink-800">
              <option>This Week</option>
              <option>This Month</option>
              <option>All Platforms</option>
            </select>
            <button className="btn-primary"><LuDownload /> Export Report</button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={s.label} delay={i * 0.05} hover className="!p-5">
            <div className={`w-11 h-11 rounded-xl2 flex items-center justify-center mb-4 ${s.color}`}>
              <s.icon className="text-lg" />
            </div>
            <p className="text-xs text-ink-500 mb-1">{s.label}</p>
            <p className="text-2xl font-extrabold font-display text-ink-900 dark:text-white">{s.value}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1">{s.delta} vs last period</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card delay={0.1}>
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Engagement Over Time (Weekly)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyAnalytics}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#635BFF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#635BFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F8" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9295AB' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9295AB' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E1E3EE', fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#635BFF" strokeWidth={2.5} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={0.15}>
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Content Score Trend (Monthly)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyAnalytics}>
              <defs>
                <linearGradient id="colorMonth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F8" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9295AB' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9295AB' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E1E3EE', fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2.5} fill="url(#colorMonth)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <Card delay={0.2} className="lg:col-span-2">
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Platform Comparison</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={platformComparison}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F8" />
              <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#9295AB' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9295AB' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E1E3EE', fontSize: 12 }} />
              <Bar dataKey="engagement" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={0.25}>
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Content Type Performance</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={contentTypeDistribution} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {contentTypeDistribution.map((p) => <Cell key={p.name} fill={p.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {contentTypeDistribution.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink-600 dark:text-ink-300"><span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} /> {p.name}</span>
                <span className="font-semibold text-ink-800 dark:text-ink-100">{p.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card delay={0.3}>
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-4">Top Performing Posts</h3>
          <div className="space-y-3">
            {topPosts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-800 dark:text-ink-100 truncate">{p.title}</p>
                  <p className="text-xs text-ink-400">{p.platform} · {p.engagement} engagements</p>
                </div>
                <Badge color="green">{p.score}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card delay={0.35}>
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-4">Audience Activity Heatmap</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] text-ink-400">
              <thead>
                <tr>
                  <th></th>
                  {heatmapData.hours.map((h) => <th key={h} className="font-medium pb-2">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {heatmapData.days.map((day, r) => (
                  <tr key={day}>
                    <td className="pr-2 font-medium text-ink-500">{day}</td>
                    {heatmapData.values[r].map((v, c) => (
                      <td key={c} className="p-0.5">
                        <div className={`w-full h-6 rounded ${heatColor(v)}`} title={`${v}%`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-ink-400">
            <span>Low</span>
            <span className="w-3 h-3 rounded bg-primary-50" />
            <span className="w-3 h-3 rounded bg-primary-300" />
            <span className="w-3 h-3 rounded bg-primary-700" />
            <span>High</span>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
