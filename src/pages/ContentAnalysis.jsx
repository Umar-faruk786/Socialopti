import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { LuDownload, LuHash, LuSmile } from 'react-icons/lu'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import GaugeChart from '../components/charts/GaugeChart'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import { contentAnalysisMetrics as defaultMetrics } from '../data/dummyData'
import { api } from '../services/api'

export default function ContentAnalysis() {
  const location = useLocation()
  const [metrics, setMetrics] = useState(location.state?.analysis || defaultMetrics)
  const [loading, setLoading] = useState(!location.state?.analysis)

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const data = await api.getLatestAnalysis(location.state?.contentId)
        if (data && data.overall_score !== undefined) {
          setMetrics({
            imageQuality: data.image_quality || defaultMetrics.imageQuality,
            captionQuality: data.caption_quality || defaultMetrics.captionQuality,
            readability: data.readability || defaultMetrics.readability,
            grammar: data.grammar || defaultMetrics.grammar,
            overallScore: data.overall_score || defaultMetrics.overallScore,
            emotionDetected: data.emotion_detected || defaultMetrics.emotionDetected,
            emotionConfidence: data.emotion_confidence || defaultMetrics.emotionConfidence,
            tone: data.tone || defaultMetrics.tone,
            toneConfidence: data.tone_confidence || defaultMetrics.toneConfidence,
            hashtagCount: data.hashtag_count ?? defaultMetrics.hashtagCount,
            hashtagQuality: data.hashtag_quality || defaultMetrics.hashtagQuality,
            topKeywords: data.top_keywords || defaultMetrics.topKeywords,
            suggestions: data.suggestions || defaultMetrics.suggestions
          })
        }
      } catch (err) {
        console.log('Using default/cached analysis data')
      } finally {
        setLoading(false)
      }
    }
    if (!location.state?.analysis) {
      loadAnalysis()
    }
  }, [location.state])

  const m = metrics

  const metricCards = [
    { label: 'Image Quality', value: m.imageQuality, note: m.imageQuality >= 90 ? 'Excellent' : 'Good', color: 'bg-primary-500' },
    { label: 'Caption Quality', value: m.captionQuality, note: 'Very Good', color: 'bg-purple-500' },
    { label: 'Readability Score', value: m.readability, note: 'Very Good', color: 'bg-blue-500' },
    { label: 'Grammar Score', value: m.grammar, note: 'Excellent', color: 'bg-emerald-500' },
  ]

  return (
    <DashboardLayout title="Content Analysis">
      <PageHeader
        title="Content Analysis"
        subtitle="Here's the AI analysis of your content."
        actions={<button className="btn-secondary"><LuDownload /> Download Report</button>}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card delay={0.05}>
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
              alt="content preview"
              className="w-full h-56 object-cover rounded-xl2 mb-5"
            />
            <div className="grid grid-cols-2 gap-4">
              {metricCards.map((c) => (
                <div key={c.label} className="p-4 rounded-xl2 bg-ink-50 dark:bg-ink-900">
                  <ProgressBar value={c.value} color={c.color} showLabel label={c.label} />
                  <p className="text-[11px] text-ink-400 mt-1.5">{c.note}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card delay={0.1}>
              <h3 className="font-display font-bold text-ink-900 dark:text-white mb-4 flex items-center gap-2"><LuSmile className="text-primary-500" /> Emotion Detected</h3>
              <Badge color="green" className="text-sm px-4 py-1.5 mb-2">{m.emotionDetected}</Badge>
              <p className="text-xs text-ink-400">Confidence: {m.emotionConfidence}%</p>
              <div className="mt-2"><ProgressBar value={m.emotionConfidence} color="bg-emerald-500" /></div>
            </Card>
            <Card delay={0.15}>
              <h3 className="font-display font-bold text-ink-900 dark:text-white mb-4">Tone</h3>
              <Badge color="blue" className="text-sm px-4 py-1.5 mb-2">{m.tone}</Badge>
              <p className="text-xs text-ink-400">Confidence: {m.toneConfidence}%</p>
              <div className="mt-2"><ProgressBar value={m.toneConfidence} color="bg-blue-500" /></div>
            </Card>
          </div>

          <Card delay={0.2}>
            <h3 className="font-display font-bold text-ink-900 dark:text-white mb-4 flex items-center gap-2"><LuHash className="text-primary-500" /> Hashtag Count</h3>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold font-display text-ink-900 dark:text-white">{m.hashtagCount}</span>
              <Badge color="green">{m.hashtagQuality}</Badge>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card delay={0.1} className="flex flex-col items-center text-center">
            <h3 className="font-display font-bold text-ink-900 dark:text-white mb-4 self-start">Overall Content Score</h3>
            <GaugeChart value={m.overallScore} color="#635BFF" label="Excellent" size={160} />
            <p className="text-xs text-ink-400 mt-4">Great job! Your content is highly engaging.</p>
          </Card>

          <Card delay={0.15}>
            <h3 className="font-display font-bold text-ink-900 dark:text-white mb-4">Top Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {m.topKeywords.map((k) => (
                <span key={k} className="badge bg-primary-50 text-primary-700">{k}</span>
              ))}
            </div>
          </Card>

          <Card delay={0.2}>
            <h3 className="font-display font-bold text-ink-900 dark:text-white mb-4">Suggestions</h3>
            <ul className="space-y-3">
              {m.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                  <span className="w-5 h-5 rounded-full bg-accent-orangeLight text-amber-600 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
