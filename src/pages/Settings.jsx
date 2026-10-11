import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LuUser, LuBell, LuShieldCheck, LuLock, LuPalette, LuLogOut, LuGlobe,
} from 'react-icons/lu'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { currentUser } from '../data/dummyData'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

const tabs = [
  { id: 'account', label: 'Account', icon: LuUser },
  { id: 'notifications', label: 'Notifications', icon: LuBell },
  { id: 'privacy', label: 'Privacy & Security', icon: LuShieldCheck },
  { id: 'appearance', label: 'Appearance', icon: LuPalette },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors duration-200 relative shrink-0 ${checked ? 'bg-primary-500' : 'bg-ink-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const [tab, setTab] = useState('account')
  const [notifs, setNotifs] = useState({ email: true, push: true, weekly: false, marketing: false })
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.getSettings()
        if (data) {
          setNotifs({
            email: Boolean(data.email),
            push: Boolean(data.push),
            weekly: Boolean(data.weekly),
            marketing: Boolean(data.marketing)
          })
        }
      } catch (err) {
        console.log('Using default settings')
      }
    }
    loadSettings()
  }, [])

  const handleToggleNotif = async (key, val) => {
    const updated = { ...notifs, [key]: val }
    setNotifs(updated)
    try {
      await api.updateSettings(updated)
    } catch (err) {
      console.log('Local settings update')
    }
  }

  return (
    <DashboardLayout title="Settings">
      <PageHeader title="Settings" subtitle="Manage your account preferences and app settings." />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <Card delay={0.05} className="lg:col-span-1 !p-3 h-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium transition ${
                tab === t.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700'
              }`}
            >
              <t.icon className="text-base" /> {t.label}
            </button>
          ))}
          <div className="my-2 border-t border-ink-100 dark:border-ink-700" />
          <button onClick={() => { logout(); navigate('/login') }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
            <LuLogOut className="text-base" /> Logout
          </button>
        </Card>

        {/* Panel */}
        <Card delay={0.1} className="lg:col-span-3">
          {tab === 'account' && (
            <div>
              <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Account Settings</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Full Name</label>
                  <input defaultValue={user?.name || currentUser.name} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Email</label>
                  <input defaultValue={user?.email || currentUser.email} className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block flex items-center gap-1.5"><LuGlobe /> Language</label>
                  <select className="input-field"><option>English</option><option>Hindi</option><option>Tamil</option></select>
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Time Zone</label>
                  <select className="input-field"><option>(UTC+05:30) Asia/Kolkata</option><option>(UTC+00:00) UTC</option></select>
                </div>
              </div>
              <button className="btn-primary">Save Changes</button>
              <div className="mt-8 pt-6 border-t border-ink-100 dark:border-ink-700">
                <p className="text-sm font-semibold text-red-500 mb-1">Danger Zone</p>
                <p className="text-xs text-ink-400 mb-3">Deleting your account is permanent and cannot be undone.</p>
                <button className="btn-secondary !text-red-500 !border-red-200 hover:!bg-red-50 dark:hover:!bg-red-500/10">Delete Account</button>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Notification Settings</h3>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates about your analyses via email.' },
                  { key: 'push', label: 'Push Notifications', desc: 'Get real-time alerts on your device.' },
                  { key: 'weekly', label: 'Weekly Digest', desc: 'A weekly summary of your content performance.' },
                  { key: 'marketing', label: 'Marketing Emails', desc: 'News, updates and product announcements.' },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl2 bg-ink-50 dark:bg-ink-900">
                    <div>
                      <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{n.label}</p>
                      <p className="text-xs text-ink-400 mt-0.5">{n.desc}</p>
                    </div>
                    <Toggle checked={notifs[n.key]} onChange={(v) => handleToggleNotif(n.key, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'privacy' && (
            <div>
              <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5 flex items-center gap-2"><LuLock className="text-primary-500" /> Privacy & Security</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <button className="btn-primary">Change Password</button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl2 bg-ink-50 dark:bg-ink-900">
                <div>
                  <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">Two-Factor Authentication</p>
                  <p className="text-xs text-ink-400 mt-0.5">Add an extra layer of security to your account.</p>
                </div>
                <Toggle checked={false} onChange={() => {}} />
              </div>
            </div>
          )}

          {tab === 'appearance' && (
            <div>
              <h3 className="font-display font-bold text-ink-900 dark:text-white mb-5">Appearance</h3>
              <p className="text-sm text-ink-500 mb-4">Choose how SocialOpti looks to you.</p>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {['light', 'dark'].map((th) => (
                  <button
                    key={th}
                    onClick={() => setTheme(th)}
                    className={`p-4 rounded-xl2 border-2 text-center transition ${theme === th ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-ink-200 dark:border-ink-600'}`}
                  >
                    <div className={`w-full h-16 rounded-xl2 mb-3 ${th === 'light' ? 'bg-white border border-ink-200' : 'bg-ink-900 border border-ink-700'}`} />
                    <span className="text-sm font-semibold text-ink-700 dark:text-ink-200 capitalize">{th}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
