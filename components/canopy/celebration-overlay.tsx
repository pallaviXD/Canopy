"use client"

/**
 * Canopy — Celebration Overlay
 * Renders micro-animations when users hit milestones.
 * Leaf burst, flower bloom, bird arrival, tree growth.
 */

import { useEffect, useRef } from "react"
import { useCanopyStore, selectCelebration } from "@/lib/store"
import { CelebrationTrigger } from "@/lib/ecosystem-engine"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  type: "leaf" | "flower" | "sparkle"
  rotation: number
  rotationSpeed: number
}

const LEAF_COLORS = ["#4ade80", "#22c55e", "#16a34a", "#86efac", "#bbf7d0"]
const FLOWER_COLORS = ["#fbcfe8", "#f9a8d4", "#fbbf24", "#fde68a", "#c4b5fd"]
const SPARKLE_COLORS = ["#22c55e", "#fbbf24", "#0ea5e9", "#f9a8d4"]

function getParticleConfig(event: CelebrationTrigger["event"]): {
  count: number
  colors: string[]
  type: Particle["type"]
} {
  switch (event) {
    case "challenge_completed":
      return { count: 40, colors: FLOWER_COLORS, type: "flower" }
    case "ecosystem_upgrade":
      return { count: 60, colors: LEAF_COLORS, type: "leaf" }
    case "streak_milestone":
      return { count: 50, colors: SPARKLE_COLORS, type: "sparkle" }
    case "first_log":
      return { count: 30, colors: LEAF_COLORS, type: "leaf" }
    case "achievement_unlocked":
      return { count: 45, colors: SPARKLE_COLORS, type: "sparkle" }
    default:
      return { count: 35, colors: LEAF_COLORS, type: "sparkle" }
  }
}

export function CelebrationOverlay() {
  const celebration = useCanopyStore(selectCelebration)
  const dismiss = useCanopyStore((s) => s.dismissCelebration)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    if (!celebration || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const renderCtx: CanvasRenderingContext2D = ctx

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const config = getParticleConfig(celebration.event)
    particlesRef.current = Array.from({ length: config.count }, () => ({
      x: canvas.width * 0.3 + Math.random() * canvas.width * 0.4,
      y: canvas.height * 0.6 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 12 + 6),
      life: 1,
      maxLife: 0.6 + Math.random() * 0.8,
      size: 6 + Math.random() * 12,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      type: config.type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
    }))

    function drawLeaf(ctx: CanvasRenderingContext2D, p: Particle) {      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.life
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    function drawFlower(ctx: CanvasRenderingContext2D, p: Particle) {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.life
      for (let i = 0; i < 5; i++) {
        ctx.save()
        ctx.rotate((i * Math.PI * 2) / 5)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.ellipse(0, -p.size * 0.7, p.size * 0.35, p.size * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      ctx.fillStyle = "#fbbf24"
      ctx.beginPath()
      ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    function drawSparkle(ctx: CanvasRenderingContext2D, p: Particle) {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.life
      ctx.fillStyle = p.color
      ctx.beginPath()
      for (let i = 0; i < 4; i++) {
        ctx.save()
        ctx.rotate((i * Math.PI) / 2)
        ctx.moveTo(0, 0)
        ctx.lineTo(p.size * 0.2, p.size * 0.2)
        ctx.lineTo(0, p.size)
        ctx.lineTo(-p.size * 0.2, p.size * 0.2)
        ctx.closePath()
        ctx.restore()
      }
      ctx.fill()
      ctx.restore()
    }

    function animate() {
      renderCtx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0.01)

      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.25 // gravity
        p.vx *= 0.99
        p.rotation += p.rotationSpeed
        p.life -= 0.012

        if (p.type === "leaf") drawLeaf(renderCtx, p)
        else if (p.type === "flower") drawFlower(renderCtx, p)
        else drawSparkle(renderCtx, p)
      }

      if (particlesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)

    // Auto-dismiss after 3.5s
    const timer = setTimeout(dismiss, 3500)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animRef.current)
    }
  }, [celebration, dismiss])

  if (!celebration) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      aria-live="polite"
      aria-label={celebration.message}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Toast notification */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 animate-rise-in">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-5 py-3.5 shadow-[0_20px_50px_rgba(16,24,40,0.2)] backdrop-blur-md">
          <span className="text-2xl" role="img" aria-hidden>
            {celebration.emoji}
          </span>
          <p className="text-sm font-semibold text-foreground">{celebration.message}</p>
        </div>
      </div>
    </div>
  )
}
