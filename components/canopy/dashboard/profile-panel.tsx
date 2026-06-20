"use client"

import { User, Trophy, Flame, Leaf, TrendingDown, Star, LogIn } from "lucide-react"
import { useCanopyStore, selectCanopyScore, selectStreak } from "@/lib/store"
import { ACHIEVEMENTS, RARITY_COLORS } from "@/lib/achievement-engine"
import { getStreakMilestones } from "@/lib/streak-engine"
import { signInWithGoogle } from "@/lib/firebase-service"

export function ProfilePanel() {
  const user               = useCanopyStore((s) => s.user)
  const score              = useCanopyStore(selectCanopyScore)
  const streak             = useCanopyStore(selectStreak)
  const logs               = useCanopyStore((s) => s.logs)
  const weeklyEmissions    = useCanopyStore((s) => s.weeklyEmissions)
  const unlockedAchievements = useCanopyStore((s) => s.unlockedAchievements)
  const setUser            = useCanopyStore((s) => s.setUser)
  const clearUser          = useCanopyStore((s) => s.clearUser)

  const milestones = getStreakMilestones(streak.currentStreak)
  const initials   = user.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function handleGoogleSignIn() {
    const firebaseUser = await signInWithGoogle()
    if (firebaseUser) {
      setUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName ?? "User",
        email: firebaseUser.email ?? "",
        photoURL: firebaseUser.photoURL,
        isAuthenticated: true,
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile card */}
      <section className="rounded-3xl border border-border bg-gradient-to-br from-forest/5 to-card p-8">
        <div className="flex items-start gap-5">
          <div className="relative">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-primary/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest text-2xl font-bold text-white ring-4 ring-primary/20">
                {initials || <User className="h-8 w-8" />}
              </div>
            )}
            {user.isAuthenticated && (
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary ring-2 ring-card">
                <Leaf className="h-3 w-3 text-white" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold">{user.displayName || "Guest"}</h2>
            <p className="text-sm text-muted-foreground">{user.email || "Not signed in"}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-forest">
                <Flame className="h-3.5 w-3.5 text-primary" />
                {streak.currentStreak} day streak
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-forest">
                <Leaf className="h-3.5 w-3.5 text-primary" />
                {logs.length} logs
              </span>
            </div>
          </div>
          {!user.isAuthenticated ? (
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
          ) : (
            <button
              onClick={clearUser}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary"
            >
              Sign out
            </button>
          )}
        </div>
      </section>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ProfileStat icon={<Star className="h-4 w-4 text-[#b45309]" />}  label="Canopy Score"    value={score} />
        <ProfileStat icon={<Flame className="h-4 w-4 text-primary" />}   label="Best Streak"     value={`${streak.longestStreak}d`} />
        <ProfileStat icon={<TrendingDown className="h-4 w-4 text-sky" />} label="This Week"      value={`${weeklyEmissions.toFixed(1)}kg`} />
        <ProfileStat icon={<Trophy className="h-4 w-4 text-forest" />}   label="Achievements"   value={unlockedAchievements.length} />
      </div>

      {/* Streak milestones */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
        <h3 className="mb-4 font-bold">Streak milestones</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {milestones.map((m) => (
            <div
              key={m.days}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${
                m.achieved
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-background opacity-50"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-sm font-bold">{m.days} days</span>
              <span className="text-xs text-muted-foreground">{m.reward}</span>
              {m.achieved && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-forest">
                  Unlocked
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
        <h3 className="mb-1 font-bold">Achievements</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {unlockedAchievements.length} / {Object.keys(ACHIEVEMENTS).length} unlocked
        </p>

        {/* Progress bar */}
        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${(unlockedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.values(ACHIEVEMENTS).map((ach) => {
            const unlocked = unlockedAchievements.some((u) => u.achievementId === ach.id)
            const colorClass = RARITY_COLORS[ach.rarity]
            return (
              <div
                key={ach.id}
                className={`relative flex flex-col gap-2 rounded-2xl border p-4 transition-all ${
                  unlocked ? colorClass : "border-border bg-background opacity-40 grayscale"
                }`}
              >
                <span className="text-2xl">{ach.emoji}</span>
                <p className="text-sm font-bold leading-snug">{ach.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{ach.description}</p>
                <span className={`mt-auto w-fit rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                  unlocked ? "" : "bg-secondary text-muted-foreground"
                }`}>
                  {ach.rarity}
                </span>
                {unlocked && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Leaf className="h-3 w-3 text-white" />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function ProfileStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <div className="mb-1 flex justify-center">{icon}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
