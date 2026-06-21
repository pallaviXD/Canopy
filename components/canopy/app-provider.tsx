"use client"

/**
 * Canopy — App Provider
 * Runs on mount to:
 *  1. Init Firebase and subscribe to auth state changes
 *  2. Sync Firebase user to Zustand store
 *  3. Rehydrate derived state after SSR/localStorage hydration
 *  4. Check for new achievements whenever logs change
 */

import { useEffect, useRef } from "react"
import { useCanopyStore } from "@/lib/store"
import { getFirebaseApp } from "@/lib/firebase-config"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { checkAchievements } from "@/lib/achievement-engine"

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {
    logs,
    activeChallenges,
    streak,
    weeklyEmissions,
    unlockedAchievements,
    setUser,
    clearUser,
    recompute,
    unlockAchievement,
  } = useCanopyStore()

  const prevLogCount = useRef(logs.length)

  // ── Firebase auth state listener ──
  useEffect(() => {
    const app = getFirebaseApp()
    if (!app) return // Firebase not configured — dev mode

    const auth = getAuth(app)
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          displayName: user.displayName ?? "User",
          email: user.email ?? "",
          photoURL: user.photoURL,
          isAuthenticated: true,
        })
      } else {
        clearUser()
      }
    })
    return unsub
  }, [setUser, clearUser])

  // ── Recompute derived state on mount (after localStorage hydration) ──
  useEffect(() => {
    recompute()
  }, [recompute])

  // ── Achievement check whenever new logs are added ──
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

    newAchievements.forEach((id) => unlockAchievement(id))
  }, [logs.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
