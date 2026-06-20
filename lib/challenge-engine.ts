/**
 * Canopy — Challenge Engine
 * Defines all challenges, tracks progress, and checks completion.
 */

import { ActivityLog } from "./carbon-engine"

export type ChallengeId =
  | "public_transit_twice"
  | "skip_meat_3_meals"
  | "buy_nothing_7_days"
  | "walk_under_2km"
  | "plant_based_day"

export interface ChallengeDefinition {
  id: ChallengeId
  title: string
  description: string
  target: number
  unit: string
  durationDays: number
  estimatedCO2Saved: number // kg
  reward: string
  icon: string // lucide icon name
  accentColor: string
  scoreBonus: number
}

export interface ChallengeProgress {
  challengeId: ChallengeId
  startedAt: number // unix ms
  current: number
  isCompleted: boolean
  completedAt?: number
}

export const CHALLENGE_DEFINITIONS: Record<ChallengeId, ChallengeDefinition> = {
  public_transit_twice: {
    id: "public_transit_twice",
    title: "Take Public Transit Twice",
    description: "Use metro or bus for at least 2 trips this week instead of your car.",
    target: 2,
    unit: "trips",
    durationDays: 7,
    estimatedCO2Saved: 3.4,
    reward: "+15 ecosystem points",
    icon: "Bus",
    accentColor: "sky",
    scoreBonus: 8,
  },
  skip_meat_3_meals: {
    id: "skip_meat_3_meals",
    title: "Skip Meat for 3 Meals",
    description: "Choose vegetarian or vegan for at least 3 meals this week.",
    target: 3,
    unit: "meals",
    durationDays: 7,
    estimatedCO2Saved: 2.1,
    reward: "+10 ecosystem points",
    icon: "Salad",
    accentColor: "primary",
    scoreBonus: 6,
  },
  buy_nothing_7_days: {
    id: "buy_nothing_7_days",
    title: "Buy Nothing New for 7 Days",
    description: "Avoid new purchases for an entire week. Reuse and repair instead.",
    target: 7,
    unit: "days",
    durationDays: 7,
    estimatedCO2Saved: 5.8,
    reward: "Rare blossom unlock",
    icon: "PackageX",
    accentColor: "forest",
    scoreBonus: 12,
  },
  walk_under_2km: {
    id: "walk_under_2km",
    title: "Walk Trips Under 2km",
    description: "Walk instead of driving for any trip that's 2km or less.",
    target: 3,
    unit: "trips",
    durationDays: 7,
    estimatedCO2Saved: 1.8,
    reward: "+8 ecosystem points",
    icon: "Footprints",
    accentColor: "primary",
    scoreBonus: 5,
  },
  plant_based_day: {
    id: "plant_based_day",
    title: "Eat One Plant-Based Day",
    description: "Have a fully plant-based diet for at least one day this week.",
    target: 1,
    unit: "day",
    durationDays: 7,
    estimatedCO2Saved: 2.8,
    reward: "+12 ecosystem points",
    icon: "Leaf",
    accentColor: "forest",
    scoreBonus: 8,
  },
}

/** Auto-calculate challenge progress from activity logs */
export function computeChallengeProgress(
  challengeId: ChallengeId,
  logs: ActivityLog[],
  windowStart: number
): number {
  const windowLogs = logs.filter((l) => l.timestamp >= windowStart)

  switch (challengeId) {
    case "public_transit_twice":
      return windowLogs.filter(
        (l) =>
          l.activity.category === "travel" &&
          (l.activity.mode === "metro" || l.activity.mode === "bus")
      ).length

    case "skip_meat_3_meals":
      return windowLogs.filter(
        (l) =>
          l.activity.category === "food" &&
          (l.activity.type === "vegetarian" || l.activity.type === "vegan")
      ).length

    case "buy_nothing_7_days": {
      // Count unique days in window with no shopping logs
      const now = Date.now()
      let cleanDays = 0
      for (let i = 0; i < 7; i++) {
        const dayStart = windowStart + i * 86_400_000
        const dayEnd = dayStart + 86_400_000
        if (dayEnd > now) break
        const hasShopping = windowLogs.some(
          (l) => l.timestamp >= dayStart && l.timestamp < dayEnd && l.activity.category === "shopping"
        )
        if (!hasShopping) cleanDays++
      }
      return cleanDays
    }

    case "walk_under_2km":
      // User manually marks this — we count travel logs with 0 emissions (walked, not logged as vehicle)
      // In practice, look for very short metro/bus trips logged as ≤2km
      return windowLogs.filter(
        (l) =>
          l.activity.category === "travel" &&
          l.activity.mode === "metro" &&
          l.activity.distance <= 2
      ).length

    case "plant_based_day": {
      // Count distinct days where ALL food logs are vegan/vegetarian
      const dayMap = new Map<string, boolean>()
      for (const log of windowLogs) {
        if (log.activity.category !== "food") continue
        const key = new Date(log.timestamp).toDateString()
        const isPlant = log.activity.type === "vegan" || log.activity.type === "vegetarian"
        if (!dayMap.has(key)) {
          dayMap.set(key, isPlant)
        } else if (!isPlant) {
          dayMap.set(key, false)
        }
      }
      return Array.from(dayMap.values()).filter(Boolean).length
    }

    default:
      return 0
  }
}

export function getChallengeProgressPercent(challengeId: ChallengeId, current: number): number {
  const def = CHALLENGE_DEFINITIONS[challengeId]
  return Math.min(100, Math.round((current / def.target) * 100))
}

export function isChallengeCompleted(challengeId: ChallengeId, current: number): boolean {
  return current >= CHALLENGE_DEFINITIONS[challengeId].target
}

export function getDaysRemaining(startedAt: number, durationDays: number): number {
  const elapsed = (Date.now() - startedAt) / 86_400_000
  return Math.max(0, Math.ceil(durationDays - elapsed))
}
