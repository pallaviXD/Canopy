"use client"
import React from "react"

interface GroundProps {
  stage: number
  hasFlowers: boolean
}

export function Ground({ stage, hasFlowers }: GroundProps) {
  return (
    <g>
      {/* ── Soil bed ── */}
      <path
        d="M28,436 C68,422 140,416 220,416 C300,416 372,422 412,436 L412,462 L28,462 Z"
        fill="url(#g-soil)"
      />
      {/* ── Grass hill surface ── */}
      <path
        d="M22,432 C65,418 142,412 220,412 C298,412 375,418 418,432
           C375,426 298,422 220,422 C142,422 65,426 22,432 Z"
        fill="url(#g-surface)"
      />
      {/* ── Darker inner hill (depth) ── */}
      <path
        d="M105,430 C140,422 178,419 220,419 C262,419 300,422 335,430
           C300,426 262,424 220,424 C178,424 140,426 105,430 Z"
        fill="url(#g-hill)"
        opacity="0.6"
      />
      {/* ── Root shadow under trunk ── */}
      <path
        d="M186,428 C196,423 208,421 220,421 C232,421 244,423 254,428
           C244,425 232,423 220,423 C208,423 196,425 186,428 Z"
        fill="#14532d"
        opacity="0.22"
      />

      {/* ── Grass ── */}
      {stage >= 2 && <GrassLayer stage={stage} />}

      {/* ── Ground flowers ── */}
      {hasFlowers && stage >= 4 && <GroundFlowers />}

      {/* ── Fallen petals ── */}
      {hasFlowers && stage >= 5 && <FallenPetals />}

      {/* ── Moss (stage 6+) ── */}
      {stage >= 6 && <Moss />}
    </g>
  )
}

function GrassLayer({ stage }: { stage: number }) {
  const blades = [
    { x: 68,  h: 15, delay: 0.0  },
    { x: 88,  h: 12, delay: 0.4  },
    { x: 108, h: 14, delay: 0.8  },
    { x: 132, h: 11, delay: 0.2  },
    { x: 154, h: 13, delay: 1.2  },
    { x: 286, h: 13, delay: 0.6  },
    { x: 308, h: 11, delay: 1.0  },
    { x: 330, h: 15, delay: 0.3  },
    { x: 352, h: 12, delay: 0.7  },
    { x: 374, h: 14, delay: 1.4  },
    ...(stage >= 4 ? [
      { x: 52,  h: 10, delay: 1.6 },
      { x: 392, h: 10, delay: 1.8 },
    ] : []),
    ...(stage >= 5 ? [
      { x: 38,  h: 9,  delay: 2.0 },
      { x: 406, h: 9,  delay: 2.2 },
    ] : []),
  ]

  return (
    <g>
      {blades.map((b, i) => <GrassBlade key={i} x={b.x} h={b.h} delay={b.delay} idx={i} />)}
    </g>
  )
}

function GrassBlade({ x, h, delay, idx }: { x: number; h: number; delay: number; idx: number }) {
  const sw = 4 + (idx % 3)
  return (
    <g
      className="animate-sway"
      style={{
        transformOrigin: `${x}px 422px`,
        animationDelay: `${delay}s`,
        animationDuration: `${3.2 + (idx % 4) * 0.6}s`,
      }}
    >
      {/* back blade */}
      <path
        d={`M${x},422 C${x-sw},${422-h*0.45} ${x-sw-1},${422-h*0.8} ${x-sw},${422-h}`}
        stroke="#22c55e" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.75"
      />
      {/* center blade — tallest */}
      <path
        d={`M${x},422 C${x+0.5},${422-h*0.55} ${x+1},${422-h*0.88} ${x+1},${422-h-4}`}
        stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round"
      />
      {/* front blade */}
      <path
        d={`M${x},422 C${x+sw},${422-h*0.4} ${x+sw+1},${422-h*0.75} ${x+sw},${422-h+2}`}
        stroke="#4ade80" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.65"
      />
    </g>
  )
}

function GroundFlowers() {
  const flowers = [
    { x: 88,  y: 420, c: "#fbcfe8", cc: "#fbbf24", s: 4.2 },
    { x: 348, y: 421, c: "#c4b5fd", cc: "#a855f7", s: 3.8 },
    { x: 122, y: 418, c: "#fde68a", cc: "#f97316", s: 3.5 },
    { x: 322, y: 419, c: "#fda4af", cc: "#f43f5e", s: 3.6 },
    { x: 168, y: 419, c: "#bbf7d0", cc: "#22c55e", s: 3.2 },
    { x: 276, y: 420, c: "#fbcfe8", cc: "#ec4899", s: 3.4 },
  ]

  return (
    <g>
      {flowers.map((f, i) => (
        <g key={i}
          className="animate-float-slow"
          style={{ transformOrigin: `${f.x}px ${f.y}px`, animationDelay: `${i * 0.5}s` }}
        >
          {/* stem */}
          <path
            d={`M${f.x},${f.y} C${f.x-1},${f.y-6} ${f.x},${f.y-11} ${f.x},${f.y-16}`}
            stroke="#15803d" strokeWidth="1.4" fill="none" strokeLinecap="round"
          />
          {/* 5 organic petals */}
          {[0,72,144,216,288].map(deg => {
            const r = (deg * Math.PI) / 180
            const px = f.x + Math.cos(r) * f.s
            const py = (f.y - 16) + Math.sin(r) * f.s
            const cp1x = f.x + Math.cos(r - 0.5) * f.s * 0.5
            const cp1y = (f.y - 16) + Math.sin(r - 0.5) * f.s * 0.5
            const cp2x = f.x + Math.cos(r) * f.s * 1.2
            const cp2y = (f.y - 16) + Math.sin(r) * f.s * 1.2
            return (
              <path key={deg}
                d={`M${f.x},${f.y-16} C${cp1x},${cp1y} ${cp2x},${cp2y} ${px},${py} C${cp2x},${cp2y} ${cp1x},${cp1y} ${f.x},${f.y-16} Z`}
                fill={f.c} opacity="0.9"
              />
            )
          })}
          <circle cx={f.x} cy={f.y-16} r={f.s * 0.42} fill={f.cc} />
        </g>
      ))}
    </g>
  )
}

function FallenPetals() {
  const petals = [
    { x: 158, y: 424, r: 22,  c: "#fbcfe8" },
    { x: 282, y: 423, r: -18, c: "#fde68a" },
    { x: 195, y: 426, r: 38,  c: "#c4b5fd" },
    { x: 248, y: 422, r: -28, c: "#fbcfe8" },
    { x: 172, y: 425, r: 55,  c: "#fda4af" },
    { x: 268, y: 424, r: -45, c: "#fde68a" },
  ]
  return (
    <g opacity="0.55">
      {petals.map((p, i) => (
        <path key={i}
          d={`M${p.x-4},${p.y} C${p.x-2},${p.y-3} ${p.x+2},${p.y-3} ${p.x+4},${p.y} C${p.x+2},${p.y+2} ${p.x-2},${p.y+2} ${p.x-4},${p.y} Z`}
          fill={p.c}
          transform={`rotate(${p.r} ${p.x} ${p.y})`}
        />
      ))}
    </g>
  )
}

function Moss() {
  return (
    <g opacity="0.45">
      <path d="M84,426 C89,423 96,422 101,424 C96,426 89,426 84,426 Z" fill="#14532d" />
      <path d="M319,425 C324,422 332,421 337,423 C332,425 324,425 319,425 Z" fill="#14532d" />
      <path d="M162,427 C167,424 174,424 178,426 C174,428 167,428 162,427 Z" fill="#15803d" />
      <path d="M262,426 C267,423 274,423 278,425 C274,427 267,427 262,426 Z" fill="#166534" />
    </g>
  )
}
