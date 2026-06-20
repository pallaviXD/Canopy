import { Bus, Salad, PackageX, Gift } from "lucide-react"

const challenges = [
  {
    icon: Bus,
    title: "Take Public Transit Twice",
    savings: "3.4 kg CO₂",
    progress: 50,
    reward: "+15 ecosystem pts",
    color: "#7aaef0",
  },
  {
    icon: Salad,
    title: "Skip Meat for 3 Meals",
    savings: "2.1 kg CO₂",
    progress: 66,
    reward: "+10 ecosystem pts",
    color: "#4a80d4",
  },
  {
    icon: PackageX,
    title: "Buy Nothing New for 7 Days",
    savings: "5.8 kg CO₂",
    progress: 28,
    reward: "Rare blossom unlock",
    color: "#98bbf0",
  },
]

export function Challenges() {
  return (
    <section id="challenges" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-sky">Challenges</p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Collect challenges, grow your impact
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Gamified, bite-sized missions that reward every greener choice with new life for your tree.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {challenges.map((c) => (
          <div
            key={c.title}
            className="group flex flex-col rounded-3xl glass p-6 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${c.color}18`, color: c.color }}
              >
                <c.icon className="h-6 w-6" />
              </span>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `${c.color}15`, color: c.color }}
              >
                Saves {c.savings}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-bold leading-snug text-foreground">{c.title}</h3>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Progress</span>
                <span>{c.progress}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(74,128,212,0.15)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${c.progress}%`, background: `linear-gradient(90deg, ${c.color}88, ${c.color})` }}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 border-t pt-4 text-sm" style={{ borderColor: "rgba(74,128,212,0.15)" }}>
              <Gift className="h-4 w-4" style={{ color: c.color }} />
              <span className="font-medium text-muted-foreground">Reward</span>
              <span className="ml-auto font-semibold" style={{ color: c.color }}>{c.reward}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
