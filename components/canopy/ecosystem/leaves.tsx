"use client"
/**
 * Leaves — every leaf is an organic bezier teardrop.
 * Each leaf has independent sway timing for natural wind effect.
 * Three tonal layers: highlight, mid, shadow — creating canopy depth.
 */
import React from "react"
import type { EcosystemStage } from "@/lib/ecosystem-engine"

interface LeavesProps {
  stage: EcosystemStage
  leafDensity: number
  animated: boolean
}

export function Leaves({ stage, leafDensity, animated }: LeavesProps) {
  if (stage < 2) return null
  const op = Math.max(0.12, leafDensity)
  return (
    <g opacity={op} filter="url(#leaf-depth)">
      {stage === 2 && <SaplingLeaves animated={animated} />}
      {stage === 3 && <YoungLeaves   animated={animated} />}
      {stage >= 4 && <MatureLeaves  stage={stage} animated={animated} />}
    </g>
  )
}

/** Single teardrop leaf at absolute (x,y), rotated `angle` degrees */
function Leaf({ x, y, size, angle, color, op = 0.92, delay = 0, animated = false }: {
  x: number; y: number; size: number; angle: number
  color: string; op?: number; delay?: number; animated?: boolean
}) {
  const w = size * 0.36
  // tip faces up (0,-size), base at origin
  const d = `M0,0 C${w},${-size*0.18} ${w},${-size*0.72} 0,${-size} C${-w},${-size*0.72} ${-w},${-size*0.18} 0,0 Z`
  const vein = `M0,-${size*0.05} L0,${-size*0.88}`
  return (
    <g
      transform={`translate(${x},${y}) rotate(${angle})`}
      className={animated ? "animate-sway" : ""}
      style={animated ? {
        transformOrigin: "0px 0px",
        animationDelay: `${delay}s`,
        animationDuration: `${3.8 + (delay % 2.5)}s`,
      } : {}}
    >
      <path d={d} fill={color} opacity={op} />
      <path d={vein} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" fill="none" />
    </g>
  )
}

/** A cluster of leaves radiating around a point */
function Cluster({ cx, cy, r, n, animated }: {
  cx: number; cy: number; r: number; n: number; animated: boolean
}) {
  const COLORS = [
    ["#86efac","#4ade80","#22c55e"],  // highlight row
    ["#4ade80","#22c55e","#16a34a"],  // mid row
    ["#22c55e","#16a34a","#166534"],  // shadow row
  ]
  const items = []
  for (let i = 0; i < n; i++) {
    const t      = i / n
    const deg    = t * 360 - 80 + (i % 3) * 8
    const rad    = (deg * Math.PI) / 180
    const reach  = r * (0.52 + (i % 4) * 0.14)
    const lx     = cx + Math.cos(rad) * reach
    const ly     = cy + Math.sin(rad) * reach
    const size   = 17 + (i % 5) * 4
    const leafA  = deg + 88 + (i % 2 === 0 ? 18 : -18)
    const tier   = i % 3
    const shade  = i % 3
    const color  = COLORS[tier][shade]
    const delay  = (i * 0.22) % 3.2
    items.push(
      <Leaf key={i} x={lx} y={ly} size={size} angle={leafA}
        color={color} op={0.82 + (shade * 0.05)}
        delay={delay} animated={animated}
      />
    )
  }
  return <g>{items}</g>
}

function SaplingLeaves({ animated }: { animated: boolean }) {
  return (
    <g>
      <Leaf x={218} y={358} size={19} angle={-22} color="#4ade80" op={0.9}  delay={0}   animated={animated} />
      <Leaf x={222} y={356} size={17} angle={20}  color="#22c55e" op={0.88} delay={0.3} animated={animated} />
      <Leaf x={220} y={349} size={15} angle={0}   color="#86efac" op={0.82} delay={0.6} animated={animated} />
      <Leaf x={213} y={353} size={16} angle={-38} color="#4ade80" op={0.8}  delay={0.9} animated={animated} />
      <Leaf x={227} y={351} size={16} angle={38}  color="#16a34a" op={0.85} delay={1.2} animated={animated} />
    </g>
  )
}

function YoungLeaves({ animated }: { animated: boolean }) {
  return (
    <g>
      <Cluster cx={220} cy={262} r={34} n={14} animated={animated} />
      <Cluster cx={168} cy={294} r={26} n={10} animated={animated} />
      <Cluster cx={272} cy={288} r={28} n={11} animated={animated} />
      <Cluster cx={220} cy={228} r={22} n={8}  animated={animated} />
    </g>
  )
}

function MatureLeaves({ stage, animated }: { stage: EcosystemStage; animated: boolean }) {
  const lush   = stage >= 5
  const forest = stage >= 6

  return (
    <g>
      {/* ── Crown top — densest clusters ── */}
      <Cluster cx={220} cy={184} r={52} n={26} animated={animated} />
      <Cluster cx={194} cy={196} r={44} n={20} animated={animated} />
      <Cluster cx={246} cy={194} r={46} n={22} animated={animated} />
      <Cluster cx={220} cy={162} r={38} n={17} animated={animated} />

      {/* ── Left canopy spread ── */}
      <Cluster cx={164} cy={252} r={40} n={18} animated={animated} />
      <Cluster cx={148} cy={292} r={34} n={15} animated={animated} />
      <Cluster cx={156} cy={265} r={30} n={13} animated={animated} />

      {/* ── Right canopy spread ── */}
      <Cluster cx={276} cy={246} r={42} n={19} animated={animated} />
      <Cluster cx={294} cy={286} r={35} n={15} animated={animated} />
      <Cluster cx={284} cy={259} r={31} n={14} animated={animated} />

      {/* ── Mid layer ── */}
      <Cluster cx={186} cy={224} r={36} n={16} animated={animated} />
      <Cluster cx={254} cy={220} r={37} n={17} animated={animated} />
      <Cluster cx={176} cy={244} r={28} n={12} animated={animated} />
      <Cluster cx={264} cy={238} r={29} n={13} animated={animated} />

      {/* ── Lush stage 5+ ── */}
      {lush && <>
        <Cluster cx={136} cy={280} r={36} n={16} animated={animated} />
        <Cluster cx={306} cy={274} r={37} n={16} animated={animated} />
        <Cluster cx={130} cy={312} r={30} n={13} animated={animated} />
        <Cluster cx={312} cy={306} r={31} n={14} animated={animated} />
        <Cluster cx={170} cy={206} r={32} n={14} animated={animated} />
        <Cluster cx={270} cy={202} r={33} n={15} animated={animated} />
      </>}

      {/* ── Forest stage 6+ ── */}
      {forest && <>
        <Cluster cx={120} cy={264} r={38} n={17} animated={animated} />
        <Cluster cx={322} cy={258} r={39} n={17} animated={animated} />
        <Cluster cx={112} cy={296} r={32} n={14} animated={animated} />
        <Cluster cx={330} cy={290} r={33} n={15} animated={animated} />
      </>}

      {/* ── Individual scattered leaves for organic silhouette ── */}
      <ScatteredLeaves stage={stage} animated={animated} />
    </g>
  )
}

function ScatteredLeaves({ stage, animated }: { stage: EcosystemStage; animated: boolean }) {
  const leaves = [
    { x: 108, y: 296, s: 15, a: -42, c: "#86efac", d: 0.1 },
    { x: 134, y: 246, s: 13, a: 28,  c: "#4ade80", d: 0.5 },
    { x: 328, y: 242, s: 14, a: -26, c: "#22c55e", d: 0.9 },
    { x: 350, y: 292, s: 13, a: 38,  c: "#86efac", d: 1.3 },
    { x: 150, y: 215, s: 12, a: -22, c: "#4ade80", d: 0.7 },
    { x: 290, y: 209, s: 13, a: 24,  c: "#22c55e", d: 1.1 },
    { x: 200, y: 152, s: 17, a: -8,  c: "#86efac", d: 0.3 },
    { x: 240, y: 149, s: 16, a: 14,  c: "#4ade80", d: 0.8 },
    { x: 166, y: 168, s: 14, a: -32, c: "#22c55e", d: 1.6 },
    { x: 274, y: 165, s: 14, a: 28,  c: "#4ade80", d: 2.0 },
    ...(stage >= 5 ? [
      { x: 98,  y: 276, s: 14, a: -24, c: "#4ade80", d: 2.5 },
      { x: 344, y: 270, s: 13, a: 18,  c: "#86efac", d: 2.8 },
    ] : []),
  ]

  return (
    <g opacity="0.72">
      {leaves.map((l, i) => (
        <Leaf key={i} x={l.x} y={l.y} size={l.s} angle={l.a}
          color={l.c} op={0.68} delay={l.d} animated={animated}
        />
      ))}
    </g>
  )
}
