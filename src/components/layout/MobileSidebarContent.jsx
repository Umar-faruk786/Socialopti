import { NavLink, useNavigate } from 'react-router-dom'
import {
  LuLayoutDashboard, LuUpload, LuChartPie, LuHistory, LuCalendar,
  LuUser, LuSettings, LuLogOut,
} from 'react-icons/lu'
import { HiSparkles } from 'react-icons/hi2'
import { useAuth } from '../../context/AuthContext'

const menu = [
  { to: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
  { to: '/upload', label: 'Upload Content', icon: LuUpload },
  { to: '/analytics', label: 'Analytics', icon: LuChartPie },
  { to: '/history', label: 'History', icon: LuHistory },
  { to: '/calendar', label: 'Calendar', icon: LuCalendar },
  { to: '/profile', label: 'Profile', icon: LuUser },
  { to: '/settings', label: 'Settings', icon: LuSettings },
]

export default function MobileSidebarContent({ onNavigate }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 h-20 border-b border-ink-100 dark:border-ink-700 shrink-0">
        <div className="w-9 h-9 rounded-xl2 bg-gradient-primary flex items-center justify-center shadow-premium">
          <HiSparkles className="text-white text-lg" />
        </div>
        <div>
          <p className="font-display font-extrabold text-ink-900 dark:text-white leading-tight">SocialOpti</p>
          <p className="text-[11px] text-ink-400">Smart Social Assistant</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold' : 'text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700 hover:text-ink-800 dark:hover:text-ink-100'
              }`
            }
          >
            <item.icon className="text-lg shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-6 border-t border-ink-100 dark:border-ink-700 pt-3">
        <button
          onClick={() => { logout(); navigate('/login'); onNavigate() }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
        >
          <LuLogOut className="text-lg shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
