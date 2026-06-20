/**
 * Canopy — Global State Store (Zustand)
 * Single source of truth for all application state.
 * Persists to localStorage for offline support, syncs with Firestore.
 */

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import {
  ActivityLog,
  Activity,
  calculateEmissions,
  buildActivityLabel,
  calculateCanopyScore,
  sumEmissionsInWindow,
  startOfWeek,
} from "./carbon-engine"
import {
  ChallengeProgress,
  ChallengeId,
  CHALLENGE_DEFINITIONS,
  computeChallengeProgress,
  isChallengeCompleted,
} from "./challenge-engine"
import { UnlockedAchievement } from "./achievement-engine"
import { computeStreak, StreakData } from "./streak-engine"
import {
  getEcosystemState,
  EcosystemState,
  EcosystemInput,
  checkCelebrations,
  CelebrationTrigger,
} from "./ecosystem-engine"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface UserState {
  uid: string | null
  displayName: string
  email: string
  photoURL: string | null
  isAuthenticated: boolean
}

export interface CanopyState {
  // User
  user: UserState

  // Activity logs
  logs: ActivityLog[]

  // Challenges
  activeChallenges: ChallengeProgress[]

  // Achievements
  unlockedAchievements: UnlockedAchievement[]

  // Pending celebrations queue
  celebrationQueue: CelebrationTrigger[]

  // Derived (computed on action, stored for quick access)
  weeklyEmissions: number
  prevWeekEmissions: number
  canopyScore: number
  streak: StreakData
  ecosystemState: EcosystemState

  // AI Coach conversation
  coachMessages: CoachMessage[]
  coachLoading: boolean

  // UI state
  logModalOpen: boolean
  logModalCategory: Activity["category"] | null
}

export interface CoachMessage {
  id: string
  role: "user" | "coach"
  content: string
  timestamp: number
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
export interface CanopyActions {
  // Auth
  setUser: (user: UserState) => void
  clearUser: () => void

  // Activity logging
  logActivity: (activity: Activity) => ActivityLog
  removeLog: (id: string) => void
  setLogs: (logs: ActivityLog[]) => void

  // Challenges
  startChallenge: (id: ChallengeId) => void
  syncChallengeProgress: () => void
  setActiveChallenges: (challenges: ChallengeProgress[]) => void

  // Achievements
  unlockAchievement: (id: string) => void
  setAchievements: (achievements: UnlockedAchievement[]) => void

  // Celebrations
  pushCelebration: (trigger: CelebrationTrigger) => void
  dismissCelebration: () => void

  // AI Coach
  addCoachMessage: (msg: Omit<CoachMessage, "id" | "timestamp">) => void
  setCoachLoading: (loading: boolean) => void
  clearCoachHistory: () => void

  // UI
  openLogModal: (category: Activity["category"]) => void
  closeLogModal: () => void

  // Internal: recompute derived state
  recompute: () => void
}

// ---------------------------------------------------------------------------
// Default ecosystem input when there's no data
// ---------------------------------------------------------------------------
const defaultEcosystemInput: EcosystemInput = {
  canopyScore: 72,
  completedChallenges: 0,
  totalChallenges: 0,
  streakDays: 0,
  weeklyEmissions: 24.7,
  previousWeekEmissions: 28,
  totalLogsCount: 0,
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useCanopyStore = create<CanopyState & CanopyActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        uid: null,
        displayName: "Aanya Rao",
        email: "aanya@canopy.eco",
        photoURL: null,
        isAuthenticated: false,
      },
      logs: [],
      activeChallenges: [],
      unlockedAchievements: [],
      celebrationQueue: [],
      weeklyEmissions: 0,
      prevWeekEmissions: 0,
      canopyScore: 72,
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastLogDate: null,
        streakDots: Array(7).fill(false),
      },
      ecosystemState: getEcosystemState(defaultEcosystemInput),
      coachMessages: [],
      coachLoading: false,
      logModalOpen: false,
      logModalCategory: null,

      // ---------------------------------------------------------------------------
      // Auth
      // ---------------------------------------------------------------------------
      setUser: (user) => set({ user }),
      clearUser: () =>
        set({
          user: { uid: null, displayName: "", email: "", photoURL: null, isAuthenticated: false },
          logs: [],
          activeChallenges: [],
          unlockedAchievements: [],
        }),

      // ---------------------------------------------------------------------------
      // Activity Logging
      // ---------------------------------------------------------------------------
      logActivity: (activity) => {
        const emissions = calculateEmissions(activity)
        const label = buildActivityLabel(activity)
        const log: ActivityLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          activity,
          emissions,
          timestamp: Date.now(),
          label,
        }

        const prev = get()
        const newLogs = [log, ...prev.logs]

        set({ logs: newLogs })
        get().syncChallengeProgress()
        get().recompute()

        // Check celebrations
        const prevInput = buildEcosystemInput(prev.logs, prev.activeChallenges, prev.streak.currentStreak, prev.weeklyEmissions, prev.prevWeekEmissions)
        const nextState = get()
        const nextInput = buildEcosystemInput(nextState.logs, nextState.activeChallenges, nextState.streak.currentStreak, nextState.weeklyEmissions, nextState.prevWeekEmissions)
        const triggers = checkCelebrations(prevInput, nextInput)
        triggers.forEach((t) => get().pushCelebration(t))

        return log
      },

      removeLog: (id) => {
        set((s) => ({ logs: s.logs.filter((l) => l.id !== id) }))
        get().recompute()
      },

      setLogs: (logs) => {
        set({ logs })
        get().syncChallengeProgress()
        get().recompute()
      },

      // ---------------------------------------------------------------------------
      // Challenges
      // ---------------------------------------------------------------------------
      startChallenge: (id) => {
        const existing = get().activeChallenges.find((c) => c.challengeId === id)
        if (existing) return
        const newChallenge: ChallengeProgress = {
          challengeId: id,
          startedAt: Date.now(),
          current: 0,
          isCompleted: false,
        }
        set((s) => ({ activeChallenges: [...s.activeChallenges, newChallenge] }))
        get().syncChallengeProgress()
      },

      syncChallengeProgress: () => {
        const { logs, activeChallenges } = get()
        const weekStart = startOfWeek()

        const updated = activeChallenges.map((c) => {
          const current = computeChallengeProgress(c.challengeId, logs, Math.max(c.startedAt, weekStart))
          const completed = isChallengeCompleted(c.challengeId, current)
          return {
            ...c,
            current,
            isCompleted: completed,
            completedAt: completed && !c.isCompleted ? Date.now() : c.completedAt,
          }
        })

        set({ activeChallenges: updated })
        get().recompute()
      },

      setActiveChallenges: (challenges) => {
        set({ activeChallenges: challenges })
        get().recompute()
      },

      // ---------------------------------------------------------------------------
      // Achievements
      // ---------------------------------------------------------------------------
      unlockAchievement: (id) => {
        const already = get().unlockedAchievements.some((a) => a.achievementId === id)
        if (already) return
        const achievement: UnlockedAchievement = { achievementId: id as any, unlockedAt: Date.now() }
        set((s) => ({ unlockedAchievements: [...s.unlockedAchievements, achievement] }))
        get().pushCelebration({
          event: "achievement_unlocked",
          message: `Achievement unlocked!`,
          emoji: "🏅",
        })
      },

      setAchievements: (achievements) => set({ unlockedAchievements: achievements }),

      // ---------------------------------------------------------------------------
      // Celebrations
      // ---------------------------------------------------------------------------
      pushCelebration: (trigger) =>
        set((s) => ({ celebrationQueue: [...s.celebrationQueue, trigger] })),

      dismissCelebration: () =>
        set((s) => ({ celebrationQueue: s.celebrationQueue.slice(1) })),

      // ---------------------------------------------------------------------------
      // AI Coach
      // ---------------------------------------------------------------------------
      addCoachMessage: (msg) => {
        const message: CoachMessage = {
          ...msg,
          id: `msg_${Date.now()}`,
          timestamp: Date.now(),
        }
        set((s) => ({ coachMessages: [...s.coachMessages, message] }))
      },

      setCoachLoading: (loading) => set({ coachLoading: loading }),

      clearCoachHistory: () => set({ coachMessages: [] }),

      // ---------------------------------------------------------------------------
      // UI
      // ---------------------------------------------------------------------------
      openLogModal: (category) => set({ logModalOpen: true, logModalCategory: category }),
      closeLogModal: () => set({ logModalOpen: false, logModalCategory: null }),

      // ---------------------------------------------------------------------------
      // Recompute all derived state
      // ---------------------------------------------------------------------------
      recompute: () => {
        const { logs, activeChallenges } = get()
        const now = Date.now()
        const weekStart = startOfWeek()
        const prevWeekStart = weekStart - 7 * 86_400_000

        const weekly = Math.round(
          logs
            .filter((l) => l.timestamp >= weekStart && l.timestamp <= now)
            .reduce((a, l) => a + l.emissions, 0) * 100
        ) / 100

        const prevWeekly = Math.round(
          logs
            .filter((l) => l.timestamp >= prevWeekStart && l.timestamp < weekStart)
            .reduce((a, l) => a + l.emissions, 0) * 100
        ) / 100

        const score = calculateCanopyScore(weekly)
        const streak = computeStreak(logs)

        const completedCount = activeChallenges.filter((c) => c.isCompleted).length
        const ecoInput: EcosystemInput = buildEcosystemInput(logs, activeChallenges, streak.currentStreak, weekly, prevWeekly)

        set({
          weeklyEmissions: weekly,
          prevWeekEmissions: prevWeekly,
          canopyScore: score,
          streak,
          ecosystemState: getEcosystemState(ecoInput),
        })
      },
    }),
    {
      name: "canopy-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        user: state.user,
        logs: state.logs,
        activeChallenges: state.activeChallenges,
        unlockedAchievements: state.unlockedAchievements,
        coachMessages: state.coachMessages,
      }),
    }
  )
)

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function buildEcosystemInput(
  logs: ActivityLog[],
  challenges: ChallengeProgress[],
  streakDays: number,
  weeklyEmissions: number,
  previousWeekEmissions: number
): EcosystemInput {
  return {
    canopyScore: calculateCanopyScore(weeklyEmissions),
    completedChallenges: challenges.filter((c) => c.isCompleted).length,
    totalChallenges: challenges.length,
    streakDays,
    weeklyEmissions,
    previousWeekEmissions,
    totalLogsCount: logs.length,
  }
}

// Convenience selectors
export const selectWeeklyEmissions = (s: CanopyState) => s.weeklyEmissions
export const selectCanopyScore = (s: CanopyState) => s.canopyScore
export const selectEcosystem = (s: CanopyState) => s.ecosystemState
export const selectStreak = (s: CanopyState) => s.streak
export const selectUser = (s: CanopyState) => s.user
export const selectCelebration = (s: CanopyState) => s.celebrationQueue[0] ?? null
