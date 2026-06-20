/**
 * Canopy — Ecosystem Engine
 * Determines the ecosystem growth stage and visual state
 * based on user score, streaks, and challenge completions.
 */

export type EcosystemStage =
  | 1 // Bare Soil
  | 2 // Small Sapling
  | 3 // Young Tree
  | 4 // Healthy Tree
  | 5 // Large Tree
  | 6 // Forest Tree
  | 7 // Flourishing Ecosystem

export interface EcosystemState {
  stage: EcosystemStage
  label: string
  description: string
  /** 0–100, drives SVG layer rendering */
  health: number
  /** Are birds visible? */
  hasBirds: boolean
  /** Are butterflies visible? */
  hasButterflies: boolean
  /** Are flowers blooming? */
  hasFlowers: boolean
  /** Is the sun bright? */
  brightSun: boolean
  /** Cloud cover 0 (none) to 1 (heavy) */
  cloudCover: number
  /** Leaf density 0–1 */
  leafDensity: number
  /** Background sky tint class */
  skyTint: string
  /** Is this a special milestone stage? */
  isMilestone: boolean
}

export interface EcosystemInput {
  canopyScore: number        // 0–100
  completedChallenges: number
  totalChallenges: number
  streakDays: number
  weeklyEmissions: number    // kg
  previousWeekEmissions: number // kg
  totalLogsCount: number
}

const STAGE_THRESHOLDS: Array<{ min: number; stage: EcosystemStage; label: string; description: string }> = [
  { min: 0,  stage: 1, label: "Bare Soil",           description: "Your journey begins. Start logging to plant your first seed." },
  { min: 10, stage: 2, label: "Small Sapling",        description: "A tiny green sprout appears. Keep growing!" },
  { min: 25, stage: 3, label: "Young Tree",            description: "Your tree is finding its roots. Consistency is key." },
  { min: 40, stage: 4, label: "Healthy Tree",          description: "Strong and growing. Your choices are making a difference." },
  { min: 55, stage: 5, label: "Large Tree",            description: "A magnificent tree shelters life beneath its canopy." },
  { min: 72, stage: 6, label: "Forest Tree",           description: "A towering forest giant. Birds nest in your branches." },
  { min: 88, stage: 7, label: "Flourishing Ecosystem", description: "A thriving ecosystem. Nature is celebrating your impact." },
]

/**
 * Compute a single ecosystem score (0–100) from all inputs.
 * Weights: canopy score 50%, challenge completion 20%, streak 15%, trend 15%
 */
export function computeEcosystemScore(input: EcosystemInput): number {
  const { canopyScore, completedChallenges, totalChallenges, streakDays, weeklyEmissions, previousWeekEmissions, totalLogsCount } = input

  // Challenge completion ratio (0–1)
  const challengeRatio = totalChallenges > 0 ? completedChallenges / totalChallenges : 0

  // Streak bonus: caps at 30 days = 1.0
  const streakScore = Math.min(streakDays / 30, 1)

  // Trend: 1.0 if reducing, 0 if same, negative if increasing
  const trendScore = previousWeekEmissions > 0
    ? Math.min(1, Math.max(-0.5, (previousWeekEmissions - weeklyEmissions) / previousWeekEmissions))
    : 0.5

  // Consistency bonus: first 10 logs
  const consistencyBonus = Math.min(totalLogsCount / 10, 1) * 5

  const raw =
    canopyScore * 0.5 +
    challengeRatio * 20 +
    streakScore * 15 +
    trendScore * 15 +
    consistencyBonus

  return Math.round(Math.min(100, Math.max(0, raw)))
}

/** Derive the full ecosystem visual state */
export function getEcosystemState(input: EcosystemInput): EcosystemState {
  const ecoScore = computeEcosystemScore(input)

  // Find stage
  let stageData = STAGE_THRESHOLDS[0]
  for (const t of STAGE_THRESHOLDS) {
    if (ecoScore >= t.min) stageData = t
  }

  const { stage, label, description } = stageData

  // Health maps to SVG rendering (0–100)
  const health = ecoScore

  // Visual features unlock at score thresholds
  const hasFlowers    = ecoScore >= 40 || input.streakDays >= 7
  const hasBirds      = ecoScore >= 55 || input.streakDays >= 14
  const hasButterflies = ecoScore >= 72 || input.completedChallenges >= 3
  const brightSun     = ecoScore >= 60
  const cloudCover    = Math.max(0, 1 - ecoScore / 60)
  const leafDensity   = Math.min(1, ecoScore / 55)

  // Sky tint classes based on score
  let skyTint = "from-gray-200/40 via-secondary/30"
  if (ecoScore >= 80) skyTint = "from-sky/20 via-secondary/40"
  else if (ecoScore >= 60) skyTint = "from-sky/15 via-secondary/35"
  else if (ecoScore >= 40) skyTint = "from-sky/10 via-secondary/50"

  const isMilestone = stage === 7 || (stage > 1 && ecoScore >= STAGE_THRESHOLDS[stage - 1].min)

  return {
    stage,
    label,
    description,
    health,
    hasBirds,
    hasButterflies,
    hasFlowers,
    brightSun,
    cloudCover,
    leafDensity,
    skyTint,
    isMilestone,
  }
}

/** Which celebration should trigger? */
export type CelebrationEvent =
  | "score_improved"
  | "challenge_completed"
  | "streak_milestone"
  | "ecosystem_upgrade"
  | "first_log"
  | "achievement_unlocked"

export interface CelebrationTrigger {
  event: CelebrationEvent
  message: string
  emoji: string
}

export function checkCelebrations(
  prev: EcosystemInput,
  next: EcosystemInput
): CelebrationTrigger[] {
  const triggers: CelebrationTrigger[] = []

  const prevStage = computeStage(computeEcosystemScore(prev))
  const nextStage = computeStage(computeEcosystemScore(next))

  if (nextStage > prevStage) {
    triggers.push({
      event: "ecosystem_upgrade",
      message: `Your ecosystem reached ${STAGE_THRESHOLDS.find(t => t.stage === nextStage)?.label}!`,
      emoji: "🌿",
    })
  }

  if (next.completedChallenges > prev.completedChallenges) {
    triggers.push({
      event: "challenge_completed",
      message: "Challenge complete! Your tree is thriving.",
      emoji: "🏆",
    })
  }

  const streakMilestones = [3, 7, 14, 30]
  for (const m of streakMilestones) {
    if (prev.streakDays < m && next.streakDays >= m) {
      triggers.push({
        event: "streak_milestone",
        message: `${m}-day streak! ${m === 30 ? "🎉 Incredible dedication!" : "Keep it up!"}`,
        emoji: m === 30 ? "🌳" : "🔥",
      })
    }
  }

  if (prev.totalLogsCount === 0 && next.totalLogsCount === 1) {
    triggers.push({ event: "first_log", message: "First activity logged! Your journey begins.", emoji: "🌱" })
  }

  const prevScore = computeCanopyScoreFromInput(prev)
  const nextScore = computeCanopyScoreFromInput(next)
  if (nextScore > prevScore + 2) {
    triggers.push({
      event: "score_improved",
      message: `Canopy Score improved to ${nextScore}!`,
      emoji: "⬆️",
    })
  }

  return triggers
}

function computeStage(ecoScore: number): EcosystemStage {
  let stage: EcosystemStage = 1
  for (const t of STAGE_THRESHOLDS) {
    if (ecoScore >= t.min) stage = t.stage
  }
  return stage
}

function computeCanopyScoreFromInput(input: EcosystemInput): number {
  return input.canopyScore
}
