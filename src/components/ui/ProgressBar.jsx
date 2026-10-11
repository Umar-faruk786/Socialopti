export default function ProgressBar({ value = 0, color = 'bg-primary-500', height = 'h-2', showLabel = false, label }) {
  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-ink-600">{label}</span>
          {showLabel && <span className="text-xs font-bold text-ink-800">{value}%</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-ink-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
