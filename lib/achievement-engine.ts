/**
 * Canopy — Achievement Engine
 * Badge definitions and unlock logic.
 */

import { ActivityLog, emissionsByCategory } from "./carbon-engine"
import { ChallengeProgress } from "./challenge-engine"

export type AchievementId =
  | "first_log"
  | "streak_7"
  | "streak_30"
  | "plant_based_week"
  | "transit_champion"
  | "low_carbon_month"
  | "eco_warrior"
  | "carbon_crusher"
  | "green_commuter"
  | "mindful_shopper"

export interface AchievementDefinition {
  id: AchievementId
  title: string
  description: string
  emoji: string
  rarity: "common" | "rare" | "epic" | "legendary"
  scoreBonus: number
}

export interface UnlockedAchievement {
  achievementId: AchievementId
  unlockedAt: number
}

export const ACHIEVEMENTS: Record<AchievementId, AchievementDefinition> = {
  first_log: {
    id: "first_log",
    title: "First Step",
    description: "Logged your first activity. Every forest starts with a single seed.",
    emoji: "🌱",
    rarity: "common",
    scoreBonus: 5,
  },
  streak_7: {
    id: "streak_7",
    title: "7-Day Streak",
    description: "7 consecutive days of logging. Consistency is your superpower.",
    emoji: "🔥",
    rarity: "common",
    scoreBonus: 10,
  },
  streak_30: {
    id: "streak_30",
    title: "30-Day Streak",
    description: "A full month of daily logging. You are an environmental champion.",
    emoji: "🌳",
    rarity: "legendary",
    scoreBonus: 30,
  },
  plant_based_week: {
    id: "plant_based_week",
    title: "Plant-Based Week",
    description: "Ate plant-based for an entire week. Your carbon footprint thanks you.",
    emoji: "🥗",
    rarity: "rare",
    scoreBonus: 15,
  },
  transit_champion: {
    id: "transit_champion",
    title: "Transit Champion",
    description: "Used public transit 10+ times in a month. Cities need more of you.",
    emoji: "🚇",
    rarity: "rare",
    scoreBonus: 12,
  },
  low_carbon_month: {
    id: "low_carbon_month",
    title: "Low Carbon Month",
    description: "Monthly emissions 20% below Indian average. Incredible.",
    emoji: "🏆",
    rarity: "epic",
    scoreBonus: 20,
  },
  eco_warrior: {
    id: "eco_warrior",
    title: "Eco Warrior",
    description: "Completed 5 challenges. You're not just tracking impact — you're creating it.",
    emoji: "⚡",
    rarity: "epic",
    scoreBonus: 25,
  },
  carbon_crusher: {
    id: "carbon_crusher",
    title: "Carbon Crusher",
    description: "Reduced weekly emissions by 30% compared to your first week.",
    emoji: "💪",
    rarity: "rare",
    scoreBonus: 18,
  },
  green_commuter: {
    id: "green_commuter",
    title: "Green Commuter",
    description: "Travel emissions below 5kg for an entire week.",
    emoji: "🚲",
    rarity: "common",
    scoreBonus: 8,
  },
  mindful_shopper: {
    id: "mindful_shopper",
    title: "Mindful Shopper",
    description: "Zero shopping emissions for 14 days.",
    emoji: "🛍️",
    rarity: "rare",
    scoreBonus: 12,
  },
}

export interface AchievementCheckInput {
  logs: ActivityLog[]
  streakDays: number
  completedChallenges: ChallengeProgress[]
  unlockedAchievements: UnlockedAchievement[]
  weeklyEmissions: number
  monthlyEmissions: number
  firstWeekEmissions: number
}

export function checkAchievements(input: AchievementCheckInput): AchievementId[] {
  const {
    logs,
    streakDays,
    completedChallenges,
    unlockedAchievements,
    weeklyEmissions,
    monthlyEmissions,
    firstWeekEmissions,
  } = input

  const alreadyUnlocked = new Set(unlockedAchievements.map((u) => u.achievementId))
  const newAchievements: AchievementId[] = []

  function maybeUnlock(id: AchievementId, condition: boolean) {
    if (condition && !alreadyUnlocked.has(id)) {
      newAchievements.push(id)
    }
  }

  maybeUnlock("first_log", logs.length >= 1)
  maybeUnlock("streak_7", streakDays >= 7)
  maybeUnlock("streak_30", streakDays >= 30)

  // Plant-based week: 21 vegan/veg meals in 7 days
  const recentFoodLogs = logs.filter(
    (l) =>
      l.activity.category === "food" &&
      l.timestamp >= Date.now() - 7 * 86_400_000
  )
  const plantMeals = recentFoodLogs.filter(
    (l) => l.activity.category === "food" && (l.activity.type === "vegan" || l.activity.type === "vegetarian")
  ).length
  maybeUnlock("plant_based_week", plantMeals >= 21)

  // Transit champion: 10+ transit trips in last 30 days
  const recentTransit = logs.filter(
    (l) =>
      l.activity.category === "travel" &&
      l.timestamp >= Date.now() - 30 * 86_400_000 &&
      (l.activity.mode === "metro" || l.activity.mode === "bus")
  ).length
  maybeUnlock("transit_champion", recentTransit >= 10)

  // Low carbon month
  const INDIAN_MONTHLY_AVG = 34.3 * 4.33
  maybeUnlock("low_carbon_month", monthlyEmissions < INDIAN_MONTHLY_AVG * 0.8)

  // Eco warrior: 5 completed challenges
  maybeUnlock("eco_warrior", completedChallenges.length >= 5)

  // Carbon crusher: 30% reduction from first week
  if (firstWeekEmissions > 0) {
    maybeUnlock("carbon_crusher", weeklyEmissions <= firstWeekEmissions * 0.7)
  }

  // Green commuter: travel < 5kg this week
  const breakdown = emissionsByCategory(
    logs.filter((l) => l.timestamp >= Date.now() - 7 * 86_400_000)
  )
  maybeUnlock("green_commuter", breakdown.travel < 5)

  // Mindful shopper: 0 shopping in last 14 days
  const recentShopping = logs.filter(
    (l) =>
      l.activity.category === "shopping" &&
      l.timestamp >= Date.now() - 14 * 86_400_000
  ).length
  maybeUnlock("mindful_shopper", recentShopping === 0 && logs.length >= 10)

  return newAchievements
}

export const RARITY_COLORS: Record<AchievementDefinition["rarity"], string> = {
  common: "bg-secondary text-forest border-border",
  rare: "bg-sky/10 text-sky border-sky/20",
  epic: "bg-primary/10 text-forest border-primary/20",
  legendary: "bg-sun/10 text-[#b45309] border-sun/20",
}
