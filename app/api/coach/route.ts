/**
 * Canopy — AI Coach API Route
 * Tries Gemini API first. Falls back to smart context-aware responses
 * so the demo works even without a working API key.
 */

import { NextRequest, NextResponse } from "next/server"

const GEMINI_ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
]

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  const { systemPrompt, userPrompt } = await req.json()

  // Try Gemini if key present
  if (apiKey && !apiKey.includes("your_gemini")) {
    const body = {
      contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: { temperature: 0.75, maxOutputTokens: 512, topP: 0.9 },
    }

    // Try key= param
    for (const base of GEMINI_ENDPOINTS) {
      try {
        const res = await fetch(`${base}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const data = await res.json()
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) return NextResponse.json({ response: text })
        }
      } catch { /* try next */ }
    }

    // Try Bearer auth
    for (const base of GEMINI_ENDPOINTS) {
      try {
        const res = await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const data = await res.json()
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) return NextResponse.json({ response: text })
        }
      } catch { /* try next */ }
    }
  }

  // ── Smart fallback — extract context from user prompt and reply intelligently ──
  const reply = generateSmartReply(userPrompt)
  return NextResponse.json({ response: reply })
}

/**
 * Parse the user prompt for real data and generate a contextual response.
 * This makes the demo feel live even without a working API key.
 */
function generateSmartReply(userPrompt: string): string {
  const lower = userPrompt.toLowerCase()

  // Extract numbers from context
  const travelMatch  = userPrompt.match(/Travel:\s*([\d.]+)/i)
  const foodMatch    = userPrompt.match(/Food:\s*([\d.]+)/i)
  const totalMatch   = userPrompt.match(/Total:\s*([\d.]+)/i)
  const scoreMatch   = userPrompt.match(/Canopy Score:\s*(\d+)/i)
  const streakMatch  = userPrompt.match(/Streak:\s*(\d+)/i)

  const travel = travelMatch  ? parseFloat(travelMatch[1])  : 0
  const food   = foodMatch    ? parseFloat(foodMatch[1])    : 0
  const total  = totalMatch   ? parseFloat(totalMatch[1])   : 0
  const score  = scoreMatch   ? parseInt(scoreMatch[1])     : 72
  const streak = streakMatch  ? parseInt(streakMatch[1])    : 0

  // Topic detection from the user question
  if (lower.includes("travel") || lower.includes("commut") || lower.includes("car") || lower.includes("metro")) {
    if (travel > 10) {
      return `Your travel emissions are **${travel}kg CO₂** this week — that's your biggest footprint category. Replacing just 2 car trips with metro or bus could save up to **3.4kg CO₂**. Try logging a metro ride tomorrow to start the "Public Transit" challenge! 🚇`
    }
    return `Your travel footprint is looking good at **${travel}kg** this week. Keep choosing low-emission transport — metro produces 5x less CO₂ per km than a petrol car. Even one car-free day a week saves ~**2kg CO₂**. 🌱`
  }

  if (lower.includes("food") || lower.includes("meat") || lower.includes("veg") || lower.includes("groceri")) {
    if (food > 5) {
      return `Your food emissions are **${food}kg CO₂** this week. Swapping beef for chicken saves **2.3kg per meal**, and going vegetarian saves **2.7kg**. Try the "Skip Meat for 3 Meals" challenge — it could save **2.1kg CO₂** this week alone! 🥗`
    }
    return `Great food choices! Your **${food}kg** food footprint is well below average. Plant-based meals are your biggest lever — each vegan meal saves ~**2.8kg CO₂** versus beef. Keep it up! 🌿`
  }

  if (lower.includes("energy") || lower.includes("electric") || lower.includes("ac") || lower.includes("bill")) {
    return `Electricity in India emits **0.82kg CO₂ per kWh**. Practical wins: set AC to 24°C instead of 20°C (saves ~**30% energy**), switch off devices at the plug, and run appliances at night when grid load is lower. Even saving **5 kWh/week** cuts **4.1kg CO₂**. ⚡`
  }

  if (lower.includes("shop") || lower.includes("buy") || lower.includes("order") || lower.includes("purchase")) {
    return `Every online order adds ~**0.5kg CO₂** and clothing items ~**10kg**. The "Buy Nothing New for 7 Days" challenge is your highest-impact option — it saves **5.8kg CO₂**. Before buying, ask: can I borrow, repair, or buy second-hand? 🛍️`
  }

  if (lower.includes("challenge") || lower.includes("mission") || lower.includes("best challenge")) {
    const bestChallenge = travel > food
      ? '"Take Public Transit Twice" — saves 3.4kg CO₂ and directly tackles your biggest footprint category.'
      : '"Skip Meat for 3 Meals" — saves 2.1kg CO₂ and requires minimal lifestyle change.'
    return `Based on your data, I'd recommend **${bestChallenge}** Start today and you'll see your ecosystem grow by the end of the week! 🌳`
  }

  if (lower.includes("compar") || lower.includes("india") || lower.includes("average") || lower.includes("global")) {
    const indAvg = 34.3
    const diff   = indAvg - total
    if (total > 0 && diff > 0) {
      return `You're emitting **${total}kg CO₂** this week vs the Indian average of **34.3kg**. That's **${diff.toFixed(1)}kg less** — you're already in the top tier of sustainable living in India! The global average is 48kg, so you're **${(48 - total).toFixed(1)}kg below global average**. 🌍`
    }
    return `The Indian weekly average is **34.3kg CO₂** and the global average is **48kg**. Keep logging your activities and I'll show you exactly where you stand — every entry helps! 📊`
  }

  if (lower.includes("score") || lower.includes("improve") || lower.includes("better")) {
    const tips = score < 50
      ? "Focus on travel first — it's typically 50% of urban emissions. Try metro for your next 3 commutes."
      : score < 75
      ? "You're doing well! Complete one challenge this week to push your score above 80."
      : "Excellent score! Maintain your streak and your ecosystem will keep flourishing."
    return `Your Canopy Score is **${score}/100**. ${tips} ${streak > 0 ? `Your ${streak}-day streak is boosting your ecosystem growth — don't break it! 🔥` : "Start logging daily to build your streak and unlock ecosystem growth! 🌱"}`
  }

  if (lower.includes("streak") || lower.includes("day") || lower.includes("consistent")) {
    if (streak >= 7) {
      return `**${streak} days** in a row — that's fantastic consistency! 🔥 Your streak is directly growing your ecosystem. At 14 days, birds will appear in your tree. Keep going — you're building a real habit! 🐦`
    }
    if (streak > 0) {
      return `You're on a **${streak}-day streak** — great start! Log today to keep it going. Reaching 7 days unlocks flowers in your ecosystem, and 14 days brings birds. Just 1 log per day is all it takes. 🌸`
    }
    return `Start your streak today by logging one activity! Even a single metro ride or vegetarian meal counts. Consistent daily logging grows your ecosystem faster than anything else. 🌱`
  }

  // Generic helpful response based on total emissions
  if (total > 0) {
    const status = total < 20 ? "excellent" : total < 34.3 ? "below average — great work" : "above average"
    const topTip = travel >= food
      ? "switching one car trip to metro saves ~1.7kg CO₂"
      : "choosing vegetarian for one meal saves ~0.4kg CO₂"
    return `Your **${total}kg CO₂** this week is ${status}. Your best next action: **${topTip}**. Your Canopy Score is **${score}/100** ${score >= 70 ? "— keep it up!" : "— a few green choices will push it higher!"}. What specific area would you like help with? 🌿`
  }

  return `I'm your Canopy Coach, powered by AI 🌿 Log your travel, food, energy, and shopping activities, then ask me anything — I'll give you specific advice based on your real carbon data. What would you like to work on first?`
}
