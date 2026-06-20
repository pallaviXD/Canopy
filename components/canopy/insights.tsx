import { TrendingDown, Globe2 } from "lucide-react"

const weekly = [38, 34, 36, 30, 28, 26, 24.7]
const days = ["M", "T", "W", "T", "F", "S", "S"]

const breakdown = [
  { label: "Travel",   pct: 52, color: "#4a80d4" },
  { label: "Food",     pct: 25, color: "#7aaef0" },
  { label: "Energy",   pct: 16, color: "#2f60c8" },
  { label: "Shopping", pct:  7, color: "#fbbf24" },
]

const months = [
  { m: "Jul", v: 62 }, { m: "Aug", v: 55 }, { m: "Sep", v: 48 },
  { m: "Oct", v: 41 }, { m: "Nov", v: 33 }, { m: "Dec", v: 27 },
]

export function Insights() {
  const w = 280, h = 120
  const max = Math.max(...weekly)
  const min = Math.min(...weekly) - 4
  const pts = weekly.map((v, i) => {
    const x = (i / (weekly.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * h
    return [x, y] as const
  })
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ")
  const area = `${line} L${w},${h} L0,${h} Z`

  let offset = 0
  const radius = 52
  const circ = 2 * Math.PI * radius

  return (
    <section id="insights" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky">Insights</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Beautiful analytics, real understanding
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Weekly trend */}
          <div className="rounded-3xl glass p-6 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-foreground">Weekly trend</p>
                <p className="text-sm text-muted-foreground">Daily CO₂ emissions (kg)</p>
              </div>
              <span className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold text-sky" style={{ background: "rgba(74,128,212,0.15)" }}>
                <TrendingDown className="h-4 w-4" /> 12% lower
              </span>
            </div>
            <svg viewBox={`0 0 ${w} ${h + 20}`} className="mt-6 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaFill-dark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a80d4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4a80d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#areaFill-dark)" />
              <path d={line} fill="none" stroke="#7aaef0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]}
                  r={i === pts.length - 1 ? 5 : 3}
                  fill="#080e1a" stroke="#7aaef0" strokeWidth="2.5"
                />
              ))}
            </svg>
            <div className="mt-2 flex justify-between px-1 text-xs text-muted-foreground">
              {days.map((d, i) => <span key={i}>{d}</span>)}
            </div>
          </div>

          {/* Category donut */}
          <div className="rounded-3xl glass p-6">
            <p className="font-bold text-foreground">Category breakdown</p>
            <p className="text-sm text-muted-foreground">Share of your footprint</p>
            <div className="mt-4 flex items-center gap-5">
              <svg viewBox="0 0 140 140" className="h-32 w-32 -rotate-90">
                {breakdown.map((b) => {
                  const len = (b.pct / 100) * circ
                  const seg = (
                    <circle key={b.label} cx="70" cy="70" r={radius}
                      fill="none" stroke={b.color} strokeWidth="16"
                      strokeDasharray={`${len} ${circ - len}`}
                      strokeDashoffset={-offset} strokeLinecap="round"
                    />
                  )
                  offset += len
                  return seg
                })}
              </svg>
              <ul className="flex-1 space-y-2">
                {breakdown.map((b) => (
                  <li key={b.label} className="flex items-center gap-2 text-sm">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="ml-auto font-semibold text-foreground">{b.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Monthly improvement */}
          <div className="rounded-3xl glass p-6 lg:col-span-2">
            <p className="font-bold text-foreground">Monthly improvement</p>
            <p className="text-sm text-muted-foreground">Footprint trending down for 6 months</p>
            <div className="mt-6 flex h-40 items-end justify-between gap-3">
              {months.map((mo, idx) => (
                <div key={mo.m} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center" style={{ height: "120px" }}>
                    <div
                      className="w-full max-w-10 rounded-t-xl transition-all"
                      style={{
                        height: `${mo.v}%`,
                        background: `linear-gradient(to top, rgba(26,53,112,0.9), rgba(74,128,212,${0.4 + idx * 0.1}))`,
                        border: "1px solid rgba(74,128,212,0.25)",
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{mo.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div className="rounded-3xl glass p-6">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-sky" />
              <p className="font-bold text-foreground">How you compare</p>
            </div>
            <p className="text-sm text-muted-foreground">Weekly CO₂ vs averages</p>
            <div className="mt-5 space-y-4">
              <CompareBar label="You"            value={24.7} max={48} color="#4a80d4" highlight />
              <CompareBar label="Indian average" value={32}   max={48} color="#7aaef0" />
              <CompareBar label="Global average" value={48}   max={48} color="rgba(148,163,184,0.5)" />
            </div>
            <p className="mt-5 rounded-2xl px-4 py-3 text-sm font-medium text-sky" style={{ background: "rgba(74,128,212,0.12)", border: "1px solid rgba(74,128,212,0.2)" }}>
              You&apos;re emitting 49% less than the global average.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function CompareBar({ label, value, max, color, highlight }: {
  label: string; value: number; max: number; color: string; highlight?: boolean
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className={highlight ? "font-bold text-sky" : "text-muted-foreground"}>{label}</span>
        <span className="font-semibold text-foreground">{value} kg</span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(74,128,212,0.12)" }}>
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  )
}
