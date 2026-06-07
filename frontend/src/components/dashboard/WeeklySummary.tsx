import { Dumbbell, Droplets, CheckCircle2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { WeeklySummary as WeeklySummaryData } from '@/types'

type Badge = { label: string; style: string }

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  accent: string
  textAccent?: string
  badge?: Badge
}

function StatCard({ icon: Icon, label, value, sub, accent, textAccent, badge }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 truncate">{label}</p>
        <p className={`text-xl font-bold leading-tight ${textAccent ?? 'text-gray-800'}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {badge && (
        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${badge.style}`}>
          {badge.label}
        </span>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  )
}

function proteinBadge(pct: number): Badge {
  if (pct >= 80) return { label: `${pct}%`, style: 'bg-green-100 text-green-700' }
  if (pct >= 50) return { label: `${pct}%`, style: 'bg-blue-100 text-blue-600' }
  return          { label: `${pct}%`, style: 'bg-gray-100 text-gray-500' }
}

function sodiumBadge(avg: number): Badge {
  if (avg < 5)  return { label: '良好', style: 'bg-sky-50 text-sky-600' }
  if (avg < 7)  return { label: '注意', style: 'bg-yellow-50 text-yellow-600' }
  return              { label: '超過', style: 'bg-red-50 text-red-500' }
}

type Props = {
  summary: WeeklySummaryData | null
  loading: boolean
}

function WeeklySummary({ summary, loading }: Props) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  const { total_protein_g, total_sodium_g, targets } = summary
  const weeklyTarget    = targets.weekly_protein_g
  const dailyTarget     = targets.daily_protein_g
  const sodiumMax       = targets.daily_sodium_g_max

  const totalProtein    = Math.round(total_protein_g * 10) / 10
  const avgDailyProtein = Math.round((total_protein_g / 7) * 10) / 10
  const avgDailySodium  = Math.round((total_sodium_g  / 7) * 100) / 100
  const proteinPct      = Math.round((total_protein_g / weeklyTarget) * 100)

  const sodiumAccent = avgDailySodium < 5
    ? 'bg-sky-400'
    : avgDailySodium < 7 ? 'bg-yellow-400' : 'bg-red-400'
  const sodiumText = avgDailySodium >= 7 ? 'text-red-500' : undefined

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatCard
        icon={Dumbbell}
        label="今週の総タンパク質"
        value={`${totalProtein}g`}
        sub={`週間目標 ${weeklyTarget}g`}
        accent="bg-green-500"
        badge={proteinBadge(proteinPct)}
      />
      <StatCard
        icon={CheckCircle2}
        label="1日平均タンパク質"
        value={`${avgDailyProtein}g`}
        sub={`目標 ${dailyTarget}g / 日`}
        accent="bg-emerald-500"
      />
      <StatCard
        icon={Droplets}
        label="1日平均塩分"
        value={`${avgDailySodium}g`}
        sub={`上限目標 ${sodiumMax}g / 日`}
        accent={sodiumAccent}
        textAccent={sodiumText}
        badge={sodiumBadge(avgDailySodium)}
      />
    </div>
  )
}

export default WeeklySummary
