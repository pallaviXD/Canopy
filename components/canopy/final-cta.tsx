import Link from "next/link"
import { ArrowRight, Leaf, Sprout, TreePine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow"

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-800/30 px-6 py-20 text-center shadow-[0_40px_80px_rgba(0,0,0,0.45)] sm:px-12"
        style={{ background: "linear-gradient(160deg, #011c0d 0%, #042f1e 45%, #065f46 80%, #042f1e 100%)" }}
      >
        {/* Ethereal shadow background */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <EtheralShadow
            color="rgba(16, 185, 129, 0.5)"
            animation={{ scale: 75, speed: 45 }}
            noise={{ opacity: 0.12, scale: 1.1 }}
            showTitle={false}
          />
        </div>

        {/* Floating leaves */}
        <div className="pointer-events-none absolute inset-0">
          <Leaf className="absolute left-[8%] top-8 h-10 w-10 animate-float-slow text-emerald-400/25" />
          <Leaf className="absolute right-[10%] top-12 h-7 w-7 animate-float-medium text-emerald-300/20" />
          <Sprout className="absolute left-[18%] bottom-16 h-9 w-9 animate-float-slow text-emerald-400/20" style={{ animationDelay: "-3s" }} />
          <TreePine className="absolute right-[18%] bottom-12 h-8 w-8 animate-float-medium text-emerald-300/25" style={{ animationDelay: "-1.5s" }} />
          <Leaf className="absolute left-[50%] top-6 h-5 w-5 animate-float-slow text-emerald-400/15" style={{ animationDelay: "-5s" }} />
        </div>

        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-80 w-96 rounded-full bg-emerald-500/15 blur-[80px]" />
          <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-teal-500/10 blur-[60px]" />
          <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-green-600/10 blur-[60px]" />
        </div>

        <div className="relative mx-auto max-w-2xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Join the movement
          </span>

          <h2 className="mt-7 text-balance text-4xl font-bold leading-tight text-white sm:text-5xl">
            Every small action grows
            <span className="block mt-1" style={{
              background: "linear-gradient(135deg, #6ee7b7, #34d399, #a7f3d0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              something bigger.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-emerald-100/75">
            Join thousands of people building a healthier future one choice at a time.
          </p>

          {/* Social proof */}
          <div className="mx-auto mt-8 flex items-center justify-center gap-8">
            {[
              { value: "10k+", label: "Active users" },
              { value: "240t", label: "CO₂ saved" },
              { value: "4.9★", label: "App rating" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-emerald-300">{s.value}</p>
                <p className="text-xs text-emerald-200/60 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              render={<Link href="/onboarding" />}
              size="lg"
              className="group h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 px-8 text-base font-semibold text-white border-0 shadow-[0_0_32px_rgba(52,211,153,0.4)] hover:shadow-[0_0_48px_rgba(52,211,153,0.6)] hover:scale-[1.03] transition-all duration-300"
            >
              Start Growing Today
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Button>
            <Button
              render={<Link href="/dashboard" />}
              variant="ghost"
              size="lg"
              className="h-12 rounded-full border border-emerald-400/30 bg-white/8 px-8 text-base font-semibold text-emerald-200 backdrop-blur-sm hover:bg-white/15 hover:text-white transition-all duration-200"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
