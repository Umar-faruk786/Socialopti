const colorMap = {
  green: 'bg-accent-greenLight text-emerald-700',
  blue: 'bg-accent-blueLight text-blue-700',
  purple: 'bg-accent-purpleLight text-purple-700',
  orange: 'bg-accent-orangeLight text-amber-700',
  red: 'bg-accent-redLight text-red-700',
  teal: 'bg-accent-tealLight text-teal-700',
  gray: 'bg-ink-100 text-ink-600',
}

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={`badge ${colorMap[color] || colorMap.gray} ${className}`}>
      {children}
    </span>
  )
}
