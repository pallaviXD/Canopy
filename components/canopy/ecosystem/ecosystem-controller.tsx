"use client"
/**
 * EcosystemController — premium layered SVG ecosystem.
 * All gradients/filters live in <defs>. Layers render in depth order.
 */
import React from "react"
import { cn } from "@/lib/utils"
import { EcosystemState } from "@/lib/ecosystem-engine"
import { Ground }      from "./ground"
import { Tree }        from "./tree"
import { Leaves }      from "./leaves"
import { Flowers }     from "./flowers"
import { Birds }       from "./birds"
import { Butterflies } from "./butterflies"
import { Sunlight }    from "./sunlight"
import { Particles }   from "./particles"

interface EcosystemControllerProps {
  state: EcosystemState
  className?: string
  animated?: boolean
}

export function EcosystemController({ state, className, animated = true }: EcosystemControllerProps) {
  const { stage, hasBirds, hasButterflies, hasFlowers, brightSun, leafDensity } = state

  return (
    <svg
      viewBox="0 0 440 460"
      className={cn("h-full w-full overflow-visible", className)}
      role="img"
      aria-label={`${state.label} — ${state.description}`}
    >
      <defs>
        {/* ── Trunk ── */}
        <linearGradient id="t-trunk-mature" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#92400e" />
          <stop offset="28%"  stopColor="#7c3a10" />
          <stop offset="55%"  stopColor="#6b3a1f" />
          <stop offset="100%" stopColor="#4a2008" />
        </linearGradient>
        <linearGradient id="t-trunk-young" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#a3653a" />
          <stop offset="50%"  stopColor="#92400e" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="t-trunk-highlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0" />
          <stop offset="40%"  stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* ── Ground ── */}
        <linearGradient id="g-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#854d0e" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
        <linearGradient id="g-surface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#22c55e" />
          <stop offset="50%"  stopColor="#16a34a" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="g-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#16a34a" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>

        {/* ── Sky / sun ── */}
        <radialGradient id="sl-sky-glow" cx="79%" cy="14%" r="45%">
          <stop offset="0%"   stopColor="#fef9c3" stopOpacity="0.32" />
          <stop offset="45%"  stopColor="#bfdbfe" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#dcfce7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sl-sky-dim" cx="50%" cy="0%" r="70%">
          <stop offset="0%"   stopColor="#e2e8f0" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sl-sun" cx="38%" cy="35%" r="62%">
          <stop offset="0%"   stopColor="#fefce8" />
          <stop offset="45%"  stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </radialGradient>

        {/* ── Leaf ambient shadow ── */}
        <filter id="leaf-shadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#14532d" floodOpacity="0.2" />
        </filter>
        <filter id="leaf-depth" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#166534" floodOpacity="0.15" />
        </filter>
        <filter id="tree-shadow" x="-15%" y="-5%" width="130%" height="120%">
          <feDropShadow dx="4" dy="6" stdDeviation="8" floodColor="#14532d" floodOpacity="0.25" />
        </filter>
        <filter id="flower-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="sun-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* ── Canopy ambient light ── */}
        <radialGradient id="canopy-light" cx="50%" cy="30%" r="55%">
          <stop offset="0%"   stopColor="#bbf7d0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky wash */}
      <rect x="0" y="0" width="440" height="460"
        fill={brightSun ? "url(#sl-sky-glow)" : "url(#sl-sky-dim)"} />

      {/* Canopy ambient bloom */}
      {stage >= 4 && (
        <ellipse cx="220" cy="230" rx="185" ry="160" fill="url(#canopy-light)" />
      )}

      {/* ─── Layers in depth order ─── */}
      <Sunlight brightSun={brightSun} animated={animated} />
      <Ground   stage={stage} hasFlowers={hasFlowers} />
      <Tree     stage={stage} animated={animated} />
      <Leaves   stage={stage} leafDensity={leafDensity} animated={animated} />
      <Flowers  hasFlowers={hasFlowers} animated={animated} />
      <Birds    hasBirds={hasBirds} stage={stage} animated={animated} />
      <Butterflies hasButterflies={hasButterflies} animated={animated} />
      <Particles   stage={stage} animated={animated} />
    </svg>
  )
}
