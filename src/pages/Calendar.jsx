import { useState, useEffect } from 'react'
import { LuChevronLeft, LuChevronRight, LuChevronDown, LuCalendar, LuPlus, LuSlidersHorizontal } from 'react-icons/lu'
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa6'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { api } from '../services/api'

const defaultEvents = {
  1: {
    title: 'Product Teaser',
    time: '10:00 AM',
    icon: <FaInstagram className="text-pink-500 text-sm shrink-0" />,
    cardStyle: 'bg-[#F4EFFE] dark:bg-purple-950/30 border-purple-100 dark:border-purple-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-purple-600 dark:text-purple-400',
  },
  3: {
    title: 'Poll: New Feature',
    time: '01:00 PM',
    icon: <LuSlidersHorizontal className="text-emerald-600 text-sm shrink-0" />,
    cardStyle: 'bg-[#EEFCEF] dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-emerald-600 dark:text-emerald-400',
  },
  6: {
    title: 'Industry Insights',
    time: '11:30 AM',
    icon: <FaLinkedin className="text-blue-600 text-sm shrink-0" />,
    cardStyle: 'bg-[#EDF5FF] dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-blue-600 dark:text-blue-400',
  },
  10: {
    title: 'Tutorial Video',
    time: '04:00 PM',
    icon: <FaYoutube className="text-red-500 text-sm shrink-0" />,
    cardStyle: 'bg-[#FFF0F0] dark:bg-red-950/30 border-red-100 dark:border-red-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-red-500 dark:text-red-400',
  },
  12: {
    title: 'Weekly Roundup',
    time: '09:00 AM',
    icon: <FaLinkedin className="text-blue-600 text-sm shrink-0" />,
    cardStyle: 'bg-[#EDF5FF] dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-blue-600 dark:text-blue-400',
  },
  15: {
    title: 'Behind the Scenes',
    time: '02:00 PM',
    icon: <FaInstagram className="text-pink-500 text-sm shrink-0" />,
    cardStyle: 'bg-[#F4EFFE] dark:bg-purple-950/30 border-purple-100 dark:border-purple-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-purple-600 dark:text-purple-400',
  },
  18: {
    title: 'Poll: Content Type',
    time: '12:00 PM',
    icon: <LuSlidersHorizontal className="text-emerald-600 text-sm shrink-0" />,
    cardStyle: 'bg-[#EEFCEF] dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-emerald-600 dark:text-emerald-400',
  },
  22: {
    title: 'Case Study',
    time: '03:30 PM',
    icon: <FaYoutube className="text-red-500 text-sm shrink-0" />,
    cardStyle: 'bg-[#FFF0F0] dark:bg-red-950/30 border-red-100 dark:border-red-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-red-500 dark:text-red-400',
  },
  24: {
    title: 'Tips & Tricks',
    time: '11:00 AM',
    icon: <FaInstagram className="text-pink-500 text-sm shrink-0" />,
    cardStyle: 'bg-[#F4EFFE] dark:bg-purple-950/30 border-purple-100 dark:border-purple-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-purple-600 dark:text-purple-400',
  },
  28: {
    title: 'Success Story',
    time: '10:00 AM',
    icon: <FaLinkedin className="text-blue-600 text-sm shrink-0" />,
    cardStyle: 'bg-[#EDF5FF] dark:bg-blue-950/30 border-blue-100 dark:border-blue-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-blue-600 dark:text-blue-400',
  },
  31: {
    title: 'Poll: Best Time',
    time: '01:00 PM',
    icon: <LuSlidersHorizontal className="text-emerald-600 text-sm shrink-0" />,
    cardStyle: 'bg-[#EEFCEF] dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-800/40 text-slate-900 dark:text-white',
    timeStyle: 'text-emerald-600 dark:text-emerald-400',
  },
}

const calendarDays = [
  // Row 1 (Apr 28 - May 4)
  { day: 28, isCurrent: false, isSunday: true },
  { day: 29, isCurrent: false, isSunday: false },
  { day: 30, isCurrent: false, isSunday: false },
  { day: 1, isCurrent: true, isSunday: false },
  { day: 2, isCurrent: true, isSunday: false },
  { day: 3, isCurrent: true, isSunday: false },
  { day: 4, isCurrent: true, isSunday: false, isSat: true },
  // Row 2 (May 5 - May 11)
  { day: 5, isCurrent: true, isSunday: true },
  { day: 6, isCurrent: true, isSunday: false },
  { day: 7, isCurrent: true, isSunday: false },
  { day: 8, isCurrent: true, isSunday: false },
  { day: 9, isCurrent: true, isSunday: false },
  { day: 10, isCurrent: true, isSunday: false },
  { day: 11, isCurrent: true, isSunday: false, isSat: true },
  // Row 3 (May 12 - May 18)
  { day: 12, isCurrent: true, isSunday: true },
  { day: 13, isCurrent: true, isSunday: false },
  { day: 14, isCurrent: true, isSunday: false },
  { day: 15, isCurrent: true, isSunday: false },
  { day: 16, isCurrent: true, isSunday: false },
  { day: 17, isCurrent: true, isSunday: false },
  { day: 18, isCurrent: true, isSunday: false, isSat: true },
  // Row 4 (May 19 - May 25)
  { day: 19, isCurrent: true, isSunday: true },
  { day: 20, isCurrent: true, isSunday: false },
  { day: 21, isCurrent: true, isSunday: false },
  { day: 22, isCurrent: true, isSunday: false },
  { day: 23, isCurrent: true, isSunday: false },
  { day: 24, isCurrent: true, isSunday: false },
  { day: 25, isCurrent: true, isSunday: false, isSat: true },
  // Row 5 (May 26 - Jun 1)
  { day: 26, isCurrent: true, isSunday: true },
  { day: 27, isCurrent: true, isSunday: false },
  { day: 28, isCurrent: true, isSunday: false },
  { day: 29, isCurrent: true, isSunday: false },
  { day: 30, isCurrent: true, isSunday: false },
  { day: 31, isCurrent: true, isSunday: false },
  { day: 1, isCurrent: false, isSunday: false, isSat: true },
]

export default function Calendar() {
  const [activeView, setActiveView] = useState('Month')
  const [events, setEvents] = useState(defaultEvents)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await api.getCalendarEvents()
        if (data && Object.keys(data).length > 0) {
          setEvents((prev) => ({ ...prev, ...data }))
        }
      } catch (err) {
        console.log('Using local calendar events')
      }
    }
    loadEvents()
  }, [])

  return (
    <DashboardLayout title="Calendar">
      <PageHeader
        title="Content Calendar"
        subtitle="Plan and schedule your upcoming posts."
        actions={<button className="btn-primary"><LuPlus /> Schedule Post</button>}
      />

      <Card delay={0.05} className="p-6">
        {/* Calendar Control Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button title="Previous month" className="w-9 h-9 rounded-xl border border-slate-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-slate-600 dark:text-ink-200 flex items-center justify-center shadow-xs hover:bg-slate-50 transition-colors">
              <LuChevronLeft className="text-base" />
            </button>
            <button title="Next month" className="w-9 h-9 rounded-xl border border-slate-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-slate-600 dark:text-ink-200 flex items-center justify-center shadow-xs hover:bg-slate-50 transition-colors">
              <LuChevronRight className="text-base" />
            </button>
            <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-slate-700 dark:text-white text-sm font-semibold shadow-xs hover:bg-slate-50 transition-colors">
              Today
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-lg tracking-tight">
            <LuCalendar className="text-xl text-slate-700 dark:text-ink-300" />
            <span>May 2024</span>
            <LuChevronDown className="text-sm text-slate-400" />
          </div>

          <div className="flex items-center p-1 bg-slate-100/80 dark:bg-ink-900/60 rounded-xl border border-slate-200/50 dark:border-ink-700/50 text-xs font-semibold">
            {['Month', 'Week', 'List'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-1.5 rounded-lg transition-all ${activeView === view
                  ? 'bg-purple-100/80 dark:bg-purple-900/40 text-primary-600 dark:text-primary-400 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-ink-400 dark:hover:text-white font-medium'
                  }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-3 mb-3 text-center">
          <div className="text-red-500 font-bold text-xs tracking-wider uppercase">SUN</div>
          <div className="text-slate-800 dark:text-white font-bold text-xs tracking-wider uppercase">MON</div>
          <div className="text-slate-800 dark:text-white font-bold text-xs tracking-wider uppercase">TUE</div>
          <div className="text-slate-800 dark:text-white font-bold text-xs tracking-wider uppercase">WED</div>
          <div className="text-slate-800 dark:text-white font-bold text-xs tracking-wider uppercase">THU</div>
          <div className="text-slate-800 dark:text-white font-bold text-xs tracking-wider uppercase">FRI</div>
          <div className="text-primary-600 dark:text-primary-400 font-bold text-xs tracking-wider uppercase">SAT</div>
        </div>

        {/* Calendar Grid (5 rows x 7 cols) */}
        <div className="grid grid-cols-7 gap-3">
          {calendarDays.map((cell, idx) => {
            const event = cell.isCurrent ? events[cell.day] : null
            return (
              <div
                key={idx}
                className="border border-dashed border-slate-200 dark:border-ink-700/70 rounded-2xl bg-white dark:bg-ink-800/40 p-3 min-h-[110px] flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div className="text-left">
                  <span
                    className={`text-sm ${!cell.isCurrent
                      ? 'text-slate-300 dark:text-ink-600 font-medium'
                      : cell.isSunday
                        ? 'text-red-500 font-bold'
                        : 'text-slate-800 dark:text-white font-bold'
                      }`}
                  >
                    {cell.day}
                  </span>
                </div>

                {event && (
                  <div className={`p-2.5 rounded-xl border text-xs shadow-2xs ${event.cardStyle} mt-2`}>
                    <div className="flex items-center gap-1.5 font-bold text-[12px]">
                      {event.icon}
                      <span className="truncate">{event.title}</span>
                    </div>
                    <div className={`text-[11px] font-semibold mt-1 flex items-center gap-1.5 ${event.timeStyle}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </DashboardLayout>
  )
}
