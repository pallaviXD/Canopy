/**
 * Canopy — Analytics Engine
 * Derives weekly/monthly summaries, best/worst days, trends, and chart datasets.
 */

import {
  ActivityLog,
  emissionsByCategory,
  ActivityCategory,
  startOfDay,
  startOfWeek,
  startOfMonth,
  dailyTotals,
  vsIndianAverage,
  vsGlobalAverage,
} from "./carbon-engine"
import { INDIAN_WEEKLY_AVERAGE, GLOBAL_WEEKLY_AVERAGE } from "./emission-factors"

// Re-export for convenience
export { INDIAN_WEEKLY_AVERAGE, GLOBAL_WEEKLY_AVERAGE }

export interface WeeklySummary {
  total: number
  byCategory: Record<ActivityCategory, number>
  dailyTotals: number[]
  dayLabels: string[]
  bestDay: { label: string; value: number }
  worstDay: { label: string; value: number }
  vsIndian: number   // % difference (positive = better)
  vsGlobal: number
  trend: number      // % change vs prev week (negative = improved)
}

export interface MonthlySummary {
  total: number
  byCategory: Record<ActivityCategory, number>
  weeklyTotals: number[]
  weekLabels: string[]
  vsIndian: number
  vsGlobal: number
}

export interface InsightsSummary {
  weekly: WeeklySummary
  monthly: MonthlySummary
  improvementVsFirstWeek: number
  longestStreak: number
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const WEEK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4"]

export function buildWeeklySummary(logs: ActivityLog[]): WeeklySummary {
  const now = Date.now()
  const weekStart = startOfWeek()
  const prevWeekStart = weekStart - 7 * 86_400_000

  const thisWeekLogs = logs.filter((l) => l.timestamp >= weekStart && l.timestamp <= now)
  const prevWeekLogs = logs.filter((l) => l.timestamp >= prevWeekStart && l.timestamp < weekStart)

  const totals = dailyTotals(thisWeekLogs, 7)
  const total = round2(totals.reduce((a, b) => a + b, 0))
  const prevTotal = round2(prevWeekLogs.reduce((a, b) => a + b.emissions, 0))

  const byCategory = emissionsByCategory(thisWeekLogs)

  // Best and worst days (skip 0-emission days for worst)
  const dayWithValues = totals.map((v, i) => ({ label: DAY_LABELS[i], value: v }))
  const nonZeroDays = dayWithValues.filter((d) => d.value > 0)

  const bestDay = nonZeroDays.length
    ? nonZeroDays.reduce((a, b) => (a.value < b.value ? a : b))
    : { label: "—", value: 0 }

  const worstDay = dayWithValues.reduce((a, b) => (a.value > b.value ? a : b), {
    label: "—",
    value: 0,
  })

  const trend = prevTotal > 0 ? round2(((total - prevTotal) / prevTotal) * 100) : 0

  return {
    total,
    byCategory,
    dailyTotals: totals,
    dayLabels: DAY_LABELS,
    bestDay,
    worstDay,
    vsIndian: vsIndianAverage(total),
    vsGlobal: vsGlobalAverage(total),
    trend,
  }
}

export function buildMonthlySummary(logs: ActivityLog[]): MonthlySummary {
  const now = Date.now()
  const monthStart = startOfMonth()

  const thisMonthLogs = logs.filter((l) => l.timestamp >= monthStart && l.timestamp <= now)
  const total = round2(thisMonthLogs.reduce((a, b) => a + b.emissions, 0))
  const byCategory = emissionsByCategory(thisMonthLogs)

  // 4 weeks within the month
  const weeklyTotals = WEEK_LABELS.map((_, i) => {
    const wStart = monthStart + i * 7 * 86_400_000
    const wEnd = wStart + 7 * 86_400_000
    return round2(
      thisMonthLogs
        .filter((l) => l.timestamp >= wStart && l.timestamp < wEnd)
        .reduce((a, b) => a + b.emissions, 0)
    )
  })

  const monthlyIndianAvg = INDIAN_WEEKLY_AVERAGE * 4.33
  const monthlyGlobalAvg = GLOBAL_WEEKLY_AVERAGE * 4.33

  return {
    total,
    byCategory,
    weeklyTotals,
    weekLabels: WEEK_LABELS,
    vsIndian: round2(((monthlyIndianAvg - total) / monthlyIndianAvg) * 100),
    vsGlobal: round2(((monthlyGlobalAvg - total) / monthlyGlobalAvg) * 100),
  }
}

export function buildInsightsSummary(logs: ActivityLog[], streakDays: number): InsightsSummary {
  const weekly = buildWeeklySummary(logs)
  const monthly = buildMonthlySummary(logs)

  // Compare current week to first logged week
  const firstLog = logs[0]
  let improvementVsFirstWeek = 0
  if (firstLog) {
    const firstWeekStart = startOfWeek(new Date(firstLog.timestamp))
    const firstWeekLogs = logs.filter(
      (l) => l.timestamp >= firstWeekStart && l.timestamp < firstWeekStart + 7 * 86_400_000
    )
    const firstWeekTotal = round2(firstWeekLogs.reduce((a, b) => a + b.emissions, 0))
    if (firstWeekTotal > 0) {
      improvementVsFirstWeek = round2(((firstWeekTotal - weekly.total) / firstWeekTotal) * 100)
    }
  }

  return { weekly, monthly, improvementVsFirstWeek, longestStreak: streakDays }
}

/** Chart-ready dataset for the weekly trend line */
export function weeklyTrendChartData(logs: ActivityLog[]) {
  const summary = buildWeeklySummary(logs)
  return {
    labels: summary.dayLabels,
    values: summary.dailyTotals,
    max: Math.max(...summary.dailyTotals, 1),
    min: Math.min(...summary.dailyTotals.filter((v) => v > 0), 0),
  }
}

/** Chart-ready dataset for category donut */
export function categoryDonutData(logs: ActivityLog[]) {
  const weekStart = startOfWeek()
  const weekLogs = logs.filter((l) => l.timestamp >= weekStart)
  const by = emissionsByCategory(weekLogs)
  const total = Object.values(by).reduce((a, b) => a + b, 0) || 1

  return [
    { label: "Travel",   value: by.travel,   pct: round2((by.travel / total) * 100),   color: "#0ea5e9" },
    { label: "Food",     value: by.food,     pct: round2((by.food / total) * 100),     color: "#22c55e" },
    { label: "Energy",   value: by.energy,   pct: round2((by.energy / total) * 100),   color: "#166534" },
    { label: "Shopping", value: by.shopping, pct: round2((by.shopping / total) * 100), color: "#fbbf24" },
  ]
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
