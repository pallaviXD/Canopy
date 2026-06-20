"use client"
/**
 * Butterflies — wings drawn with organic bezier paths.
 * Upper and lower wing pairs. Floating path animation.
 */
import React from "react"

interface ButterfliesProps {
  hasButterflies: boolean
  animated: boolean
}

export function Butterflies({ hasButterflies, animated }: ButterfliesProps) {
  if (!hasButterflies) return null

  const butterflies = [
    { x: 290, y: 210, c1: "#c4b5fd", c2: "#a78bfa", delay: "0s",   dur: "7s"  },
    { x: 152, y: 244, c1: "#fbcfe8", c2: "#f9a8d4", delay: "1.8s", dur: "9s"  },
    { x: 310, y: 270, c1: "#fde68a", c2: "#fcd34d", delay: "3.5s", dur: "8s"  },
  ]

  return (
    <g>
      {butterflies.map((b, i) => (
        <Butterfly key={i} {...b} animated={animated} />
      ))}
    </g>
  )
}

function Butterfly({
  x, y, c1, c2, delay, dur, animated
}: {
  x: number; y: number; c1: string; c2: string
  delay: string; dur: string; animated: boolean
}) {
  return (
    <g
      className={animated ? "animate-float-medium" : ""}
      style={animated ? {
        transformOrigin: `${x}px ${y}px`,
        animationDelay: delay,
        animationDuration: dur,
      } : {}}
    >
      {/* Upper wing left */}
      <path
        d={`M${x},${y}
            C${x - 16},${y - 10}
             ${x - 22},${y - 22}
             ${x - 16},${y - 28}
            C${x - 8},${y - 32}
             ${x - 4},${y - 22}
             ${x},${y} Z`}
        fill={c1}
        opacity="0.85"
      />
      {/* Upper wing right */}
      <path
        d={`M${x},${y}
            C${x + 16},${y - 10}
             ${x + 22},${y - 22}
             ${x + 16},${y - 28}
            C${x + 8},${y - 32}
             ${x + 4},${y - 22}
             ${x},${y} Z`}
        fill={c1}
        opacity="0.85"
      />
      {/* Lower wing left */}
      <path
        d={`M${x},${y}
            C${x - 14},${y + 2}
             ${x - 20},${y + 14}
             ${x - 12},${y + 18}
            C${x - 4},${y + 20}
             ${x - 2},${y + 12}
             ${x},${y} Z`}
        fill={c2}
        opacity="0.8"
      />
      {/* Lower wing right */}
      <path
        d={`M${x},${y}
            C${x + 14},${y + 2}
             ${x + 20},${y + 14}
             ${x + 12},${y + 18}
            C${x + 4},${y + 20}
             ${x + 2},${y + 12}
             ${x},${y} Z`}
        fill={c2}
        opacity="0.8"
      />
      {/* Wing patterns */}
      <circle cx={x - 8} cy={y - 16} r="2.5" fill="rgba(0,0,0,0.12)" />
      <circle cx={x + 8} cy={y - 16} r="2.5" fill="rgba(0,0,0,0.12)" />
      {/* Body */}
      <path
        d={`M${x},${y - 28} C${x - 1},${y - 14} ${x - 1},${y} ${x},${y + 18}
            C${x + 1},${y} ${x + 1},${y - 14} ${x},${y - 28} Z`}
        fill="#1c1917"
        opacity="0.8"
      />
      {/* Antennae */}
      <path
        d={`M${x},${y - 28} C${x - 4},${y - 36} ${x - 8},${y - 40} ${x - 7},${y - 44}`}
        stroke="#1c1917" strokeWidth="0.8" fill="none" strokeLinecap="round"
      />
      <path
        d={`M${x},${y - 28} C${x + 4},${y - 36} ${x + 8},${y - 40} ${x + 7},${y - 44}`}
        stroke="#1c1917" strokeWidth="0.8" fill="none" strokeLinecap="round"
      />
      <circle cx={x - 7} cy={y - 44} r="1.2" fill="#1c1917" />
      <circle cx={x + 7} cy={y - 44} r="1.2" fill="#1c1917" />
    </g>
  )
}
