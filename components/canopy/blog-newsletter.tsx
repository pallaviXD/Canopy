"use client"

import { useState } from "react"

export function BlogNewsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <div className="mt-20 rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-10 text-center">
      <span className="text-4xl">🌿</span>
      <h2 className="mt-4 text-2xl font-bold text-forest">Stay in the loop</h2>
      <p className="mt-2 text-muted-foreground">
        Weekly climate insights, new features, and sustainability science — straight to your inbox.
      </p>
      {submitted ? (
        <p className="mt-6 font-semibold text-emerald-700">
          🎉 You&apos;re in! Watch your inbox for the first issue.
        </p>
      ) : (
        <form
          className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full max-w-xs rounded-full border border-border bg-white px-5 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 sm:w-auto"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(5,150,105,0.3)] hover:shadow-[0_4px_20px_rgba(5,150,105,0.45)] transition-all"
          >
            Subscribe
          </button>
        </form>
      )}
      <p className="mt-3 text-xs text-muted-foreground">No spam. Unsubscribe any time.</p>
    </div>
  )
}
