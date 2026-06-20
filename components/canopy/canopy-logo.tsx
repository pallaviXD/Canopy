/**
 * Canopy Logo — inspired by the blue tree reference image.
 * Detailed SVG with dark trunk, layered blue-green foliage, fruit drops, ground.
 * Used as icon in header and sidebar.
 */

import { cn } from "@/lib/utils"

interface CanopyLogoProps {
  className?: string
  /** size in px for the icon variant */
  size?: number
  /** show just the mark, or mark + wordmark */
  variant?: "mark" | "full"
}

export function CanopyLogo({ className, size = 36, variant = "mark" }: CanopyLogoProps) {
  if (variant === "full") {
    return (
      <div className={cn("flex items-center gap-2.5", className)}>
        <CanopyMark size={size} />
        <span
          className="font-bold tracking-tight text-foreground"
          style={{ fontSize: size * 0.5 + 2 }}
        >
          Canopy
        </span>
      </div>
    )
  }
  return <CanopyMark size={size} className={className} />
}

export function CanopyMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      role="img"
      aria-label="Canopy logo"
    >
      <defs>
        {/* Deep trunk gradient */}
        <linearGradient id="logo-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e2433" />
          <stop offset="40%" stopColor="#2a3347" />
          <stop offset="100%" stopColor="#161b2a" />
        </linearGradient>
        {/* Dark deep leaf layer */}
        <linearGradient id="logo-leaf-dark" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#1e3a7a" />
          <stop offset="100%" stopColor="#152a5e" />
        </linearGradient>
        {/* Mid blue leaf */}
        <linearGradient id="logo-leaf-mid" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3b6fd4" />
          <stop offset="100%" stopColor="#2855b8" />
        </linearGradient>
        {/* Light accent leaves */}
        <linearGradient id="logo-leaf-light" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#6b9fe8" />
          <stop offset="100%" stopColor="#4a80d4" />
        </linearGradient>
        {/* Fruit / drop gradient */}
        <linearGradient id="logo-fruit" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#a8c8f8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7aaef0" stopOpacity="0.7" />
        </linearGradient>
        {/* Ground */}
        <linearGradient id="logo-ground" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1e2d5a" stopOpacity="0" />
          <stop offset="50%" stopColor="#2a3d78" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1e2d5a" stopOpacity="0" />
        </linearGradient>
        {/* Glass highlight */}
        <radialGradient id="logo-glass" cx="35%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* Background circle */}
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e2d5a" />
        </linearGradient>
        <filter id="logo-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background rounded square */}
      <rect width="200" height="200" rx="44" fill="url(#logo-bg)" />
      <rect width="200" height="200" rx="44" fill="url(#logo-glass)" />

      {/* Ground */}
      <ellipse cx="100" cy="178" rx="72" ry="8" fill="url(#logo-ground)" />

      {/* Small ground stones */}
      <ellipse cx="58" cy="176" rx="7" ry="5" fill="url(#logo-fruit)" opacity="0.5" />
      <ellipse cx="148" cy="177" rx="6" ry="4.5" fill="url(#logo-fruit)" opacity="0.4" />

      {/* Small ground plants */}
      <g opacity="0.6">
        <path d="M38 174 C36 168 32 165 30 160" stroke="#3b6fd4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="29" cy="159" rx="5" ry="3" fill="#3b6fd4" transform="rotate(-20 29 159)" />
        <path d="M162 174 C164 168 168 165 170 160" stroke="#3b6fd4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="171" cy="159" rx="5" ry="3" fill="#3b6fd4" transform="rotate(20 171 159)" />
      </g>

      {/* ---- TRUNK ---- */}
      {/* Main trunk */}
      <path
        d="M93 174 C91 155 89 135 91 110 L109 110 C111 135 109 155 107 174 Z"
        fill="url(#logo-trunk)"
      />
      {/* Trunk texture line */}
      <path d="M99 174 C98 145 97 120 99 108" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.08" fill="none" />

      {/* Left main branch */}
      <path d="M94 130 C82 122 68 118 56 112" stroke="url(#logo-trunk)" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Right main branch */}
      <path d="M106 125 C118 117 132 114 144 108" stroke="url(#logo-trunk)" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Left sub-branch */}
      <path d="M88 118 C76 108 62 102 50 96" stroke="url(#logo-trunk)" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Right sub-branch */}
      <path d="M112 115 C126 106 140 100 152 94" stroke="url(#logo-trunk)" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Top left branch */}
      <path d="M96 112 C86 100 74 90 64 82" stroke="url(#logo-trunk)" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Top right branch */}
      <path d="M104 110 C114 98 126 88 136 80" stroke="url(#logo-trunk)" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Top center branch */}
      <path d="M100 108 C100 94 100 82 100 70" stroke="url(#logo-trunk)" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* ---- DEEP LEAF LAYER (back) ---- */}
      <g filter="none" opacity="0.85">
        <ellipse cx="100" cy="88" rx="54" ry="46" fill="url(#logo-leaf-dark)" />
        <ellipse cx="58" cy="100" rx="32" ry="27" fill="url(#logo-leaf-dark)" />
        <ellipse cx="142" cy="98" rx="33" ry="28" fill="url(#logo-leaf-dark)" />
        <ellipse cx="72" cy="78" rx="26" ry="22" fill="url(#logo-leaf-dark)" />
        <ellipse cx="128" cy="76" rx="27" ry="22" fill="url(#logo-leaf-dark)" />
      </g>

      {/* ---- MID LEAF LAYER ---- */}
      <g opacity="0.95">
        <ellipse cx="100" cy="78" rx="46" ry="40" fill="url(#logo-leaf-mid)" />
        <ellipse cx="62" cy="92" rx="28" ry="24" fill="url(#logo-leaf-mid)" />
        <ellipse cx="138" cy="90" rx="29" ry="24" fill="url(#logo-leaf-mid)" />
        <ellipse cx="78" cy="66" rx="22" ry="19" fill="url(#logo-leaf-mid)" />
        <ellipse cx="122" cy="64" rx="23" ry="19" fill="url(#logo-leaf-mid)" />
        <ellipse cx="100" cy="58" rx="24" ry="20" fill="url(#logo-leaf-mid)" />
      </g>

      {/* ---- LIGHT LEAF HIGHLIGHTS ---- */}
      <g opacity="0.9">
        <ellipse cx="100" cy="68" rx="32" ry="26" fill="url(#logo-leaf-light)" />
        <ellipse cx="78" cy="76" rx="18" ry="15" fill="url(#logo-leaf-light)" />
        <ellipse cx="122" cy="74" rx="19" ry="15" fill="url(#logo-leaf-light)" />
        <ellipse cx="100" cy="50" rx="18" ry="16" fill="url(#logo-leaf-light)" />
        <ellipse cx="68" cy="84" rx="14" ry="12" fill="url(#logo-leaf-light)" opacity="0.7" />
        <ellipse cx="132" cy="82" rx="15" ry="12" fill="url(#logo-leaf-light)" opacity="0.7" />
      </g>

      {/* ---- INDIVIDUAL LEAVES (scattered) ---- */}
      {[
        { x: 54, y: 88, r: -30 }, { x: 48, y: 100, r: 15 }, { x: 60, y: 108, r: -10 },
        { x: 146, y: 86, r: 25 }, { x: 152, y: 98, r: -15 }, { x: 140, y: 110, r: 10 },
        { x: 64, y: 68, r: -20 }, { x: 136, y: 66, r: 20 }, { x: 100, y: 40, r: 0 },
        { x: 84, y: 54, r: -15 }, { x: 116, y: 52, r: 15 },
      ].map((l, i) => (
        <ellipse
          key={i}
          cx={l.x} cy={l.y} rx="9" ry="6"
          fill={i % 3 === 0 ? "#6b9fe8" : i % 3 === 1 ? "#3b6fd4" : "#1e3a7a"}
          opacity={0.7 + (i % 3) * 0.1}
          transform={`rotate(${l.r} ${l.x} ${l.y})`}
        />
      ))}

      {/* ---- FRUITS / DROPS ---- */}
      {[
        { x: 72, y: 105 }, { x: 88, y: 115 }, { x: 112, y: 113 }, { x: 128, y: 103 },
        { x: 58, y: 112 }, { x: 142, y: 110 }, { x: 100, y: 95 }, { x: 82, y: 88 }, { x: 118, y: 86 },
      ].map((f, i) => (
        <g key={i}>
          {/* stem */}
          <line x1={f.x} y1={f.y - 9} x2={f.x} y2={f.y - 6} stroke="#2a3347" strokeWidth="1" />
          {/* pear shape */}
          <ellipse cx={f.x} cy={f.y} rx={i % 2 === 0 ? 6 : 5} ry={i % 2 === 0 ? 8 : 7} fill="url(#logo-fruit)" />
          {/* highlight */}
          <ellipse cx={f.x - 1.5} cy={f.y - 2} rx="2" ry="2.5" fill="#ffffff" opacity="0.35" />
        </g>
      ))}

      {/* ---- GLASS SHEEN over entire icon ---- */}
      <rect width="200" height="200" rx="44" fill="url(#logo-glass)" opacity="0.5" />

      {/* Border shine */}
      <rect width="200" height="200" rx="44" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.12" />
    </svg>
  )
}
