import { Plane, Utensils, Zap, ShoppingBag, TrendingDown } from "lucide-react"
import { EcosystemSvg } from "@/components/canopy/ecosystem-svg"
import { getEcosystemState } from "@/lib/ecosystem-engine"

const previewEcoState = getEcosystemState({
  canopyScore: 72,
  completedChallenges: 2,
  totalChallenges: 4,
  streakDays: 5,
  weeklyEmissions: 24.7,
  previousWeekEmissions: 28,
  totalLogsCount: 15,
})

const categories = [
  { icon: Plane, label: "Travel", value: "12.8 kg", trend: "+4%", up: true },
  { icon: Utensils, label: "Food", value: "6.1 kg", trend: "-9%", up: false },
  { icon: Zap, label: "Energy", value: "3.9 kg", trend: "-3%", up: false },
  { icon: ShoppingBag, label: "Shopping", value: "1.9 kg", trend: "-14%", up: false },
]

export function DashboardPreview() {
  return (
    <section id="dashboard-preview" className="scroll-mt-24 bg-gradient-to-b from-background to-emerald-50/60 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Your dashboard
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Watch your forest come to life
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Your ecosystem sits at the heart of everything. The healthier your choices, the more it
            flourishes.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-[0_30px_80px_rgba(5,150,105,0.14)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Ecosystem */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-50 via-green-50/60 to-white p-6">
              <div className="pointer-events-none absolute -top-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl" />
              <div className="relative aspect-square w-full max-w-xs">
                <EcosystemSvg state={previewEcoState} animated />
              </div>
              <div className="mt-2 flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-emerald-700">72</p>
                  <p className="text-xs font-medium text-muted-foreground">Canopy Score</p>
                </div>
                <div className="h-10 w-px bg-emerald-100" />
                <div className="text-center">
                  <p className="text-4xl font-bold text-foreground">24.7<span className="text-lg">kg</span></p>
                  <p className="text-xs font-medium text-muted-foreground">Weekly CO₂</p>
                </div>
                <div className="h-10 w-px bg-emerald-100" />
                <div className="text-center">
                  <p className="flex items-center gap-1 text-4xl font-bold text-emerald-600">
                    <TrendingDown className="h-6 w-6" />12%
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">vs last week</p>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-muted-foreground">This week by category</p>
              {categories.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-4 rounded-3xl border border-emerald-50 bg-gradient-to-r from-emerald-50/50 to-white p-4 shadow-[0_2px_8px_rgba(5,150,105,0.05)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.value} CO₂</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      c.up
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {c.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
