/**
 * Canopy — Streak Engine
 * Tracks consecutive days logged and milestone rewards.
 */

import { ActivityLog, startOfDay } from "./carbon-engine"

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastLogDate: string | null // ISO date string
  streakDots: boolean[]      // last 7 days — true = logged
}

export function computeStreak(logs: ActivityLog[]): StreakData {
  if (logs.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: null,
      streakDots: Array(7).fill(false),
    }
  }

  // Get unique logged days sorted descending
  const loggedDays = Array.from(
    new Set(
      logs.map((l) => {
        const d = new Date(l.timestamp)
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
    )
  ).sort((a, b) => b - a)

  const today = startOfDay()
  const yesterday = today - 86_400_000

  // Current streak: count consecutive days back from today or yesterday
  let streak = 0
  let checkDay = loggedDays[0] === today || loggedDays[0] === yesterday ? loggedDays[0] : null

  if (checkDay !== null) {
    for (const day of loggedDays) {
      if (day === checkDay) {
        streak++
        checkDay -= 86_400_000
      } else {
        break
      }
    }
  }

  // Longest streak
  let longest = 0
  let current = 1
  const sortedAsc = [...loggedDays].sort((a, b) => a - b)
  for (let i = 1; i < sortedAsc.length; i++) {
    if (sortedAsc[i] - sortedAsc[i - 1] === 86_400_000) {
      current++
    } else {
      longest = Math.max(longest, current)
      current = 1
    }
  }
  longest = Math.max(longest, current)

  // Last 7 days dots
  const streakDots = Array.from({ length: 7 }, (_, i) => {
    const day = today - (6 - i) * 86_400_000
    return loggedDays.includes(day)
  })

  const lastLogDate =
    loggedDays.length > 0
      ? new Date(loggedDays[0]).toISOString().split("T")[0]
      : null

  return {
    currentStreak: streak,
    longestStreak: longest,
    lastLogDate,
    streakDots,
  }
}

export interface StreakMilestone {
  days: number
  reward: string
  emoji: string
  achieved: boolean
}

export function getStreakMilestones(currentStreak: number): StreakMilestone[] {
  const milestones = [
    { days: 3,  reward: "Small ecosystem growth",  emoji: "🌿" },
    { days: 7,  reward: "New flowers bloom",        emoji: "🌸" },
    { days: 14, reward: "Birds appear",             emoji: "🐦" },
    { days: 30, reward: "Special ecosystem upgrade", emoji: "🌳" },
  ]
  return milestones.map((m) => ({ ...m, achieved: currentStreak >= m.days }))
}

export function getNextMilestone(currentStreak: number): StreakMilestone | null {
  const all = getStreakMilestones(currentStreak)
  return all.find((m) => !m.achieved) ?? null
}
