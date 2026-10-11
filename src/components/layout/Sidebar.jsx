import { NavLink, useNavigate } from 'react-router-dom'
import {
  LuLayoutDashboard, LuUpload, LuChartPie, LuHistory, LuCalendar,
  LuUser, LuSettings, LuLogOut, LuChevronsLeft, LuChevronsRight,
  LuChevronRight, LuCrown, LuChartBar
} from 'react-icons/lu'
import { useAuth } from '../../context/AuthContext'
import { useAssistant } from '../../context/AssistantContext'

const menu = [
  { to: '/dashboard', label: 'Dashboard', icon: LuLayoutDashboard },
  { to: '/upload', label: 'Upload Content', icon: LuUpload },
  { to: '/analytics', label: 'Analytics', icon: LuChartPie },
  { to: '/history', label: 'History', icon: LuHistory },
  { to: '/calendar', label: 'Calendar', icon: LuCalendar },
  { to: '/profile', label: 'Profile', icon: LuUser },
  { to: '/settings', label: 'Settings', icon: LuSettings },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { openAssistant } = useAssistant()

  return (
    <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-white dark:bg-ink-800 border-r border-ink-100 dark:border-ink-700 transition-all duration-300 z-30 ${
        collapsed ? 'w-[84px]' : 'w-[250px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-20 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6355F6] to-[#A855F7] flex items-center justify-center shrink-0 shadow-md text-white">
          <LuChartBar className="text-xl" />
        </div>


        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-[#1E1B39] dark:text-white text-lg leading-tight whitespace-nowrap">SocialOpti</p>
            <p className="text-[11px] text-ink-400 font-medium whitespace-nowrap">AI Social Optimizer</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#ECE7FE] text-[#633DF2] font-semibold'
                  : 'text-[#64748B] dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700 hover:text-ink-800 dark:hover:text-ink-100'
              }`
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`text-lg shrink-0 ${isActive ? 'text-[#633DF2]' : 'text-[#94A3B8] group-hover:text-ink-600 dark:group-hover:text-ink-200'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Cards */}
      {!collapsed && (
        <div className="px-3 pb-3 space-y-3">
          {/* Upgrade to Pro Card */}
          <div className="p-4 rounded-2xl bg-[#F4F1FF] dark:bg-ink-700/50 border border-[#E9E2FF] dark:border-ink-600 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1.5">
              <LuCrown className="text-[#F59E0B] text-lg" />
              <span className="text-[#5534F6] dark:text-primary-300 font-bold text-xs">Upgrade to Pro</span>
            </div>
            <p className="text-ink-500 dark:text-ink-300 text-[11px] leading-relaxed mb-3">
              Unlock advanced analytics, auto posting, and premium AI insights.
            </p>
            <button className="w-full bg-[#633DF2] hover:bg-[#522DE0] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm">
              Upgrade Now
            </button>
          </div>

          {/* Need Help Card */}
          <div
            onClick={openAssistant}
            className="p-2.5 rounded-2xl bg-white dark:bg-ink-700 border border-ink-100 dark:border-ink-600 flex items-center justify-between shadow-sm cursor-pointer hover:border-ink-200 transition"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                alt="Support Avatar"
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink-900 dark:text-white truncate">Need Help?</p>
                <p className="text-[10px] text-ink-400 truncate">Chat with our support team</p>
              </div>
            </div>
            <LuChevronRight className="text-ink-400 text-sm shrink-0" />
          </div>
        </div>
      )}

      {/* Collapse / Logout button bar */}
      <div className="px-3 py-2 border-t border-ink-100 dark:border-ink-700 flex items-center justify-between">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <LuChevronsRight className="text-base" /> : <LuChevronsLeft className="text-base" />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          title="Logout"
        >
          <LuLogOut className="text-base" />
        </button>
      </div>
    </aside>
  )
}

