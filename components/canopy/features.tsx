import { PencilLine, Bot, Trophy, LineChart, ShieldCheck, WifiOff } from "lucide-react"

const features = [
  {
    icon: PencilLine,
    title: "Activity Logging",
    body: "Capture travel, meals, energy and purchases in a few taps with smart, friendly inputs.",
    accent: "emerald",
  },
  {
    icon: Bot,
    title: "AI Coach",
    body: "Gemini-powered guidance that turns your data into personalized, achievable actions.",
    accent: "teal",
    highlight: true,
  },
  {
    icon: Trophy,
    title: "Weekly Challenges",
    body: "Collectible challenges that make lowering emissions feel like a game worth winning.",
    accent: "green",
  },
  {
    icon: LineChart,
    title: "Insights & Analytics",
    body: "Beautiful breakdowns of trends, categories and progress over weeks and months.",
    accent: "emerald",
  },
  {
    icon: ShieldCheck,
    title: "Google Sign-In",
    body: "Secure, one-tap access so you can start growing without the friction of forms.",
    accent: "teal",
  },
  {
    icon: WifiOff,
    title: "Offline Support",
    body: "Log on the go and sync later — your impact tracking never skips a beat.",
    accent: "green",
  },
]

const accentMap = {
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
    glow: "hover:shadow-[0_16px_48px_rgba(5,150,105,0.18)]",
    border: "hover:border-emerald-200",
  },
  teal: {
    badge: "bg-teal-50 text-teal-700 border-teal-100",
    icon: "bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
    glow: "hover:shadow-[0_16px_48px_rgba(20,184,166,0.18)]",
    border: "hover:border-teal-200",
  },
  green: {
    badge: "bg-green-50 text-green-700 border-green-100",
    icon: "bg-green-100 text-green-700 group-hover:bg-green-700 group-hover:text-white",
    glow: "hover:shadow-[0_16px_48px_rgba(22,163,74,0.15)]",
    border: "hover:border-green-200",
  },
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 bg-gradient-to-b from-emerald-50/60 to-background py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            Features
          </span>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to grow greener
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Thoughtfully designed tools that make sustainable living feel effortless and rewarding.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const a = accentMap[f.accent as keyof typeof accentMap]
            return (
              <div
                key={f.title}
                className={`group relative rounded-3xl border border-emerald-100/80 bg-white p-7 shadow-[0_4px_24px_rgba(5,150,105,0.05)] transition-all duration-300 hover:-translate-y-1 ${a.glow} ${a.border} ${f.highlight ? "ring-1 ring-emerald-200 shadow-[0_4px_24px_rgba(5,150,105,0.12)]" : ""}`}
              >
                {f.highlight && (
                  <span className={`absolute right-5 top-5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${a.badge}`}>
                    AI Powered
                  </span>
                )}
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${a.icon}`}>
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
