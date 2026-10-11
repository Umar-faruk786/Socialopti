import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { LuCopy, LuCheck, LuHash, LuClock, LuUsers, LuImage, LuMessageSquare, LuTarget } from 'react-icons/lu'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { recommendations as defaultRecommendations } from '../data/dummyData'
import { api } from '../services/api'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="btn-secondary text-xs py-1.5 px-3"
    >
      {copied ? <><LuCheck className="text-emerald-500" /> Copied</> : <><LuCopy /> Copy</>}
    </button>
  )
}

export default function Recommendations() {
  const location = useLocation()
  const [recs, setRecs] = useState(defaultRecommendations)

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await api.getLatestRecommendations(location.state?.contentId)
        if (data && data.improved_caption) {
          setRecs({
            improvedCaption: data.improved_caption || defaultRecommendations.improvedCaption,
            hashtags: data.hashtags || defaultRecommendations.hashtags,
            bestTime: data.best_time || defaultRecommendations.bestTime,
            audience: data.audience || defaultRecommendations.audience,
            improvementTips: data.improvement_tips || defaultRecommendations.improvementTips
          })
        }
      } catch (err) {
        console.log('Using default/cached recommendations')
      }
    }
    loadRecommendations()
  }, [location.state])

  const r = recs

  return (
    <DashboardLayout title="Recommendations">
      <PageHeader title="Recommendations" subtitle="AI-powered suggestions to improve your content performance." />

      <div className="grid lg:grid-cols-2 gap-6">
        <Card delay={0.05}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-ink-900 dark:text-white flex items-center gap-2"><LuMessageSquare className="text-primary-500" /> Improved Caption</h3>
            <CopyButton text={r.improvedCaption} />
          </div>
          <p className="text-xs text-ink-400 mb-3">Your caption can be improved. Use this AI-generated caption.</p>
          <div className="rounded-xl2 bg-ink-50 dark:bg-ink-900 p-4 text-sm text-ink-700 dark:text-ink-300 leading-relaxed">{r.improvedCaption}</div>
        </Card>

        <Card delay={0.1}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-ink-900 dark:text-white flex items-center gap-2"><LuHash className="text-primary-500" /> Suggested Hashtags</h3>
            <CopyButton text={r.hashtags.join(' ')} />
          </div>
          <p className="text-xs text-ink-400 mb-3">Use these trending hashtags to increase your reach.</p>
          <div className="flex flex-wrap gap-2">
            {r.hashtags.map((h) => (
              <span key={h} className="badge bg-primary-50 text-primary-700">{h}</span>
            ))}
          </div>
        </Card>

        <Card delay={0.15}>
          <h3 className="font-display font-bold text-ink-900 dark:text-white flex items-center gap-2 mb-3"><LuClock className="text-primary-500" /> Best Time to Post</h3>
          <p className="text-xs text-ink-400 mb-3">Post at the best time to get maximum engagement.</p>
          <div className="rounded-xl2 bg-accent-greenLight p-4">
            <p className="font-bold text-emerald-700">{r.bestTime.day}, {r.bestTime.time}</p>
            <p className="text-xs text-emerald-600 mt-0.5">{r.bestTime.label}</p>
          </div>
          <button className="btn-primary w-full mt-4 !bg-gradient-to-r !from-emerald-500 !to-teal-500">View Best Times</button>
        </Card>

        <Card delay={0.2}>
          <h3 className="font-display font-bold text-ink-900 dark:text-white flex items-center gap-2 mb-3"><LuUsers className="text-primary-500" /> Target Audience</h3>
          <p className="text-xs text-ink-400 mb-3">Target the right audience for better results.</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-500">Age Range</span><span className="font-semibold text-ink-800 dark:text-ink-100">{r.audience.ageRange}</span></div>
            <div>
              <span className="text-ink-500 block mb-1.5">Interests</span>
              <div className="flex flex-wrap gap-1.5">{r.audience.interests.map((i) => <Badge key={i} color="purple">{i}</Badge>)}</div>
            </div>
            <div>
              <span className="text-ink-500 block mb-1.5">Top Regions</span>
              <div className="flex flex-wrap gap-1.5">{r.audience.regions.map((i) => <Badge key={i} color="blue">{i}</Badge>)}</div>
            </div>
          </div>
          <button className="btn-secondary w-full mt-4">View Insights</button>
        </Card>
      </div>

      <h3 className="font-display font-bold text-ink-900 dark:text-white mt-8 mb-4">Improvement Suggestions</h3>
      <div className="grid sm:grid-cols-3 gap-6">
        {r.improvementTips.map((tip, i) => {
          const icons = [LuImage, LuTarget, LuUsers]
          const Icon = icons[i]
          return (
            <Card key={tip.title} delay={0.05 * i} hover>
              <div className="w-11 h-11 rounded-xl2 bg-accent-purpleLight text-purple-600 flex items-center justify-center mb-4">
                <Icon className="text-lg" />
              </div>
              <h4 className="font-display font-bold text-ink-900 dark:text-white mb-1.5">{tip.title}</h4>
              <p className="text-sm text-ink-500 mb-4">{tip.desc}</p>
              <button className="btn-secondary text-xs py-1.5 px-3">View Tips</button>
            </Card>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
