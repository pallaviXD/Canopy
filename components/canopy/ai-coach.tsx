import { Sparkles, Bot, Send } from "lucide-react"

const chips = ["Reduce travel footprint", "Greener groceries", "Lower my energy bill", "Weekend challenge"]

export function AiCoach() {
  return (
    <section id="ai-coach" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-forest">
            <Sparkles className="h-4 w-4 text-primary" />
            Powered by Gemini
          </span>
          <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            A coach that understands your footprint
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Ask anything. Canopy&apos;s AI Coach reads your real activity data and replies with
            specific, achievable steps — complete with the carbon you&apos;ll save.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Personalized advice grounded in your data",
              "Clear CO₂ savings for every suggestion",
              "Gentle nudges that build lasting habits",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* conversation UI */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_20px_50px_rgba(16,24,40,0.1)] sm:p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold leading-tight">Canopy Coach</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Online
              </p>
            </div>
          </div>

          <div className="space-y-4 py-5">
            <div className="flex justify-end">
              <p className="max-w-[80%] rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">
                How do I reduce my travel footprint?
              </p>
            </div>
            <div className="flex justify-start">
              <p className="max-w-[88%] rounded-3xl rounded-bl-md bg-secondary px-4 py-3 text-sm leading-relaxed text-foreground">
                Your travel emissions account for <strong className="text-forest">52%</strong> of your
                footprint. Replacing two car trips with metro travel could save{" "}
                <strong className="text-forest">3.4kg CO₂</strong> this week. Want me to add this as a
                challenge?
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pb-4">
            {chips.map((c) => (
              <button
                key={c}
                className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-forest"
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2">
            <input
              type="text"
              placeholder="Ask your coach anything…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Send className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
