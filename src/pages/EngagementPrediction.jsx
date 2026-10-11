import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { LuHeart, LuMessageCircle, LuShare2, LuEye } from 'react-icons/lu'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import GaugeChart from '../components/charts/GaugeChart'
import ProgressBar from '../components/ui/ProgressBar'
import PlatformIcon from '../components/ui/PlatformIcon'
import Badge from '../components/ui/Badge'
import {
  engagementPrediction as defaultPlatformBreakdown,
  predictionOverview as defaultOverview,
  expectedEngagement as defaultExpected
} from '../data/dummyData'
import { api } from '../services/api'

export default function EngagementPrediction() {
  const location = useLocation()
  const [platformBreakdown, setPlatformBreakdown] = useState(defaultPlatformBreakdown)
  const [overview, setOverview] = useState(defaultOverview)
  const [expected, setExpected] = useState(defaultExpected)

  useEffect(() => {
    async function loadPrediction() {
      try {
        const data = await api.getLatestPrediction(location.state?.contentId)
        if (data) {
          if (data.platform_breakdown) setPlatformBreakdown(data.platform_breakdown)
          if (data.expected_engagement) setExpected(data.expected_engagement)
          setOverview({
            totalEngagementScore: data.total_engagement_score ?? defaultOverview.totalEngagementScore,
            reachProbability: data.reach_probability ?? defaultOverview.reachProbability,
            viralityProbability: data.virality_probability ?? defaultOverview.viralityProbability,
            engagementProbability: data.engagement_probability ?? defaultOverview.engagementProbability
          })
        }
      } catch (err) {
        console.log('Using default/cached predictions')
      }
    }
    loadPrediction()
  }, [location.state])

  const engagementRows = [
    { label: 'Likes', value: expected.likes, icon: LuHeart, color: 'text-pink-500 bg-pink-50' },
    { label: 'Comments', value: expected.comments, icon: LuMessageCircle, color: 'text-blue-500 bg-blue-50' },
    { label: 'Shares', value: expected.shares, icon: LuShare2, color: 'text-purple-500 bg-purple-50' },
    { label: 'Reach', value: expected.reach, icon: LuEye, color: 'text-emerald-500 bg-emerald-50' },
  ]

  return (
    <DashboardLayout title="Engagement Prediction">
      <PageHeader title="Engagement Prediction" subtitle="AI prediction of your content performance across platforms." />

      {/* Prediction Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {platformBreakdown.map((p, i) => (
          <Card key={p.platform} delay={i * 0.05} hover>
            <div className="flex items-center gap-2 mb-4">
              <PlatformIcon platform={p.icon || p.platform.toLowerCase()} className="text-xl" />
              <span className="text-sm font-semibold text-ink-700 dark:text-ink-300">{p.platform}</span>
            </div>
            <p className="text-3xl font-extrabold font-display text-ink-900 dark:text-white">{p.score}%</p>
            <Badge color={p.score >= 85 ? 'green' : p.score >= 70 ? 'blue' : 'orange'} className="mt-2">{p.label}</Badge>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* Prediction Overview */}
        <Card delay={0.1} className="lg:col-span-1">
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Prediction Overview</h3>
          <div className="space-y-5">
            <ProgressBar value={overview.totalEngagementScore} showLabel label="Total Engagement Score" color="bg-primary-500" />
            <ProgressBar value={overview.reachProbability} showLabel label="Reach Probability" color="bg-blue-500" />
            <ProgressBar value={overview.viralityProbability} showLabel label="Virality Probability" color="bg-purple-500" />
            <ProgressBar value={overview.engagementProbability} showLabel label="Engagement Probability" color="bg-emerald-500" />
          </div>
        </Card>

        {/* Expected Engagement */}
        <Card delay={0.15}>
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Expected Engagement</h3>
          <div className="space-y-4">
            {engagementRows.map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl2 flex items-center justify-center ${row.color}`}>
                  <row.icon className="text-base" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-ink-500">{row.label}</p>
                  <p className="text-sm font-bold text-ink-800 dark:text-ink-100">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Engagement Probability Gauge */}
        <Card delay={0.2} className="flex flex-col items-center text-center">
          <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5 self-start">Engagement Probability</h3>
          <GaugeChart value={overview.engagementProbability} color="#10B981" label="High Chance" size={170} />
          <p className="text-xs text-ink-400 mt-4">This content has high potential to perform very well.</p>
        </Card>
      </div>
    </DashboardLayout>
  )
}
