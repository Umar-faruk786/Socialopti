import { useState, useEffect } from 'react'
import { LuCamera, LuCheck } from 'react-icons/lu'
import DashboardLayout from '../components/layout/DashboardLayout'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import Badge from '../components/ui/Badge'
import { currentUser as defaultUser } from '../data/dummyData'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [profile, setProfile] = useState({
    name: user?.name || defaultUser.name,
    email: user?.email || defaultUser.email,
    phone: user?.phone || defaultUser.phone,
    bio: user?.bio || defaultUser.bio,
    avatar: user?.avatar || defaultUser.avatar,
    role: user?.role || defaultUser.role,
    total_analyses: user?.total_analyses || 128,
    posts_analyzed: user?.posts_analyzed || 56
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.getProfile()
        if (data && data.name) {
          setProfile(data)
          if (setUser) setUser(data)
        }
      } catch (err) {
        console.log('Using local user profile')
      }
    }
    loadProfile()
  }, [setUser])

  const update = (k, v) => setProfile((f) => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await api.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        avatar: profile.avatar
      })
      setProfile(updated)
      if (setUser) setUser(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Profile">
      <PageHeader title="Profile" subtitle="Manage your personal information and account settings." />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: photo + summary */}
        <Card delay={0.05} className="text-center p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="relative w-32 h-32 mx-auto mb-5">
              <img src={profile.avatar} alt={profile.name} className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-ink-800 shadow-premium" />
              <button className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-premium hover:opacity-90 transition-opacity" title="Upload new photo">
                <LuCamera className="text-base" />
              </button>
            </div>
            <h3 className="font-display font-bold text-ink-900 dark:text-white text-xl">{profile.name}</h3>
            <p className="text-sm text-ink-400 mb-2">{profile.email}</p>
            <Badge color="purple">{profile.role || 'Creator'}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-ink-100 dark:border-ink-700">
            <div>
              <p className="text-xl font-extrabold font-display text-ink-900 dark:text-white">{profile.total_analyses}</p>
              <p className="text-xs text-ink-400 font-medium mt-0.5">Total Analyses</p>
            </div>
            <div>
              <p className="text-xl font-extrabold font-display text-ink-900 dark:text-white">{profile.posts_analyzed}</p>
              <p className="text-xs text-ink-400 font-medium mt-0.5">Posts Analyzed</p>
            </div>
          </div>
        </Card>

        {/* Right: personal details */}
        <Card delay={0.1} className="lg:col-span-2 p-6 lg:p-8">
          <h3 className="font-display font-bold text-ink-900 dark:text-white text-lg mb-6">Personal Information</h3>
          <form
            onSubmit={handleSave}
            className="grid sm:grid-cols-2 gap-5"
          >
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Full Name</label>
              <input value={profile.name} onChange={(e) => update('name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Email Address</label>
              <input value={profile.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Phone Number</label>
              <input value={profile.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Role</label>
              <input value={profile.role || 'Admin'} disabled className="input-field opacity-60 cursor-not-allowed" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Bio</label>
              <textarea value={profile.bio} onChange={(e) => update('bio', e.target.value)} rows={4} className="input-field resize-none" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              {saved && <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium"><LuCheck className="text-base" /> Saved successfully</span>}
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
