"use client"

import React, { useState } from "react"
import { Component as EtheralShadow } from "@/components/ui/etheral-shadow"
import { PixelHero } from "@/components/ui/pixel-perfect-hero"
import { Leaf, Eye, Code, Sparkles, Sliders } from "lucide-react"

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<"hero" | "shadow">("hero")
  
  // Shadow Component State Controls
  const [shadowColor, setShadowColor] = useState("rgba(16, 185, 129, 1)")
  const [shadowScale, setShadowScale] = useState(100)
  const [shadowSpeed, setShadowSpeed] = useState(90)
  const [noiseOpacity, setNoiseOpacity] = useState(1)
  const [noiseScale, setNoiseScale] = useState(1.2)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-bold text-lg tracking-tight">Canopy Component Lab</span>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-full">
          <button
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "hero"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            PixelPerfect Hero
          </button>
          <button
            onClick={() => setActiveTab("shadow")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "shadow"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Etheral Shadow
          </button>
        </div>
      </header>

      {/* Main Sandbox Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === "hero" ? (
          <div className="flex-1 relative">
            {/* Control HUD overlay for demonstration */}
            <div className="absolute top-4 left-4 z-40 bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl backdrop-blur max-w-sm pointer-events-auto">
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-450 rounded px-2 py-0.5 text-[10px] font-semibold mb-2">
                <Sparkles className="h-3 w-3" /> Live Sandbox
              </span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-1">PixelPerfect Hero</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Move your cursor across the background to interact with the outward physics canvas. Change window sizes to test fluid container scaling.
              </p>
            </div>
            
            <div className="border border-slate-900 rounded-3xl overflow-hidden shadow-inner">
              <PixelHero
                word1="Silent"
                word2="Precision."
                description="Minimalist interfaces driven by refined motion. Every calculated detail delivers an elevated digital experience."
                primaryCta="Explore Design"
                primaryCtaMobile="Explore"
                secondaryCta="View GitHub"
                secondaryCtaMobile="GitHub"
                onPrimaryClick={() => console.log("Primary click action triggered.")}
                onSecondaryClick={() => console.log("Secondary click action triggered.")}
                githubUrl="https://github.com"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 grid lg:grid-cols-[1fr_320px] p-6 gap-6">
            {/* Visualizer Area */}
            <div className="bg-slate-900 border border-slate-805 rounded-3xl overflow-hidden relative flex justify-center items-center h-[600px] lg:h-auto min-h-[400px]">
              <EtheralShadow
                color={shadowColor}
                animation={{ scale: shadowScale, speed: shadowSpeed }}
                noise={{ opacity: noiseOpacity, scale: noiseScale }}
                sizing="fill"
                showTitle={true}
                titleText="Etheral Shadows"
              />
            </div>

            {/* Customizer Sidebar */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
              <div className="space-y-1">
                <h3 className="font-bold flex items-center gap-2 text-white text-sm">
                  <Sliders className="h-4 w-4 text-emerald-400" />
                  Settings
                </h3>
                <p className="text-xs text-slate-400">Tweak shadow properties in real-time.</p>
              </div>

              <div className="space-y-4 flex-1">
                {/* Color Matrix */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-350 block">Shadow Glow Color</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { hex: "rgba(16, 185, 129, 1)", name: "Green" },
                      { hex: "rgba(14, 165, 233, 1)", name: "Sky" },
                      { hex: "rgba(168, 85, 247, 1)", name: "Purple" },
                      { hex: "rgba(244, 63, 94, 1)", name: "Rose" },
                      { hex: "rgba(128, 128, 128, 1)", name: "Gray" },
                    ].map((col) => (
                      <button
                        key={col.hex}
                        onClick={() => setShadowColor(col.hex)}
                        title={col.name}
                        className={`h-8 w-8 rounded-full border-2 transition ${
                          shadowColor === col.hex ? "border-white scale-110 shadow-md" : "border-transparent"
                        }`}
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-350">
                    <span>Displacement Scale</span>
                    <span className="text-emerald-400 font-bold">{shadowScale}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={shadowScale}
                    onChange={(e) => setShadowScale(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Speed Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-350">
                    <span>Turbulence Speed</span>
                    <span className="text-emerald-400 font-bold">{shadowSpeed}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={shadowSpeed}
                    onChange={(e) => setShadowSpeed(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Noise Opacity Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-350">
                    <span>Noise Opacity</span>
                    <span className="text-emerald-400 font-bold">{noiseOpacity}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={noiseOpacity}
                    onChange={(e) => setNoiseOpacity(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Noise Scale Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-slate-350">
                    <span>Noise Scale</span>
                    <span className="text-emerald-400 font-bold">{noiseScale}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={noiseScale}
                    onChange={(e) => setNoiseScale(Number(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500 bg-slate-950">
        Canopy Component Sandbox — React + Framer Motion + SVG Displacement
      </footer>
    </div>
  )
}
