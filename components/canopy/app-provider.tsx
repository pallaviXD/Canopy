"use client"

/**
 * Canopy — App Provider
 * Runs on mount to:
 *  1. Init Firebase and subscribe to auth state
 *  2. Rehydrate store after SSR (Zustand persist handles this automatically,
 *     but we need to trigger a recompute after hydration)
 *  3. Check for new achievements whenever logs change
 */

import { useEffect, useRef } from "react"
import { useCanopyStore } from "@/lib/store"
import { initFirebase, onAuthChange } from "@/lib/firebase-service"
import { checkAchievements } from "@/lib/achievement-engine"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {
    logs,
    activeChallenges,
    streak,
    weeklyEmissions,
    unlockedAchievements,
    setUser,
    recompute,
    unlockAchievement,
    pushCelebration,
  } = useCanopyStore()

  const prevLogCount = useRef(logs.length)

  // Firebase auth
  useEffect(() => {
    const app = initFirebase()
    if (!app) return

    const unsub = onAuthChange((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName ?? "User",
          email: user.email ?? "",
          photoURL: user.photoURL,
          isAuthenticated: true,
        })
      }
    })
    return unsub
  }, [setUser])

  // Recompute on mount (after hydration from localStorage)
  useEffect(() => {
    recompute()
  }, [recompute])

  // Achievement check whenever new logs are added
  useEffect(() => {
    if (logs.length <= prevLogCount.current) {
      prevLogCount.current = logs.length
      return
    }
    prevLogCount.current = logs.length

    const newAchievements = checkAchievements({
      logs,
      streakDays: streak.currentStreak,
      completedChallenges: activeChallenges.filter((c) => c.isCompleted),
      unlockedAchievements,
      weeklyEmissions,
      monthlyEmissions: weeklyEmissions * 4,
      firstWeekEmissions: 0,
    })

    newAchievements.forEach((id) => {
      unlockAchievement(id)
    })
  }, [logs.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
