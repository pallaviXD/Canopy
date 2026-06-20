"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Loader2, Sparkles, Trash2, Leaf, TrendingDown, Zap } from "lucide-react"
import { useCanopyStore, CoachMessage } from "@/lib/store"
import { buildSystemPrompt, buildUserPrompt, buildCoachContext, QUICK_PROMPTS } from "@/lib/gemini-context-builder"

export function CoachPanel() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const {
    logs,
    activeChallenges,
    streak,
    weeklyEmissions,
    prevWeekEmissions,
    canopyScore,
    coachMessages,
    coachLoading,
    addCoachMessage,
    setCoachLoading,
    clearCoachHistory,
  } = useCanopyStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [coachMessages, coachLoading])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || coachLoading) return

    addCoachMessage({ role: "user", content: trimmed })
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
    const userPrompt   = buildUserPrompt(context, trimmed)

    try {
      const res  = await fetch("/api/coach", {
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
        content: "Connection error. Please check your internet connection.",
      })
    } finally {
      setCoachLoading(false)
    }
  }

  const displayMessages: CoachMessage[] = coachMessages.length === 0
    ? [WELCOME_MESSAGE]
    : coachMessages

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Coach</h2>
          <p className="mt-1 text-sm text-muted-foreground">Powered by Gemini • reads your real data</p>
        </div>
        <button
          onClick={clearCoachHistory}
          className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          title="Clear conversation"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      {/* Context summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <ContextCard label="Weekly CO₂" value={`${weeklyEmissions.toFixed(1)}kg`} icon={<Leaf className="h-4 w-4 text-primary" />} />
        <ContextCard label="Canopy Score" value={String(canopyScore)} icon={<Sparkles className="h-4 w-4 text-[#b45309]" />} />
        <ContextCard label="Streak" value={`${streak.currentStreak}d`} icon={<TrendingDown className="h-4 w-4 text-sky" />} />
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col rounded-3xl border border-border bg-card shadow-[0_8px_30px_rgba(16,24,40,0.05)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0" style={{ maxHeight: "420px" }}>
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

        {/* Quick prompts */}
        <div className="border-t border-border px-5 py-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Quick questions</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={coachLoading}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-forest disabled:opacity-50"
              >
                {p.length > 32 ? p.slice(0, 32) + "…" : p}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
            className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5"
          >
            <Bot className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your footprint, habits, or challenges…"
              disabled={coachLoading}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={coachLoading || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/25 transition-opacity disabled:opacity-40"
            >
              {coachLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: CoachMessage }) {
  const isUser = msg.role === "user"
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Bot className="h-3.5 w-3.5" />
        </span>
      )}
      <p
        className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-secondary text-foreground"
        }`}
        dangerouslySetInnerHTML={{ __html: formatResponse(msg.content) }}
      />
    </div>
  )
}

function formatResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-forest font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, "<br/>")
}

function ContextCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted-foreground">{label}</p>
        <p className="font-bold leading-tight">{value}</p>
      </div>
    </div>
  )
}

const WELCOME_MESSAGE: CoachMessage = {
  id: "welcome",
  role: "coach",
  content:
    "Hi! I'm your **Canopy Coach**, powered by Gemini. I can see your real emission data and give you personalized advice.\n\nLog some activities and ask me anything — from reducing travel emissions to choosing greener meals.",
  timestamp: Date.now(),
}
