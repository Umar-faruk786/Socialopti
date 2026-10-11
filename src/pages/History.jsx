import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuSearch, LuEye, LuDownload, LuTrash2, LuChevronLeft, LuChevronRight, LuX } from 'react-icons/lu'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import PlatformIcon from '../components/ui/PlatformIcon'
import { historyData as initialHistoryData } from '../data/dummyData'
import { api } from '../services/api'

const PAGE_SIZE = 6

export default function History() {
  const [rows, setRows] = useState(initialHistoryData)
  const [query, setQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState('All Platforms')
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await api.getHistory()
        if (data && data.items && data.items.length > 0) {
          setRows(data.items)
        }
      } catch (err) {
        console.log('Using default history list')
      }
    }
    loadHistory()
  }, [])

  const platformsList = ['All Platforms', ...new Set(rows.map((h) => h.platform))]

  const filtered = useMemo(() => {
    return rows.filter((h) =>
      h.title.toLowerCase().includes(query.toLowerCase()) &&
      (platformFilter === 'All Platforms' || h.platform === platformFilter)
    )
  }, [rows, query, platformFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await api.deleteContent(pendingDelete.id)
    } catch (err) {
      console.log('Local delete')
    }
    setRows((r) => r.filter((row) => row.id !== pendingDelete.id))
    showToast(`"${pendingDelete.title}" was deleted.`)
    setPendingDelete(null)
  }

  return (
    <DashboardLayout title="History">
      <PageHeader title="Analysis History" subtitle="View all your previously analyzed content." />

      <Card delay={0.05}>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search content..."
              className="input-field pl-11"
            />
          </div>
          <select
            value={platformFilter}
            onChange={(e) => { setPlatformFilter(e.target.value); setPage(1) }}
            className="text-sm font-medium border border-ink-200 dark:border-ink-600 rounded-xl2 px-3 py-2.5 text-ink-600 dark:text-ink-300 bg-white dark:bg-ink-800"
          >
            {platformsList.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select className="text-sm font-medium border border-ink-200 dark:border-ink-600 rounded-xl2 px-3 py-2.5 text-ink-600 dark:text-ink-300 bg-white dark:bg-ink-800">
            <option>All Time</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs font-medium border-b border-ink-100 dark:border-ink-700">
                <th className="pb-3 pr-4">Content</th>
                <th className="pb-3 pr-4">Platform</th>
                <th className="pb-3 pr-4">Content Score</th>
                <th className="pb-3 pr-4">Engagement Score</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((h) => (
                <tr key={h.id} className="border-b border-ink-50 last:border-none">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <img src={h.image} alt={h.title} className="w-10 h-10 rounded-xl2 object-cover" />
                      <span className="font-medium text-ink-800 dark:text-ink-100">{h.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1.5 text-ink-600 dark:text-ink-300"><PlatformIcon platform={h.platform} /> {h.platform}</span>
                  </td>
                  <td className="py-3 pr-4"><Badge color={h.contentScore >= 85 ? 'green' : h.contentScore >= 70 ? 'blue' : 'orange'}>{h.contentScore}</Badge></td>
                  <td className="py-3 pr-4"><Badge color={h.engagementScore >= 85 ? 'green' : h.engagementScore >= 70 ? 'blue' : 'orange'}>{h.engagementScore}</Badge></td>
                  <td className="py-3 pr-4 text-ink-500">{h.date}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate('/analysis', { state: { contentId: h.id } })} title="View Report" className="w-8 h-8 rounded-xl2 bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-ink-500 hover:text-primary-600 hover:bg-primary-50 transition"><LuEye /></button>
                      <button onClick={() => showToast(`"${h.title}" report downloaded.`)} title="Download Report" className="w-8 h-8 rounded-xl2 bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-ink-500 hover:text-emerald-600 hover:bg-emerald-50 transition"><LuDownload /></button>
                      <button onClick={() => setPendingDelete(h)} title="Delete" className="w-8 h-8 rounded-xl2 bg-ink-50 dark:bg-ink-900 flex items-center justify-center text-ink-500 hover:text-red-500 hover:bg-red-50 transition"><LuTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-ink-400 text-sm">No results found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-xs text-ink-400">Showing {paged.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} to {(currentPage - 1) * PAGE_SIZE + paged.length} of {filtered.length} results</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-xl2 border border-ink-200 dark:border-ink-600 flex items-center justify-center text-ink-500 disabled:opacity-40">
              <LuChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-xl2 text-sm font-medium transition ${currentPage === i + 1 ? 'bg-primary-500 text-white' : 'border border-ink-200 dark:border-ink-600 text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-800'}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-xl2 border border-ink-200 dark:border-ink-600 flex items-center justify-center text-ink-500 disabled:opacity-40">
              <LuChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </Card>

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setPendingDelete(null)}>
          <div onClick={(e) => e.stopPropagation()} className="card !p-6 w-full max-w-sm">
            <h3 className="font-display font-bold text-ink-900 dark:text-white mb-2">Delete this analysis?</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
              "{pendingDelete.title}" will be permanently removed from your history. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setPendingDelete(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl2 hover:bg-red-600 transition-all duration-200">
                <LuTrash2 /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-sm font-medium px-4 py-3 rounded-xl2 shadow-cardHover">
          {toast}
          <button onClick={() => setToast(null)} className="text-white/60 dark:text-ink-500 hover:text-white dark:hover:text-ink-900"><LuX /></button>
        </div>
      )}
    </DashboardLayout>
  )
}
