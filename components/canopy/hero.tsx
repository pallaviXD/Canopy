"use client"

import { PixelHero } from "@/components/ui/pixel-perfect-hero"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()

  return (
    <div className="w-full">
      <PixelHero
        word1="Canopy"
        word2="Impact."
        description="Grow your impact. Shrink your footprint. Track carbon emissions, complete eco-challenges, and watch a living forest flourish in real-time."
        primaryCta="Start Growing"
        primaryCtaMobile="Start"
        secondaryCta="Open Dashboard"
        secondaryCtaMobile="Dashboard"
        onPrimaryClick={() => router.push("/onboarding")}
        onSecondaryClick={() => router.push("/dashboard")}
      />
    </div>
  )
}
