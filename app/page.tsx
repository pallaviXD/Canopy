import { SiteHeader } from "@/components/canopy/site-header"
import { Hero } from "@/components/canopy/hero"
import { HowItWorks } from "@/components/canopy/how-it-works"
import { Features } from "@/components/canopy/features"
import { AiCoachLive } from "@/components/canopy/ai-coach-live"
import { DashboardPreview } from "@/components/canopy/dashboard-preview"
import { Challenges } from "@/components/canopy/challenges"
import { Insights } from "@/components/canopy/insights"
import { FinalCta } from "@/components/canopy/final-cta"
import { SiteFooter } from "@/components/canopy/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <AiCoachLive />
        <DashboardPreview />
        <Challenges />
        <Insights />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
