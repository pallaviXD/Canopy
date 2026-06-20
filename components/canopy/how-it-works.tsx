import { ClipboardList, BarChart3, Sprout } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Log your activities",
    body: "Add your travel, food, energy and shopping in seconds. Canopy turns everyday choices into clear carbon data.",
    color: "from-emerald-500/15 to-emerald-500/5",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    icon: BarChart3,
    step: "02",
    title: "Understand your impact",
    body: "See exactly where your emissions come from with elegant insights and benchmarks against real averages.",
    color: "from-teal-500/15 to-teal-500/5",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-100",
  },
  {
    icon: Sprout,
    step: "03",
    title: "Grow your ecosystem",
    body: "Every greener decision nurtures your tree. Watch leaves, flowers and birds return as your footprint shrinks.",
    color: "from-green-500/15 to-green-500/5",
    iconColor: "text-green-700",
    iconBg: "bg-green-100",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
          How it works
        </span>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Three simple steps to a lighter footprint
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Canopy makes sustainable living simple, measurable, and rewarding — in just minutes a day.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.step}
            className={`group relative rounded-3xl bg-gradient-to-br ${s.color} border border-emerald-100 p-7 shadow-[0_4px_24px_rgba(5,150,105,0.07)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(5,150,105,0.14)]`}
          >
            {/* Step number watermark */}
            <span className="absolute right-6 top-5 text-5xl font-black text-emerald-100 select-none">
              {s.step}
            </span>

            <div className="flex items-start justify-between">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.iconBg} ${s.iconColor} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                <s.icon className="h-7 w-7" />
              </span>
            </div>

            <h3 className="mt-6 text-xl font-bold text-foreground">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>

            {/* Connector arrow */}
            {i < steps.length - 1 && (
              <span className="absolute -right-3.5 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-lg md:flex z-10">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
