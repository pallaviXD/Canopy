"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanopyLogo } from "@/components/canopy/canopy-logo"

const navItems = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "AI Coach", href: "#ai-coach" },
  { label: "Challenges", href: "#challenges" },
  { label: "Insights", href: "#insights" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-3xl px-4 py-3 sm:px-6 transition-all duration-300 ${
          scrolled
            ? "border border-emerald-200/60 bg-white/85 shadow-[0_8px_40px_rgba(5,150,105,0.12)] backdrop-blur-xl"
            : "border border-white/30 bg-white/60 shadow-[0_8px_30px_rgba(5,150,105,0.06)] backdrop-blur-md"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 group">
          <CanopyLogo size={36} />
          <span className="text-lg font-bold tracking-tight text-forest group-hover:text-primary transition-colors duration-200">
            Canopy
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            render={<Link href="/dashboard" />}
            variant="ghost"
            className="rounded-full font-medium text-forest hover:bg-emerald-50 hover:text-primary"
          >
            Sign in
          </Button>
          <Button
            render={<Link href="/onboarding" />}
            className="rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 font-semibold text-white shadow-[0_4px_16px_rgba(5,150,105,0.35)] hover:shadow-[0_4px_20px_rgba(5,150,105,0.5)] hover:scale-[1.02] transition-all duration-200 border-0"
          >
            Start Growing
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-white/80 text-forest hover:bg-emerald-50 transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-emerald-200/60 bg-white/90 p-4 shadow-[0_8px_30px_rgba(5,150,105,0.12)] backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-emerald-50 hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button
              render={<Link href="/onboarding" onClick={() => setOpen(false)} />}
              className="mt-2 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 font-semibold text-white border-0"
            >
              Start Growing
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
