"use client"

/**
 * Canopy — Auth Guard
 * Wrap any page to require authentication.
 * Shows a loading spinner while Firebase resolves auth state,
 * then redirects to /login if unauthenticated.
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getFirebaseAuth } from "@/lib/firebase-service"
import { onAuthStateChanged } from "firebase/auth"
import { Leaf } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    const auth = getFirebaseAuth()

    // If Firebase isn't configured, allow access (dev mode fallback)
    if (!auth) {
      setStatus("authenticated")
      return
    }

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setStatus("authenticated")
      } else {
        setStatus("unauthenticated")
        router.replace("/login")
      }
    })

    return unsub
  }, [router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 animate-pulse">
            <Leaf className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Loading your ecosystem…</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return <>{children}</>
}
