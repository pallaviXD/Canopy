"use client"

import { Bus, Salad, PackageX, Footprints, Leaf, Gift, Check, Clock, Zap } from "lucide-react"
import { useCanopyStore } from "@/lib/store"
import {
  CHALLENGE_DEFINITIONS,
  ChallengeId,
  getChallengeProgressPercent,
  getDaysRemaining,
} from "@/lib/challenge-engine"

const CHALLENGE_ICONS: Record<ChallengeId, React.ElementType> = {
  public_transit_twice: Bus,
  skip_meat_3_meals:    Salad,
  buy_nothing_7_days:   PackageX,
  walk_under_2km:       Footprints,
  plant_based_day:      Leaf,
}

const ALL_IDS: ChallengeId[] = [
  "public_transit_twice",
  "skip_meat_3_meals",
  "buy_nothing_7_days",
  "walk_under_2km",
  "plant_based_day",
]

const ACCENT_CLASSES: Record<string, { bg: string; bar: string; text: string }> = {
  sky:     { bg: "bg-sky/10 text-sky",       bar: "bg-sky",     text: "text-sky" },
  primary: { bg: "bg-primary/10 text-forest", bar: "bg-primary", text: "text-forest" },
  forest:  { bg: "bg-forest/10 text-forest",  bar: "bg-forest",  text: "text-forest" },
}

export function ChallengesPanel() {
  const { activeChallenges, startChallenge } = useCanopyStore()

  const activeMap = Object.fromEntries(activeChallenges.map((c) => [c.challengeId, c]))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Challenges</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete missions to grow your ecosystem and earn rewards.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          value={activeChallenges.filter((c) => c.isCompleted).length}
          label="Completed"
          icon={<Check className="h-4 w-4 text-primary" />}
        />
        <StatCard
          value={activeChallenges.filter((c) => !c.isCompleted).length}
          label="Active"
          icon={<Zap className="h-4 w-4 text-[#b45309]" />}
        />
        <StatCard
          value={`${activeChallenges.filter((c) => c.isCompleted).reduce((a, c) => a + CHALLENGE_DEFINITIONS[c.challengeId].estimatedCO2Saved, 0).toFixed(1)}kg`}
          label="CO₂ saved"
          icon={<Leaf className="h-4 w-4 text-forest" />}
        />
      </div>

      {/* Challenge cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {ALL_IDS.map((id) => {
          const def = CHALLENGE_DEFINITIONS[id]
          const progress = activeMap[id]
          const Icon = CHALLENGE_ICONS[id]
          const accent = ACCENT_CLASSES[def.accentColor] ?? ACCENT_CLASSES.primary
          const pct = progress ? getChallengeProgressPercent(id, progress.current) : 0
          const isActive = !!progress && !progress.isCompleted
          const isCompleted = progress?.isCompleted ?? false
          const daysLeft = progress ? getDaysRemaining(progress.startedAt, def.durationDays) : def.durationDays

          return (
            <div
              key={id}
              className={`flex flex-col rounded-3xl border p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)] transition-transform duration-200 hover:-translate-y-0.5 ${
                isCompleted
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bg}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-forest">
                    Saves {def.estimatedCO2Saved} kg CO₂
                  </span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-forest">
                      <Check className="h-3 w-3" /> Done!
                    </span>
                  )}
                </div>
              </div>

              <h3 className="mt-4 text-base font-bold leading-snug">{def.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{def.description}</p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>
                    {progress ? `${progress.current} / ${def.target} ${def.unit}` : `Target: ${def.target} ${def.unit}`}
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${accent.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Reward</span>
                <span className="ml-auto text-xs font-semibold text-forest">{def.reward}</span>
              </div>

              {isActive && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {daysLeft > 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} remaining` : "Ends today"}
                </div>
              )}

              {!isActive && !isCompleted && (
                <button
                  onClick={() => startChallenge(id)}
                  className="mt-4 flex h-10 w-full items-center justify-center rounded-full border border-primary bg-primary/5 text-sm font-semibold text-forest transition-colors hover:bg-primary/10"
                >
                  Start challenge
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({ value, label, icon }: { value: number | string; label: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <div className="mb-1 flex justify-center">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
