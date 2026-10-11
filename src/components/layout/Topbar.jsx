import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuSearch, LuBell, LuSun, LuMoon, LuMenu, LuChevronDown } from 'react-icons/lu'
import { currentUser } from '../../data/dummyData'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

export default function Topbar({ onMenuClick, title }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-[#F7F8FC]/90 dark:bg-ink-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center gap-4 px-5 lg:px-8 h-20">
        <button onClick={onMenuClick} title="Open menu" className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 shrink-0">
          <LuMenu className="text-ink-600 dark:text-ink-300 text-lg" />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-sm relative">
          <LuSearch className="absolute left-4 text-ink-400 text-sm" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-[#F1F3F9] dark:bg-ink-800 border-0 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-ink-800 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-[#633DF2]/20 transition font-medium"
          />
          <LuSearch className="absolute right-4 text-ink-400 text-sm" />
        </div>

        <div className="flex-1 md:hidden">
          {title && <h1 className="font-display font-bold text-ink-900 dark:text-white text-lg truncate">{title}</h1>}
        </div>

        <div className="flex items-center gap-3 ml-auto shrink-0">
          {/* Notifications */}
          <button title="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white transition shadow-sm">
            <LuBell className="text-base" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#633DF2] text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white transition shadow-sm"
          >
            {theme === 'light' ? <LuSun className="text-base" /> : <LuMoon className="text-base" />}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full hover:bg-white/60 dark:hover:bg-ink-800 transition">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border border-white dark:border-ink-700 shadow-sm" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[#1E1B39] dark:text-white leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-ink-400 font-medium leading-tight">{currentUser.role}</p>
              </div>
              <LuChevronDown className="text-ink-400 text-xs hidden sm:block ml-1" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700 shadow-xl py-2 z-30">
                <button onClick={() => { navigate('/profile'); setProfileOpen(false) }} className="w-full text-left px-4 py-2 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700">My Profile</button>
                <button onClick={() => { navigate('/settings'); setProfileOpen(false) }} className="w-full text-left px-4 py-2 text-xs font-semibold text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700">Settings</button>
                <div className="my-1 border-t border-ink-100 dark:border-ink-700" />
                <button onClick={() => { logout(); navigate('/login'); setProfileOpen(false) }} className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

