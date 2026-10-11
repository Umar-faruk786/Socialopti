import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LuX } from 'react-icons/lu'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MobileSidebarContent from './MobileSidebarContent'
import PageTransition from './PageTransition'

export default function DashboardLayout({ children, title, subtitle }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-ink-900 transition-colors duration-200">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 h-screen w-[260px] bg-white dark:bg-ink-800 z-50 lg:hidden"
            >
              <button onClick={() => setMobileOpen(false)} title="Close menu" className="absolute top-5 right-4 text-ink-400">
                <LuX className="text-xl" />
              </button>
              <MobileSidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-300 ${collapsed ? 'lg:pl-[84px]' : 'lg:pl-[250px]'}`}>
        <Topbar onMenuClick={() => setMobileOpen(true)} title={title} subtitle={subtitle} />
        <main className="px-5 lg:px-7 pb-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
