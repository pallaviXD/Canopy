"use client"

/**
 * Canopy — Live AI Coach
 * Connected to Gemini via API route.
 * Reads real user data from the store.
 */

import { useState, useRef, useEffect } from "react"
import { Sparkles, Bot, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCanopyStore, CoachMessage } from "@/lib/store"
import { buildSystemPrompt, buildUserPrompt, buildCoachContext, QUICK_PROMPTS } from "@/lib/gemini-context-builder"
import { startOfWeek } from "@/lib/carbon-engine"

export function AiCoachLive() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {
    logs,
    activeChallenges,
    streak,
    weeklyEmissions,
    prevWeekEmissions,
    coachMessages,
    coachLoading,
    addCoachMessage,
    setCoachLoading,
  } = useCanopyStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [coachMessages])

  async function sendMessage(text: string) {
    if (!text.trim() || coachLoading) return

    addCoachMessage({ role: "user", content: text })
    setCoachLoading(true)
    setInput("")

    const context = buildCoachContext(
      logs,
      activeChallenges,
      streak.currentStreak,
      weeklyEmissions,
      prevWeekEmissions
    )
    const systemPrompt = buildSystemPrompt()
    const userPrompt = buildUserPrompt(context, text)

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userPrompt }),
      })
      const data = await res.json()
      addCoachMessage({
        role: "coach",
        content: data.response ?? "I couldn't generate a response right now. Please try again.",
      })
    } catch {
      addCoachMessage({
        role: "coach",
        content: "Connection error. Please check your internet connection and try again.",
      })
    } finally {
      setCoachLoading(false)
    }
  }

  const displayMessages = coachMessages.length === 0
    ? [DEMO_MESSAGE]
    : coachMessages

  return (
    <section id="ai-coach" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-forest">
            <Sparkles className="h-4 w-4 text-primary" />
            Powered by Gemini
          </span>
          <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            A coach that understands your footprint
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Ask anything. Canopy&apos;s AI Coach reads your real activity data and replies with
            specific, achievable steps — complete with the carbon you&apos;ll save.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Personalized advice grounded in your data",
              "Clear CO₂ savings for every suggestion",
              "Gentle nudges that build lasting habits",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-[0_20px_50px_rgba(16,24,40,0.1)] sm:p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold leading-tight">Canopy Coach</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Online
              </p>
            </div>
          </div>

          <div className="max-h-64 space-y-4 overflow-y-auto py-5 pr-1">
            {displayMessages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {coachLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-3xl rounded-bl-md bg-secondary px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-wrap gap-2 pb-4">
            {QUICK_PROMPTS.slice(0, 4).map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={coachLoading}
                className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-forest disabled:opacity-50"
              >
                {p.length > 28 ? p.slice(0, 28) + "…" : p}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
            className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your coach anything…"
              disabled={coachLoading}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={coachLoading || !input.trim()}
              aria-label="Send"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function MessageBubble({ msg }: { msg: CoachMessage }) {
  const isUser = msg.role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-secondary text-foreground"
        }`}
        dangerouslySetInnerHTML={{ __html: formatCoachResponse(msg.content) }}
      />
    </div>
  )
}

function formatCoachResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-forest">$1</strong>')
    .replace(/\n/g, "<br/>")
}

const DEMO_MESSAGE: CoachMessage = {
  id: "demo",
  role: "coach",
  content:
    "Hi! I'm your Canopy Coach. Log some activities and ask me anything — I'll give you personalized advice based on your real footprint data.",
  timestamp: Date.now(),
}
