"use client"
/**
 * Particles — floating dust motes, pollen, and wind-blown petals.
 * Each particle drifts upward and fades with individual timing.
 * Organic, premium feel — subtle by design.
 */
import React from "react"

interface ParticlesProps {
  stage: number
  animated: boolean
}

export function Particles({ stage, animated }: ParticlesProps) {
  if (stage < 3) return null

  const count  = stage >= 6 ? 18 : stage >= 4 ? 12 : 7
  const hasPollenColor = stage >= 5

  // Pre-computed positions so they don't shift on re-render
  const specs = [
    { x:  95, y: 310, size: 2.2,  dur: 6.0, delay: 0.0,  type: "mote"   },
    { x: 152, y: 270, size: 1.8,  dur: 7.5, delay: 1.2,  type: "pollen" },
    { x: 200, y: 240, size: 2.5,  dur: 5.5, delay: 0.8,  type: "mote"   },
    { x: 248, y: 255, size: 1.6,  dur: 8.0, delay: 2.4,  type: "pollen" },
    { x: 290, y: 280, size: 2.0,  dur: 6.5, delay: 0.4,  type: "mote"   },
    { x: 340, y: 300, size: 1.5,  dur: 7.0, delay: 1.8,  type: "mote"   },
    { x: 178, y: 360, size: 2.8,  dur: 5.0, delay: 3.0,  type: "petal"  },
    { x: 260, y: 350, size: 2.4,  dur: 5.8, delay: 1.5,  type: "petal"  },
    { x: 130, y: 340, size: 1.9,  dur: 6.8, delay: 2.0,  type: "mote"   },
    { x: 310, y: 330, size: 2.1,  dur: 7.2, delay: 0.6,  type: "pollen" },
    { x: 222, y: 310, size: 1.7,  dur: 9.0, delay: 3.5,  type: "mote"   },
    { x: 380, y: 290, size: 1.4,  dur: 6.3, delay: 2.8,  type: "mote"   },
    { x: 62,  y: 300, size: 1.6,  dur: 7.8, delay: 4.0,  type: "pollen" },
    { x: 115, y: 230, size: 2.3,  dur: 5.2, delay: 1.0,  type: "mote"   },
    { x: 330, y: 250, size: 1.8,  dur: 8.5, delay: 0.2,  type: "pollen" },
    { x: 170, y: 210, size: 2.0,  dur: 6.0, delay: 4.5,  type: "petal"  },
    { x: 270, y: 200, size: 1.5,  dur: 7.0, delay: 3.2,  type: "mote"   },
    { x: 400, y: 320, size: 1.4,  dur: 6.5, delay: 2.6,  type: "mote"   },
  ].slice(0, count)

  return (
    <g>
      {specs.map((p, i) => (
        <Particle key={i} {...p} animated={animated} hasPollenColor={hasPollenColor} />
      ))}
    </g>
  )
}

function Particle({
  x, y, size, dur, delay, type, animated, hasPollenColor,
}: {
  x: number; y: number; size: number; dur: number; delay: number
  type: string; animated: boolean; hasPollenColor: boolean
}) {
  const fill =
    type === "petal"  ? "#fbcfe8" :
    type === "pollen" ? (hasPollenColor ? "#fcd34d" : "#d1fae5") :
    "#bbf7d0"

  const opacity = type === "petal" ? 0.65 : 0.45

  if (!animated) {
    return (
      <circle cx={x} cy={y} r={size} fill={fill} opacity={opacity * 0.5} />
    )
  }

  // Drift upward — inline SVG animation
  const driftX = (((x + delay * 10) % 20) - 10).toFixed(1)
  const endY   = y - 60 - size * 10

  return (
    <circle cx={x} cy={y} r={size} fill={fill} opacity={opacity}>
      <animate
        attributeName="cy"
        from={y}
        to={endY}
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
        calcMode="ease-in"
      />
      <animate
        attributeName="cx"
        values={`${x};${x + parseFloat(driftX)};${x}`}
        dur={`${dur * 1.3}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values={`0;${opacity};${opacity};0`}
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  )
}
