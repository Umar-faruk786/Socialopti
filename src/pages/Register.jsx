import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LuMail, LuLock, LuEye, LuEyeOff, LuUser } from 'react-icons/lu'
import { FaGoogle, FaGithub } from 'react-icons/fa6'
import { HiSparkles } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register({ name, email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-ink-900 transition-colors duration-200">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-primary relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl2 bg-white/20 backdrop-blur flex items-center justify-center">
            <HiSparkles className="text-white text-xl" />
          </div>
          <span className="font-display font-extrabold text-white text-xl">SocialOpti</span>
        </div>

        <div className="relative z-10">
          <h1 className="font-display font-extrabold text-white text-4xl xl:text-5xl leading-tight mb-4">
            Join thousands of<br />smart creators.
          </h1>
          <p className="text-white/80 text-base max-w-md">
            Create your account and start predicting engagement before you hit publish.
          </p>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-10 w-full max-w-sm h-56 rounded-xl4 bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center"
          >
            <p className="text-white/60 text-sm">AI insights illustration</p>
          </motion.div>
        </div>
        <p className="relative z-10 text-white/50 text-xs">© 2026 SocialOpti. Final Year Project.</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl2 bg-gradient-primary flex items-center justify-center">
              <HiSparkles className="text-white text-xl" />
            </div>
            <span className="font-display font-extrabold text-ink-900 dark:text-white text-xl">SocialOpti</span>
          </div>

          <h2 className="font-display font-extrabold text-ink-900 dark:text-white text-2xl mb-1">Create Account ✨</h2>
          <p className="text-ink-500 text-sm mb-8">Start your free journey today</p>

          {error && (
            <div className="p-3 mb-4 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Full Name</label>
              <div className="relative">
                <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Email Address</label>
              <div className="relative">
                <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5 block">Password</label>
              <div className="relative">
                <LuLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="input-field pl-11 pr-11"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400">
                  {showPass ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
              <input type="checkbox" required className="mt-0.5 rounded border-ink-300 text-primary-600 focus:ring-primary-400" />
              I agree to the Terms of Service and Privacy Policy
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-ink-200 dark:bg-ink-700" />
            <span className="text-xs text-ink-400">or continue with</span>
            <div className="flex-1 h-px bg-ink-200 dark:bg-ink-700" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { register({ name: 'Google User', email: 'user@google.com', password: 'password123' }); navigate('/dashboard', { replace: true }) }} className="btn-secondary py-2.5"><FaGoogle /> Google</button>
            <button onClick={() => { register({ name: 'GitHub User', email: 'user@github.com', password: 'password123' }); navigate('/dashboard', { replace: true }) }} className="btn-secondary py-2.5"><FaGithub /> GitHub</button>
          </div>

          <p className="text-center text-sm text-ink-500 dark:text-ink-400 mt-8">
            Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
