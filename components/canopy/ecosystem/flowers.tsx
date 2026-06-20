"use client"
/**
 * Flowers — organic 5-petal bezier blooms on branches.
 * Each flower breathes gently. Staggered bloom-in on mount.
 */
import React from "react"

interface FlowersProps {
  hasFlowers: boolean
  animated: boolean
}

export function Flowers({ hasFlowers, animated }: FlowersProps) {
  if (!hasFlowers) return null

  const blooms = [
    { x: 162, y: 258, c: "#fbcfe8", cc: "#fbbf24", s: 1.00, d: 0.00 },
    { x: 278, y: 252, c: "#c4b5fd", cc: "#a855f7", s: 0.90, d: 0.18 },
    { x: 148, y: 290, c: "#fde68a", cc: "#f97316", s: 0.85, d: 0.32 },
    { x: 292, y: 284, c: "#fda4af", cc: "#f43f5e", s: 0.88, d: 0.48 },
    { x: 220, y: 236, c: "#fed7aa", cc: "#f97316", s: 0.80, d: 0.14 },
    { x: 186, y: 228, c: "#c4b5fd", cc: "#7c3aed", s: 0.76, d: 0.38 },
    { x: 254, y: 224, c: "#bbf7d0", cc: "#22c55e", s: 0.78, d: 0.55 },
    { x: 175, y: 254, c: "#fda4af", cc: "#be185d", s: 0.72, d: 0.24 },
    { x: 265, y: 248, c: "#fbcfe8", cc: "#db2777", s: 0.74, d: 0.42 },
    { x: 200, y: 212, c: "#fde68a", cc: "#d97706", s: 0.68, d: 0.60 },
    { x: 240, y: 208, c: "#c4b5fd", cc: "#7c3aed", s: 0.70, d: 0.70 },
  ]

  return (
    <g filter="url(#flower-glow)">
      {blooms.map((b, i) => (
        <Bloom key={i} {...b} animated={animated} />
      ))}
    </g>
  )
}

function Bloom({ x, y, c, cc, s, d, animated }: {
  x: number; y: number; c: string; cc: string
  s: number; d: number; animated: boolean
}) {
  const base = s * 9  // base petal reach

  return (
    <g
      style={{
        transformOrigin: `${x}px ${y}px`,
        animation: animated
          ? `leaf-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) ${d}s both`
          : undefined,
      }}
    >
      {/* 5 organic petals */}
      {[0,72,144,216,288].map(deg => {
        const r   = (deg * Math.PI) / 180
        // tip of petal
        const tx  = x + Math.cos(r) * base
        const ty  = y + Math.sin(r) * base
        // control points — slightly rotated for organic shape
        const r1  = r - 0.45
        const r2  = r + 0.45
        const c1x = x + Math.cos(r1) * base * 0.55
        const c1y = y + Math.sin(r1) * base * 0.55
        const c2x = x + Math.cos(r2) * base * 0.55
        const c2y = y + Math.sin(r2) * base * 0.55
        return (
          <g
            key={deg}
            className={animated ? "animate-float-slow" : ""}
            style={animated ? {
              transformOrigin: `${x}px ${y}px`,
              animationDelay: `${d + deg * 0.003}s`,
              animationDuration: "5s",
            } : {}}
          >
            <path
              d={`M${x},${y} C${c1x},${c1y} ${tx},${ty} ${tx},${ty} C${tx},${ty} ${c2x},${c2y} ${x},${y} Z`}
              fill={c}
              opacity="0.9"
            />
          </g>
        )
      })}

      {/* stamen */}
      <circle cx={x} cy={y} r={base * 0.38} fill={cc} opacity="0.95" />

      {/* pollen dots */}
      {[0,60,120,180,240,300].map((a, i) => {
        const r  = (a * Math.PI) / 180
        return (
          <circle key={i}
            cx={x + Math.cos(r) * base * 0.25}
            cy={y + Math.sin(r) * base * 0.25}
            r={base * 0.09}
            fill="#fbbf24"
            opacity="0.75"
          />
        )
      })}
    </g>
  )
}
