"use client"
/**
 * Birds — premium hand-crafted SVG.
 * Perched birds: full body with wing detail, tail fan, toes.
 * Flying birds: realistic M-shape silhouette on animateMotion arc.
 */
import React from "react"
import type { EcosystemStage } from "@/lib/ecosystem-engine"

interface BirdsProps {
  hasBirds: boolean
  stage: EcosystemStage
  animated: boolean
}

export function Birds({ hasBirds, stage, animated }: BirdsProps) {
  if (!hasBirds) return null

  return (
    <g>
      <PerchedBird x={150} y={282} flip={false} animated={animated} delay={0}   scale={1.0} />
      {stage >= 5 && (
        <PerchedBird x={290} y={274} flip={true}  animated={animated} delay={0.9} scale={0.9} />
      )}
      {stage >= 6 && (
        <g opacity="0.6">
          <FlyingBird animated={animated} pathId="bp0"
            path="M30,160 C90,100 180,85 280,115 C340,132 390,155 420,138"
            delay={0} dur={10} size={10} />
          <FlyingBird animated={animated} pathId="bp1"
            path="M420,190 C350,128 255,110 155,145 C95,164 45,186 18,168"
            delay={3.5} dur={12} size={8} />
        </g>
      )}
      {stage >= 7 && (
        <g opacity="0.45">
          <FlyingBird animated={animated} pathId="bp2"
            path="M60,130 C140,80 240,92 320,118 C365,136 400,158 428,144"
            delay={6} dur={9} size={7} />
        </g>
      )}
    </g>
  )
}

function PerchedBird({ x, y, flip, animated, delay, scale }: {
  x: number; y: number; flip: boolean
  animated: boolean; delay: number; scale: number
}) {
  const sx = flip ? -scale : scale

  return (
    <g
      transform={`translate(${x},${y}) scale(${sx},${scale})`}
      className={animated ? "animate-bird-bob" : ""}
      style={animated ? { transformOrigin: "0px 0px", animationDelay: `${delay}s` } : {}}
    >
      {/* ── Body — plump organic teardrop ── */}
      <path
        d="M0,0 C-8,-6 -13,-14 -10,-22 C-7,-30 5,-30 8,-22 C11,-14 7,-6 0,0 Z"
        fill="#f97316"
      />
      {/* ── Wing — layered feathers ── */}
      <path
        d="M-1,-10 C-7,-14 -16,-13 -20,-9 C-17,-4 -9,-6 -1,-10 Z"
        fill="#ea580c" opacity="0.9"
      />
      <path
        d="M-2,-15 C-8,-18 -16,-16 -19,-12 C-16,-8 -9,-11 -2,-15 Z"
        fill="#c2410c" opacity="0.7"
      />
      {/* ── Tail fan ── */}
      <path
        d="M0,0 C3,5 8,8 14,6 C10,2 5,0 0,0 Z"
        fill="#c2410c" opacity="0.85"
      />
      <path
        d="M0,0 C2,6 6,9 12,8 C8,3 3,1 0,0 Z"
        fill="#9a3412" opacity="0.6"
      />
      {/* ── Head highlight ── */}
      <path
        d="M2,-24 C6,-26 9,-24 8,-21 C7,-19 4,-19 2,-21 C1,-23 2,-24 2,-24 Z"
        fill="#fdba74" opacity="0.5"
      />
      {/* ── Beak ── */}
      <path
        d="M8,-22 C12,-24 16,-22 15,-20 C14,-18 10,-19 8,-22 Z"
        fill="#fbbf24"
      />
      {/* ── Eye ── */}
      <circle cx="5" cy="-23" r="2.2" fill="#1c1917" />
      <circle cx="6" cy="-24" r="0.7" fill="#ffffff" />
      {/* ── Feet / perch grip ── */}
      <path d="M-2,0 L-2,5" stroke="#92400e" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M-2,5 L-5,7 M-2,5 L0,7 M-2,5 L-3.5,8" stroke="#92400e" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M3,0 L3,5" stroke="#92400e" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M3,5 L0,7 M3,5 L5,7 M3,5 L2,8" stroke="#92400e" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </g>
  )
}

function FlyingBird({ animated, pathId, path, delay, dur, size }: {
  animated: boolean; pathId: string; path: string
  delay: number; dur: number; size: number
}) {
  // Realistic bird silhouette: M-shape with spread wings
  const wingspan = size * 1.6
  const d = `M${-wingspan},0 C${-wingspan*0.6},${-size*0.4} ${-size*0.2},${-size*0.7} 0,${-size*0.3} C${size*0.2},${-size*0.7} ${wingspan*0.6},${-size*0.4} ${wingspan},0`

  return (
    <g>
      <path id={pathId} d={path} fill="none" stroke="none" />
      {animated ? (
        <path d={d} stroke="#374151" strokeWidth={size * 0.16} fill="none" strokeLinecap="round">
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${delay}s`} rotate="auto">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </path>
      ) : (
        <path
          d={d}
          transform={`translate(200, 140)`}
          stroke="#374151" strokeWidth={size * 0.16} fill="none" strokeLinecap="round"
          opacity="0.5"
        />
      )}
    </g>
  )
}
