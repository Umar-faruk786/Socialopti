import { LuArrowUpRight } from 'react-icons/lu'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import Card from './Card'

const cardThemes = {
  purple: {
    iconBg: 'bg-[#ECE7FE] text-[#633DF2]',
    stroke: '#633DF2',
    fillId: 'purpleGrad',
    stopColor: '#633DF2',
  },
  green: {
    iconBg: 'bg-[#E8F8F0] text-[#10B981]',
    stroke: '#10B981',
    fillId: 'greenGrad',
    stopColor: '#10B981',
  },
  blue: {
    iconBg: 'bg-[#EBF3FE] text-[#3B82F6]',
    stroke: '#3B82F6',
    fillId: 'blueGrad',
    stopColor: '#3B82F6',
  },
  orange: {
    iconBg: 'bg-[#FEF4E8] text-[#F59E0B]',
    stroke: '#F59E0B',
    fillId: 'orangeGrad',
    stopColor: '#F59E0B',
  },
  pink: {
    iconBg: 'bg-[#FDECF4] text-[#EC4899]',
    stroke: '#EC4899',
    fillId: 'pinkGrad',
    stopColor: '#EC4899',
  },
}

export default function StatCard({ label, value, delta, icon: Icon, color = 'purple', spark = [], delay = 0 }) {
  const theme = cardThemes[color] || cardThemes.purple
  const data = spark.map((v, i) => ({ i, v }))

  return (
    <Card hover delay={delay} className="!p-4 overflow-hidden relative flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg}`}>
            <Icon className="text-xl" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-[#64748B] dark:text-ink-400 truncate">{label}</p>
            <p className="text-2xl font-bold text-[#1E1B39] dark:text-white font-display leading-tight">{value}</p>
          </div>
        </div>

        {/* Delta */}
        <p className="flex items-center gap-1 text-[11px] font-semibold text-[#10B981] mt-1">
          <LuArrowUpRight className="text-xs" />
          <span>{delta}</span>
          <span className="text-ink-400 font-normal">vs last week</span>
        </p>
      </div>

      {/* Sparkline Wave Chart */}
      <div className="h-12 -mx-4 -mb-4 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={theme.fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.stopColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.stopColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={theme.stroke}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${theme.fillId})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

