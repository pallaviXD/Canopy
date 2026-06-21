"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/canopy/auth-guard"
import {
  Plane, Utensils, Zap, ShoppingBag, Bot,
  Bus, Salad, Bell, Flame, TrendingDown,
  ArrowUpRight, Sparkles, ChevronRight, Leaf,
} from "lucide-react"
import { DashboardSidebar } from "@/components/canopy/dashboard/sidebar"
import { EcosystemSvg } from "@/components/canopy/ecosystem-svg"
import { LogActivityModal } from "@/components/canopy/log-activity-modal"
import { CelebrationOverlay } from "@/components/canopy/celebration-overlay"
import { ChallengesPanel } from "@/components/canopy/dashboard/challenges-panel"
import { InsightsPanel } from "@/components/canopy/dashboard/insights-panel"
import { ProfilePanel } from "@/components/canopy/dashboard/profile-panel"
import { CoachPanel } from "@/components/canopy/dashboard/coach-panel"
import { useCanopyStore, selectEcosystem, selectCanopyScore, selectStreak } from "@/lib/store"
import { Activity } from "@/lib/carbon-engine"
import { CHALLENGE_DEFINITIONS, ChallengeId } from "@/lib/challenge-engine"
import { buildWeeklySummary } from "@/lib/analytics-engine"

const QUICK_ACTIONS: Array<{ label: string; icon: typeof Plane; tint: string; category: Activity["category"] }> = [
  { label: "Log Travel",   icon: Plane,       tint: "bg-sky/10 text-sky",        category: "travel"   },
  { label: "Log Food",     icon: Utensils,    tint: "bg-primary/10 text-forest", category: "food"     },
  { label: "Log Energy",   icon: Zap,         tint: "bg-sun/15 text-[#b45309]",  category: "energy"   },
  { label: "Log Shopping", icon: ShoppingBag, tint: "bg-forest/10 text-forest",  category: "shopping" },
]

const DEFAULT_CHALLENGES: ChallengeId[] = ["public_transit_twice", "skip_meat_3_meals"]

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}

function DashboardContent() {
  const [active, setActive] = useState("Dashboard")
  const { startChallenge, recompute } = useCanopyStore()
  const streakData = useCanopyStore(selectStreak)

  useEffect(() => {
    DEFAULT_CHALLENGES.forEach((id) => startChallenge(id))
    recompute()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar active={active} onSelect={setActive} />
      <LogActivityModal />
      <CelebrationOverlay />

      <div className="flex-1 overflow-hidden">
        <TopBar active={active} streakDays={streakData.currentStreak} />
        <main className="p-4 sm:p-8">
          {active === "Dashboard"  && <DashboardMain />}
          {active === "Challenges" && <ChallengesPanel />}
          {active === "Insights"   && <InsightsPanel />}
          {active === "AI Coach"   && <CoachPanel />}
          {active === "Profile"    && <ProfilePanel />}
        </main>
      </div>
    </div>
  )
}

// ── End of DashboardContent ──

function TopBar({ active, streakDays }: { active: string; streakDays: number }) {
  const openLogModal = useCanopyStore((s) => s.openLogModal)
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:px-8">
      <div>
        <p className="text-sm text-muted-foreground">
          {active === "Dashboard" ? "Good evening" : active}
        </p>
        <h1 className="text-xl font-bold tracking-tight">
          {active === "Dashboard" ? "Your ecosystem" : active}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {streakDays > 0 && (
          <span className="hidden items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-forest sm:flex">
            <Flame className="h-4 w-4 text-primary" /> {streakDays}-day streak
          </span>
        )}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          onClick={() => openLogModal("travel")}
          className="flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
        >
          Log Activity
        </button>
      </div>
    </header>
  )
}

function DashboardMain() {
  const { logs, weeklyEmissions, prevWeekEmissions, activeChallenges, openLogModal } = useCanopyStore()
  const ecosystemState = useCanopyStore(selectEcosystem)
  const canopyScore    = useCanopyStore(selectCanopyScore)

  const trend = prevWeekEmissions > 0
    ? Math.round(((weeklyEmissions - prevWeekEmissions) / prevWeekEmissions) * 100)
    : 0
  const trendLabel = trend < 0 ? `↓ ${Math.abs(trend)}%` : trend > 0 ? `↑ ${trend}%` : "—"

  const weekSummary = buildWeeklySummary(logs)
  const recentLogs  = logs.slice(0, 4)

  const ICON_MAP: Record<Activity["category"], typeof Bus> = {
    travel: Bus, food: Salad, energy: Zap, shopping: ShoppingBag,
  }

  const displayChallenges = activeChallenges
    .filter((c) => !c.isCompleted)
    .slice(0, 2)
    .map((c) => ({
      ...c,
      def: CHALLENGE_DEFINITIONS[c.challengeId],
      pct: Math.min(100, Math.round((c.current / CHALLENGE_DEFINITIONS[c.challengeId].target) * 100)),
    }))

  return (
    <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
      {/* ── Left column ── */}
      <div className="flex flex-col gap-6">

        {/* ══ ECOSYSTEM HERO — dominant centerpiece ══ */}
        <section className={`relative overflow-hidden rounded-[2rem] border border-border/80 bg-gradient-to-b ${ecosystemState.skyTint} to-card transition-all duration-1000`}
          style={{ boxShadow: "0 8px 40px rgba(22,101,52,0.10), inset 0 1px 0 rgba(255,255,255,0.6)" }}
        >
          {/* Ambient glow blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="absolute -top-16 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-leaf/20 blur-[60px]" />
            <div className="absolute bottom-20 left-1/4 h-52 w-52 rounded-full bg-primary/10 blur-[50px]" />
            <div className="absolute bottom-20 right-1/4 h-52 w-52 rounded-full bg-sky/8 blur-[50px]" />
          </div>

          {/* Stage label */}
          <div className="relative flex justify-center pt-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-1.5 text-sm font-semibold text-forest shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {ecosystemState.label}
            </span>
          </div>

          {/* ── THE ECOSYSTEM — takes up ~48% of card height ── */}
          <div className="relative mx-auto w-full max-w-[440px] px-4"
            style={{ aspectRatio: "1/0.95" }}
          >
            {/* Pulse ring behind tree */}
            <div className="absolute left-1/2 top-[45%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/12 animate-pulse-ring" />
            <EcosystemSvg state={ecosystemState} animated
              className="drop-shadow-[0_16px_40px_rgba(22,101,52,0.18)]"
            />
          </div>

          {/* Description */}
          <p className="relative mx-auto -mt-2 max-w-xs px-6 pb-4 text-center text-xs leading-relaxed text-muted-foreground">
            {ecosystemState.description}
          </p>

          {/* ── Stats strip ── */}
          <div className="relative mx-4 mb-5 grid grid-cols-3 gap-3 sm:mx-6">
            <StatCard value={String(canopyScore)} label="Canopy Score"
              sub={trend !== 0 ? `${trendLabel} this week` : "Keep logging"} accent />
            <StatCard value={weeklyEmissions > 0 ? `${weeklyEmissions.toFixed(1)}kg` : "0 kg"}
              label="Weekly CO₂" sub="emitted" />
            <StatCard value={trendLabel !== "—" ? trendLabel : "Log more"}
              label="Trend" sub="vs last week" />
          </div>
        </section>
        {/* Quick actions */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Quick actions</h2>
            <span className="text-sm text-muted-foreground">Log in seconds</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => openLogModal(a.category)}
                className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-5 text-center shadow-[0_4px_16px_rgba(5,150,105,0.06)] card-interactive btn-press"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${a.tint}`}>
                  <a.icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold">{a.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Recent activity</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-forest hover:underline">
              View all <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {recentLogs.length === 0 ? (
            <EmptyState onLog={() => openLogModal("travel")} />
          ) : (
            <ul className="flex flex-col gap-2">
              {recentLogs.map((r) => {
                const IconComp = ICON_MAP[r.activity.category] ?? Leaf
                const isLow = r.emissions < 1.5
                return (
                  <li key={r.id} className="flex items-center gap-4 rounded-2xl px-2 py-2.5 hover:bg-secondary/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-forest">
                      <IconComp className="h-5 w-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold">{r.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.timestamp).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isLow ? "bg-primary/10 text-forest" : "bg-destructive/10 text-destructive"
                    }`}>
                      {r.emissions} kg
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      {/* ── Right column ── */}
      <div className="flex flex-col gap-6">

        {/* AI tip */}
        <section className="rounded-3xl border border-border bg-forest p-6 text-white shadow-[0_20px_50px_rgba(22,101,52,0.25)]">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15">
              <Bot className="h-5 w-5 text-leaf" />
            </span>
            <p className="font-bold">AI Coach tip</p>
            <Sparkles className="ml-auto h-4 w-4 text-leaf" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/90">
            {weeklyEmissions > 30
              ? `Your emissions are above average (${weeklyEmissions.toFixed(1)}kg). Try swapping one car trip for metro to save ~3kg CO₂.`
              : weeklyEmissions > 0
              ? `Great work! Your ${weeklyEmissions.toFixed(1)}kg is below the Indian average. Keep logging to see your trend.`
              : "Start logging your activities and I'll give you personalized tips to reduce your footprint."}
          </p>
        </section>

        {/* Active challenges */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">Active challenges</h2>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-forest">
              {displayChallenges.length} active
            </span>
          </div>
          {displayChallenges.length === 0 ? (
            <p className="text-sm text-muted-foreground">All caught up! Go to Challenges for more.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {displayChallenges.map((c) => (
                <div key={c.challengeId} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-forest">
                      <Bus className="h-5 w-5" />
                    </span>
                    <p className="flex-1 text-sm font-semibold leading-snug">{c.def.title}</p>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${c.pct}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs font-medium text-muted-foreground">
                    <span>{c.current}/{c.def.target} {c.def.unit}</span>
                    <span>{c.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Weekly chart */}
        <WeeklyBarChart summary={weekSummary} />
      </div>
    </div>
  )
}

// ── Shared sub-components ──

function StatCard({ value, label, sub, accent }: { value: string; label: string; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-4 text-center backdrop-blur-sm card-interactive">
      <p className={`text-2xl font-bold sm:text-3xl ${accent ? "score-shimmer" : "text-foreground"}`}>{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-foreground/80">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

function EmptyState({ onLog }: { onLog: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
        <Leaf className="h-7 w-7 text-primary" />
      </span>
      <p className="text-sm font-semibold">No activities yet</p>
      <p className="text-xs text-muted-foreground">Log your first activity to start growing your ecosystem.</p>
      <button
        onClick={onLog}
        className="mt-1 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Log first activity
      </button>
    </div>
  )
}

function WeeklyBarChart({ summary }: { summary: ReturnType<typeof buildWeeklySummary> }) {
  const maxVal = Math.max(...summary.dailyTotals, 1)
  const trend  = summary.trend
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">This week</h2>
        {trend !== 0 && (
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            trend < 0 ? "bg-primary/10 text-forest" : "bg-destructive/10 text-destructive"
          }`}>
            <TrendingDown className="h-3.5 w-3.5" /> {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-5 flex items-end justify-between gap-2" style={{ height: "96px" }}>
        {summary.dailyTotals.map((v, i) => (
          <div key={i} className="flex flex-1 flex-col items-center justify-end">
            <div
              className={`w-full rounded-t-lg transition-all duration-500 ${i === 6 ? "bg-primary" : "bg-secondary"}`}
              style={{ height: `${(v / maxVal) * 80}px`, minHeight: v > 0 ? "4px" : "0" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between px-0.5 text-xs text-muted-foreground">
        {summary.dayLabels.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">You vs Indian avg</span>
        <span className={`flex items-center gap-1 font-semibold ${summary.vsIndian > 0 ? "text-forest" : "text-destructive"}`}>
          {Math.abs(summary.vsIndian)}% {summary.vsIndian > 0 ? "lower" : "higher"}
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </section>
  )
}
