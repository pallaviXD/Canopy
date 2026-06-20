"use client"
import React from "react"

interface SunlightProps {
  brightSun: boolean
  animated: boolean
}

export function Sunlight({ brightSun, animated }: SunlightProps) {
  const op = brightSun ? 1 : 0.2

  return (
    <g opacity={op} style={{ transition: "opacity 2s ease" }}>
      {/* Soft outer halo — renders under everything */}
      <circle cx="352" cy="58" r="52" fill="#fef08a" opacity="0.07" />
      <circle cx="352" cy="58" r="38" fill="#fef9c3" opacity="0.1" />

      {/* Sun disc with filter glow */}
      <g filter="url(#sun-glow)">
        <path
          d="M352,36 C365,36 376,47 376,60 C376,73 365,84 352,84
             C339,84 328,73 328,60 C328,47 339,36 352,36 Z"
          fill="url(#sl-sun)"
        />
      </g>

      {/* Rays — long alternating */}
      <g opacity="0.7">
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
          const r   = (deg * Math.PI) / 180
          const r1  = 30, r2 = 46 + (i % 2 === 0 ? 8 : 3)
          const x1  = 352 + Math.cos(r) * r1
          const y1  = 60  + Math.sin(r) * r1
          const x2  = 352 + Math.cos(r) * r2
          const y2  = 60  + Math.sin(r) * r2
          return (
            <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#fcd34d"
              strokeWidth={i % 2 === 0 ? "2" : "1.2"}
              strokeLinecap="round"
              opacity={i % 2 === 0 ? "0.9" : "0.55"}
            />
          )
        })}
      </g>

      {/* Animated pulse ring when bright */}
      {brightSun && animated && (
        <circle cx="352" cy="58" r="34" fill="none" stroke="#fcd34d" strokeWidth="1.5" opacity="0">
          <animate attributeName="r" values="30;52;30" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Light shaft through canopy */}
      {brightSun && (
        <g opacity="0.055">
          <path d="M300,105 L258,290 L318,290 L360,105 Z" fill="#fef9c3" />
          <path d="M228,98 L200,300 L248,300 L276,98 Z" fill="#fef9c3" />
        </g>
      )}

      {/* Dappled ground light */}
      {brightSun && (
        <g opacity="0.1">
          <path d="M168,416 C172,413 178,413 180,416 C176,418 170,418 168,416 Z" fill="#fde047" />
          <path d="M242,414 C247,411 254,411 256,414 C252,416 246,416 242,414 Z" fill="#fde047" />
          <path d="M292,417 C296,414 302,414 304,417 C300,419 294,419 292,417 Z" fill="#fde047" />
        </g>
      )}
    </g>
  )
}
