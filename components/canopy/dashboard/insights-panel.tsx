"use client"

import { TrendingDown, TrendingUp, Globe2, Calendar, Flame, Target } from "lucide-react"
import { useCanopyStore, selectCanopyScore } from "@/lib/store"
import { buildWeeklySummary, buildMonthlySummary } from "@/lib/analytics-engine"
import { INDIAN_WEEKLY_AVERAGE, GLOBAL_WEEKLY_AVERAGE } from "@/lib/emission-factors"

export function InsightsPanel() {
  const logs     = useCanopyStore((s) => s.logs)
  const streak   = useCanopyStore((s) => s.streak)
  const score    = useCanopyStore(selectCanopyScore)
  const weekly   = buildWeeklySummary(logs)
  const monthly  = buildMonthlySummary(logs)

  const maxDaily = Math.max(...weekly.dailyTotals, 1)
  const maxWeekly = Math.max(...monthly.weeklyTotals, 1)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Insights</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your carbon footprint over time — every data point tells a story.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Canopy Score"    value={score}                    sub="/ 100"                   accent />
        <KpiCard label="Weekly Total"    value={`${weekly.total.toFixed(1)}kg`}    sub="CO₂"                     />
        <KpiCard label="Best Day"        value={`${weekly.bestDay.value}kg`}       sub={weekly.bestDay.label}    />
        <KpiCard label="Streak"          value={`${streak.currentStreak}d`}        sub="consecutive"             />
      </div>

      {/* Weekly trend chart */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold">Weekly trend</p>
            <p className="text-sm text-muted-foreground">Daily CO₂ emissions (kg)</p>
          </div>
          <TrendBadge value={weekly.trend} />
        </div>

        {/* SVG line chart */}
        <WeeklyLineChart data={weekly.dailyTotals} labels={weekly.dayLabels} max={maxDaily} />

        {/* Day labels */}
        <div className="mt-2 flex justify-between px-1 text-xs text-muted-foreground">
          {weekly.dayLabels.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        {/* Best / worst callouts */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-primary/5 p-3">
            <p className="text-xs font-semibold text-muted-foreground">Best day</p>
            <p className="mt-0.5 font-bold text-forest">
              {weekly.bestDay.label} — {weekly.bestDay.value} kg
            </p>
          </div>
          <div className="rounded-2xl bg-destructive/5 p-3">
            <p className="text-xs font-semibold text-muted-foreground">Highest day</p>
            <p className="mt-0.5 font-bold text-destructive">
              {weekly.worstDay.label} — {weekly.worstDay.value} kg
            </p>
          </div>
        </div>
      </section>

      {/* Category donut + breakdown */}
      <div className="grid gap-6 sm:grid-cols-2">
        <CategoryBreakdown byCategory={weekly.byCategory} total={weekly.total} />
        <MonthlyImprovement weeklyTotals={monthly.weeklyTotals} weekLabels={monthly.weekLabels} maxWeekly={maxWeekly} />
      </div>

      {/* Comparison */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
        <div className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-sky" />
          <p className="font-bold">How you compare</p>
        </div>
        <p className="text-sm text-muted-foreground">Weekly CO₂ vs averages</p>
        <div className="mt-5 space-y-4">
          <CompareBar label="You"            value={weekly.total}          max={GLOBAL_WEEKLY_AVERAGE} color="#22c55e" highlight />
          <CompareBar label="Indian average" value={INDIAN_WEEKLY_AVERAGE} max={GLOBAL_WEEKLY_AVERAGE} color="#0ea5e9" />
          <CompareBar label="Global average" value={GLOBAL_WEEKLY_AVERAGE} max={GLOBAL_WEEKLY_AVERAGE} color="#94a3b8" />
        </div>
        {weekly.vsIndian > 0 ? (
          <p className="mt-5 rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-forest">
            You&apos;re emitting {weekly.vsIndian}% less than the Indian average.
          </p>
        ) : (
          <p className="mt-5 rounded-2xl bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            You&apos;re emitting {Math.abs(weekly.vsIndian)}% more than the Indian average. Try some challenges!
          </p>
        )}
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function KpiCard({ label, value, sub, accent }: { label: string; value: string | number; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <p className={`text-2xl font-bold ${accent ? "text-forest" : ""}`}>{value}</p>
      <p className="text-xs font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

function TrendBadge({ value }: { value: number }) {
  if (value === 0) return null
  const improving = value < 0
  return (
    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
      improving ? "bg-primary/10 text-forest" : "bg-destructive/10 text-destructive"
    }`}>
      {improving ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
      {Math.abs(value)}% {improving ? "lower" : "higher"}
    </span>
  )
}

function WeeklyLineChart({ data, labels, max }: { data: number[]; labels: string[]; max: number }) {
  const w = 280
  const h = 100
  const safeMax = max || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - (v / safeMax) * h * 0.9
    return [x, y] as const
  })
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ")
  const area = `${line} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h + 4}`} className="mt-6 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="insightArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#insightArea)" />
      <path d={line} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={i === data.length - 1 ? 5 : 3.5} fill="#fff" stroke="#22c55e" strokeWidth="2" />
          {data[i] > 0 && (
            <text x={p[0]} y={p[1] - 8} textAnchor="middle" fontSize="8" fill="#6b7280">
              {data[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

function CategoryBreakdown({ byCategory, total }: { byCategory: Record<string, number>; total: number }) {
  const safeTotal = total || 1
  const cats = [
    { key: "travel",   label: "Travel",   color: "#0ea5e9" },
    { key: "food",     label: "Food",     color: "#22c55e" },
    { key: "energy",   label: "Energy",   color: "#166534" },
    { key: "shopping", label: "Shopping", color: "#fbbf24" },
  ]

  // Donut
  const radius = 52
  const circ   = 2 * Math.PI * radius
  let offset   = 0

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
      <p className="font-bold">Category breakdown</p>
      <p className="text-sm text-muted-foreground">Share of your footprint</p>
      <div className="mt-4 flex items-center gap-5">
        <svg viewBox="0 0 140 140" className="h-32 w-32 -rotate-90">
          {cats.map((c) => {
            const pct = byCategory[c.key] / safeTotal
            const len = pct * circ
            const seg = (
              <circle
                key={c.key}
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={c.color}
                strokeWidth="16"
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            )
            offset += len
            return seg
          })}
          {total === 0 && (
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#e7eef0" strokeWidth="16" />
          )}
        </svg>
        <ul className="flex-1 space-y-2">
          {cats.map((c) => {
            const pct = Math.round((byCategory[c.key] / safeTotal) * 100)
            return (
              <li key={c.key} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                <span className="text-muted-foreground">{c.label}</span>
                <span className="ml-auto font-semibold">{byCategory[c.key].toFixed(1)} kg</span>
                <span className="text-muted-foreground">({pct}%)</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function MonthlyImprovement({ weeklyTotals, weekLabels, maxWeekly }: { weeklyTotals: number[]; weekLabels: string[]; maxWeekly: number }) {
  const safeMax = maxWeekly || 1
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
      <p className="font-bold">Monthly view</p>
      <p className="text-sm text-muted-foreground">Weekly totals this month</p>
      <div className="mt-6 flex h-32 items-end justify-between gap-3">
        {weeklyTotals.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">{v > 0 ? `${v.toFixed(0)}` : ""}</span>
            <div
              className="w-full max-w-10 rounded-t-xl transition-all duration-500"
              style={{
                height: `${(v / safeMax) * 90}px`,
                minHeight: v > 0 ? "4px" : "0",
                background: `linear-gradient(to top, #166534, #4ade80)`,
                opacity: v > 0 ? 1 : 0.15,
              }}
            />
            <span className="text-xs text-muted-foreground">{weekLabels[i]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function CompareBar({ label, value, max, color, highlight }: {
  label: string; value: number; max: number; color: string; highlight?: boolean
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className={highlight ? "font-bold text-forest" : "text-muted-foreground"}>{label}</span>
        <span className="font-semibold">{value > 0 ? `${value.toFixed(1)} kg` : "No data yet"}</span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }}
        />
      </div>
    </div>
  )
}
