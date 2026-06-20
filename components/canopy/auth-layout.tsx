"use client"

import React from "react"
import { EcosystemSvg } from "./ecosystem-svg"
import { getEcosystemState } from "@/lib/ecosystem-engine"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  // Use a preview state for the visual side
  const previewEcoState = getEcosystemState(
    { score: 85, level: 3, items: [], unlockedItems: [] },
    500,
    3
  )

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side: Visual / Canopy Brand */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-primary relative overflow-hidden text-primary-foreground p-12">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-sm border border-white/10">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            Canopy
          </Link>
        </div>

        <div className="relative z-10 max-w-md mx-auto mt-12 flex flex-col items-center justify-center">
          <div className="w-[400px] h-[400px] relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
             <EcosystemSvg state={previewEcoState} />
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Every choice is a seed.
          </h1>
          <p className="text-xl text-primary-foreground/80 font-medium">
            Watch your forest flourish as you track and reduce your carbon footprint.
          </p>
        </div>
        
        {/* Decorative background blur */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-leaf rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-chart-4 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-sky rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 md:p-16 lg:p-24 relative">
        <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 font-bold text-xl text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          Canopy
        </Link>
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
