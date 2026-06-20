"use client"
/**
 * Tree — organic SVG paths only. Real branch structure.
 * Trunk tapers naturally. Branches fork with decreasing width.
 * 7 stages of growth, all via path data.
 */
import React from "react"
import type { EcosystemStage } from "@/lib/ecosystem-engine"

interface TreeProps {
  stage: EcosystemStage
  animated: boolean
}

export function Tree({ stage, animated }: TreeProps) {
  return (
    <g
      className={animated ? "animate-sway" : ""}
      style={{ transformOrigin: "220px 416px" }}
    >
      {stage === 1 && <BareSprout />}
      {stage === 2 && <TinySapling />}
      {stage === 3 && <YoungTree />}
      {stage >= 4 && <MatureTree stage={stage} />}
    </g>
  )
}

/* ── Stage 1: bare sprout with two tiny leaves ── */
function BareSprout() {
  return (
    <g>
      <path d="M219 418 C219 410 219 400 220 390 C220 400 221 410 221 418 Z" fill="#92400e" />
      {/* Tiny leaf left */}
      <path
        d="M220 400 C216 396 213 390 215 385 C218 382 222 385 221 392 Z"
        fill="#4ade80" opacity="0.85"
      />
      {/* Tiny leaf right */}
      <path
        d="M220 400 C224 396 227 390 225 385 C222 382 218 385 219 392 Z"
        fill="#22c55e" opacity="0.85"
      />
    </g>
  )
}

/* ── Stage 2: thin sapling, 2 branch stubs ── */
function TinySapling() {
  return (
    <g>
      {/* Trunk */}
      <path
        d="M217 418 C217 400 217 375 218 355 C219 355 221 355 222 355 C221 375 221 400 223 418 Z"
        fill="url(#t-trunk-young)"
      />
      {/* Left branch stub */}
      <path
        d="M218 375 C212 370 206 368 202 366"
        stroke="#7c4a23" strokeWidth="3" fill="none" strokeLinecap="round"
      />
      {/* Right branch stub */}
      <path
        d="M222 370 C228 365 234 363 238 361"
        stroke="#7c4a23" strokeWidth="3" fill="none" strokeLinecap="round"
      />
    </g>
  )
}

/* ── Stage 3: young tree with visible branch structure ── */
function YoungTree() {
  return (
    <g>
      {/* Trunk */}
      <path
        d="M213 418 C212 395 211 370 213 345 C215 330 218 315 220 295
           C222 315 225 330 227 345 C229 370 228 395 227 418 Z"
        fill="url(#t-trunk-young)"
      />
      {/* Left main branch */}
      <path
        d="M214 348 C204 338 192 332 182 326"
        stroke="#7c4a23" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      {/* Left sub-branch */}
      <path
        d="M182 326 C175 318 170 308 168 298"
        stroke="#7c4a23" strokeWidth="3.5" fill="none" strokeLinecap="round"
      />
      <path
        d="M182 326 C178 322 172 320 166 318"
        stroke="#7c4a23" strokeWidth="3" fill="none" strokeLinecap="round"
      />
      {/* Right main branch */}
      <path
        d="M226 342 C236 332 248 326 258 320"
        stroke="#7c4a23" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      <path
        d="M258 320 C265 312 268 302 270 292"
        stroke="#7c4a23" strokeWidth="3.5" fill="none" strokeLinecap="round"
      />
      <path
        d="M258 320 C262 316 268 314 274 312"
        stroke="#7c4a23" strokeWidth="3" fill="none" strokeLinecap="round"
      />
      {/* Top branch */}
      <path
        d="M220 295 C220 282 219 270 218 258"
        stroke="#7c4a23" strokeWidth="4" fill="none" strokeLinecap="round"
      />
    </g>
  )
}

/* ── Stages 4-7: full mature tree with detailed branching ── */
function MatureTree({ stage }: { stage: EcosystemStage }) {
  const lush   = stage >= 5
  const forest = stage >= 6

  return (
    <g>
      {/* ══ TRUNK ══ */}
      {/* Main trunk shape — tapers toward crown */}
      <path
        d="M207 418
           C205 395 203 368 205 342
           C207 320 212 300 215 278
           C216 265 217 252 218 238
           L222 238
           C223 252 224 265 225 278
           C228 300 233 320 235 342
           C237 368 235 395 233 418 Z"
        fill="url(#t-trunk-mature)"
      />
      {/* Root flare left */}
      <path
        d="M207 418 C202 412 196 408 190 406"
        stroke="url(#t-trunk-mature)" strokeWidth="8" fill="none" strokeLinecap="round"
      />
      {/* Root flare right */}
      <path
        d="M233 418 C238 412 244 408 250 406"
        stroke="url(#t-trunk-mature)" strokeWidth="8" fill="none" strokeLinecap="round"
      />
      {/* Trunk texture */}
      <path
        d="M214 418 C213 390 212 360 213 330"
        stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.07" fill="none"
      />
      <path
        d="M226 418 C227 390 228 360 227 330"
        stroke="#000000" strokeWidth="0.8" strokeOpacity="0.08" fill="none"
      />

      {/* ══ LOWER BRANCHES ══ */}
      {/* Far left lower */}
      <path
        d="M209 360 C196 348 180 342 164 336"
        stroke="#6b3a1f" strokeWidth="10" fill="none" strokeLinecap="round"
      />
      <path
        d="M164 336 C154 326 148 314 146 302"
        stroke="#6b3a1f" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      <path
        d="M164 336 C158 330 150 328 142 326"
        stroke="#6b3a1f" strokeWidth="5" fill="none" strokeLinecap="round"
      />
      {/* Far right lower */}
      <path
        d="M231 354 C244 342 260 336 276 330"
        stroke="#6b3a1f" strokeWidth="10" fill="none" strokeLinecap="round"
      />
      <path
        d="M276 330 C286 320 292 308 294 296"
        stroke="#6b3a1f" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      <path
        d="M276 330 C282 324 290 322 298 320"
        stroke="#6b3a1f" strokeWidth="5" fill="none" strokeLinecap="round"
      />

      {/* ══ MID BRANCHES ══ */}
      {/* Left mid */}
      <path
        d="M210 330 C198 318 184 310 170 304"
        stroke="#7c4a23" strokeWidth="8" fill="none" strokeLinecap="round"
      />
      <path
        d="M170 304 C162 294 158 282 156 270"
        stroke="#7c4a23" strokeWidth="5" fill="none" strokeLinecap="round"
      />
      <path
        d="M170 304 C164 298 156 294 148 292"
        stroke="#7c4a23" strokeWidth="4.5" fill="none" strokeLinecap="round"
      />
      {/* Right mid */}
      <path
        d="M230 324 C242 312 256 304 270 298"
        stroke="#7c4a23" strokeWidth="8" fill="none" strokeLinecap="round"
      />
      <path
        d="M270 298 C278 288 282 276 284 264"
        stroke="#7c4a23" strokeWidth="5" fill="none" strokeLinecap="round"
      />
      <path
        d="M270 298 C276 292 284 288 292 286"
        stroke="#7c4a23" strokeWidth="4.5" fill="none" strokeLinecap="round"
      />

      {/* ══ UPPER BRANCHES ══ */}
      {/* Left upper */}
      <path
        d="M213 296 C202 282 190 272 178 262"
        stroke="#8b5523" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      <path
        d="M178 262 C172 252 168 240 168 228"
        stroke="#8b5523" strokeWidth="3.5" fill="none" strokeLinecap="round"
      />
      <path
        d="M178 262 C170 258 162 256 154 254"
        stroke="#8b5523" strokeWidth="3" fill="none" strokeLinecap="round"
      />
      {/* Right upper */}
      <path
        d="M227 290 C238 276 250 266 262 256"
        stroke="#8b5523" strokeWidth="6" fill="none" strokeLinecap="round"
      />
      <path
        d="M262 256 C268 246 272 234 272 222"
        stroke="#8b5523" strokeWidth="3.5" fill="none" strokeLinecap="round"
      />
      <path
        d="M262 256 C270 252 278 250 286 248"
        stroke="#8b5523" strokeWidth="3" fill="none" strokeLinecap="round"
      />
      {/* Center crown */}
      <path
        d="M220 270 C219 255 218 240 217 225 C217 210 218 198 220 185"
        stroke="#8b5523" strokeWidth="5" fill="none" strokeLinecap="round"
      />
      <path
        d="M218 225 C212 218 204 214 196 210"
        stroke="#8b5523" strokeWidth="3" fill="none" strokeLinecap="round"
      />
      <path
        d="M218 225 C224 218 232 214 240 210"
        stroke="#8b5523" strokeWidth="3" fill="none" strokeLinecap="round"
      />

      {/* ══ LUSH EXTRA BRANCHES (stage 5+) ══ */}
      {lush && (
        <g>
          <path
            d="M207 348 C190 334 172 326 154 320"
            stroke="#6b3a1f" strokeWidth="7" fill="none" strokeLinecap="round"
          />
          <path
            d="M154 320 C146 310 140 298 138 286"
            stroke="#6b3a1f" strokeWidth="4" fill="none" strokeLinecap="round"
          />
          <path
            d="M233 342 C250 328 268 320 286 314"
            stroke="#6b3a1f" strokeWidth="7" fill="none" strokeLinecap="round"
          />
          <path
            d="M286 314 C294 304 300 292 302 280"
            stroke="#6b3a1f" strokeWidth="4" fill="none" strokeLinecap="round"
          />
        </g>
      )}

      {/* ══ FOREST BRANCHES (stage 6+) ══ */}
      {forest && (
        <g>
          <path
            d="M209 340 C190 322 168 314 146 308"
            stroke="#5a3018" strokeWidth="8" fill="none" strokeLinecap="round"
          />
          <path
            d="M146 308 C136 296 130 282 128 268"
            stroke="#5a3018" strokeWidth="5" fill="none" strokeLinecap="round"
          />
          <path
            d="M231 334 C252 316 274 308 296 302"
            stroke="#5a3018" strokeWidth="8" fill="none" strokeLinecap="round"
          />
          <path
            d="M296 302 C306 290 312 276 314 262"
            stroke="#5a3018" strokeWidth="5" fill="none" strokeLinecap="round"
          />
        </g>
      )}
    </g>
  )
}
