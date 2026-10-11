import { FaInstagram, FaLinkedin, FaFacebook, FaXTwitter, FaYoutube, FaTiktok } from 'react-icons/fa6'

const icons = {
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
}

const colors = {
  instagram: 'text-pink-500',
  linkedin: 'text-blue-600',
  facebook: 'text-indigo-500',
  twitter: 'text-ink-900',
  youtube: 'text-red-500',
  tiktok: 'text-ink-900',
}

export default function PlatformIcon({ platform, className = '' }) {
  const key = platform?.toLowerCase().replace(/[^a-z]/g, '').replace('x', 'twitter') || ''
  const match = Object.keys(icons).find((k) => key.includes(k)) || (key.includes('twitter') || key === 'x' ? 'twitter' : null)
  const Icon = icons[match] || FaInstagram
  return <Icon className={`${colors[match] || 'text-ink-500'} ${className}`} />
}
