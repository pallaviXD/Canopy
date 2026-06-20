"use client"

import Link from "next/link"
import { LayoutDashboard, PlusCircle, Bot, LineChart, Trophy, User, Leaf, LogOut } from "lucide-react"
import { useCanopyStore, selectStreak } from "@/lib/store"

const nav = [
  { label: "Dashboard",    icon: LayoutDashboard },
  { label: "Log Activity", icon: PlusCircle },
  { label: "AI Coach",     icon: Bot },
  { label: "Insights",     icon: LineChart },
  { label: "Challenges",   icon: Trophy },
  { label: "Profile",      icon: User },
]

export function DashboardSidebar({
  active,
  onSelect,
}: {
  active: string
  onSelect: (label: string) => void
}) {
  const streakData   = useCanopyStore(selectStreak)
  const user         = useCanopyStore((s) => s.user)
  const openLogModal = useCanopyStore((s) => s.openLogModal)

  const initials = user.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  function handleSelect(label: string) {
    if (label === "Log Activity") {
      openLogModal("travel")
    } else {
      onSelect(label)
    }
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
      <Link href="/" className="flex items-center gap-2 px-2 py-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Leaf className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold tracking-tight">Canopy</span>
      </Link>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const isActive = item.label === active
          return (
            <button
              key={item.label}
              onClick={() => handleSelect(item.label)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Streak card */}
      <div className="rounded-3xl bg-secondary p-4">
        <p className="text-sm font-semibold text-forest">
          {streakData.currentStreak > 0
            ? `${streakData.currentStreak}-day streak 🔥`
            : "Start your streak"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {streakData.currentStreak > 0
            ? "Keep logging to grow your tree."
            : "Log today to begin."}
        </p>
        <div className="mt-3 flex gap-1">
          {streakData.streakDots.map((active, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                active ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* User row */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl px-2 py-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white">
          {initials || "?"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">{user.displayName || "Guest"}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Link href="/" className="text-muted-foreground hover:text-foreground" aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}
