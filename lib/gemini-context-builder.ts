/**
 * Canopy — Gemini Context Builder
 * Prepares structured prompts and context for the AI Coach.
 */

import { ActivityLog, emissionsByCategory, calculateCanopyScore } from "./carbon-engine"
import { ChallengeProgress, CHALLENGE_DEFINITIONS } from "./challenge-engine"
import { INDIAN_WEEKLY_AVERAGE, GLOBAL_WEEKLY_AVERAGE } from "./emission-factors"

export interface CoachContext {
  travelKg: number
  foodKg: number
  energyKg: number
  shoppingKg: number
  weeklyTotal: number
  canopyScore: number
  streakDays: number
  activeChallenges: Array<{ title: string; progress: number; target: number }>
  completedChallengesCount: number
  vsIndianAvg: number // %
  vsGlobalAvg: number // %
  trend: number // % change vs last week
}

export function buildCoachContext(
  logs: ActivityLog[],
  challenges: ChallengeProgress[],
  streakDays: number,
  weeklyEmissions: number,
  prevWeekEmissions: number
): CoachContext {
  const weekStart = Date.now() - 7 * 86_400_000
  const weekLogs = logs.filter((l) => l.timestamp >= weekStart)
  const by = emissionsByCategory(weekLogs)

  const total = weeklyEmissions
  const canopyScore = calculateCanopyScore(total)

  const vsIndianAvg = INDIAN_WEEKLY_AVERAGE > 0
    ? Math.round(((INDIAN_WEEKLY_AVERAGE - total) / INDIAN_WEEKLY_AVERAGE) * 100)
    : 0

  const vsGlobalAvg = GLOBAL_WEEKLY_AVERAGE > 0
    ? Math.round(((GLOBAL_WEEKLY_AVERAGE - total) / GLOBAL_WEEKLY_AVERAGE) * 100)
    : 0

  const trend = prevWeekEmissions > 0
    ? Math.round(((total - prevWeekEmissions) / prevWeekEmissions) * 100)
    : 0

  const activeChallenges = challenges
    .filter((c) => !c.isCompleted)
    .map((c) => {
      const def = CHALLENGE_DEFINITIONS[c.challengeId]
      return {
        title: def.title,
        progress: c.current,
        target: def.target,
      }
    })

  return {
    travelKg: by.travel,
    foodKg: by.food,
    energyKg: by.energy,
    shoppingKg: by.shopping,
    weeklyTotal: total,
    canopyScore,
    streakDays,
    activeChallenges,
    completedChallengesCount: challenges.filter((c) => c.isCompleted).length,
    vsIndianAvg,
    vsGlobalAvg,
    trend,
  }
}

export function buildSystemPrompt(): string {
  return `You are Canopy Coach, an empathetic, data-driven sustainability coach embedded inside the Canopy app. 
Your role is to help users reduce their carbon footprint through personalized, achievable guidance.

Guidelines:
- Always base advice on the user's ACTUAL emission data provided in the context
- Quantify CO₂ savings for every suggestion (e.g., "saving 3.4kg CO₂")
- Keep responses concise — 2-4 sentences max unless the user asks for detail
- Use an encouraging, non-preachy tone
- Suggest one specific action at a time
- Acknowledge progress and celebrate improvements
- Reference Indian context (Indian averages, local transit options, Indian food culture)
- Never shame or guilt — only positive reinforcement`
}

export function buildUserPrompt(context: CoachContext, userMessage: string): string {
  const trendText = context.trend < 0
    ? `↓ ${Math.abs(context.trend)}% improvement`
    : context.trend > 0
    ? `↑ ${context.trend}% increase`
    : "No change"

  const challengeText = context.activeChallenges.length > 0
    ? context.activeChallenges
        .map((c) => `  - ${c.title}: ${c.progress}/${c.target}`)
        .join("\n")
    : "  None active"

  return `## User's Carbon Data (This Week)

Travel: ${context.travelKg} kg CO₂
Food: ${context.foodKg} kg CO₂  
Energy: ${context.energyKg} kg CO₂
Shopping: ${context.shoppingKg} kg CO₂
Total: ${context.weeklyTotal} kg CO₂

Canopy Score: ${context.canopyScore}/100
Streak: ${context.streakDays} days
Trend vs last week: ${trendText}
vs Indian average: ${context.vsIndianAvg > 0 ? context.vsIndianAvg + "% better" : Math.abs(context.vsIndianAvg) + "% worse"}
vs Global average: ${context.vsGlobalAvg > 0 ? context.vsGlobalAvg + "% better" : Math.abs(context.vsGlobalAvg) + "% worse"}

Active Challenges:
${challengeText}

Completed challenges this month: ${context.completedChallengesCount}

## User's Question
${userMessage}`
}

/** Pre-built quick-start prompts for the suggestion chips */
export const QUICK_PROMPTS = [
  "How can I reduce my travel footprint?",
  "What greener groceries should I choose?",
  "How do I lower my energy bill and emissions?",
  "Suggest a weekend sustainability challenge for me.",
  "What's my biggest emission source and how do I fix it?",
  "How does my footprint compare to others in India?",
]

export function buildQuickPrompt(topic: string, context: CoachContext): string {
  // Enrich the quick prompt with data context
  switch (topic) {
    case "travel":
      return `My travel emissions this week are ${context.travelKg}kg CO₂. ${buildUserPrompt(context, "How can I specifically reduce my travel emissions? Give me 2 actionable steps.")}`
    case "food":
      return `My food emissions are ${context.foodKg}kg CO₂ this week. ${buildUserPrompt(context, "What specific food swaps would make the biggest difference for me?")}`
    case "energy":
      return `My energy emissions are ${context.energyKg}kg CO₂. ${buildUserPrompt(context, "Give me specific tips to reduce my electricity usage and emissions.")}`
    case "challenge":
      return buildUserPrompt(context, "Based on my data, what's the best challenge I should take on this week to have the most impact?")
    default:
      return buildUserPrompt(context, topic)
  }
}
