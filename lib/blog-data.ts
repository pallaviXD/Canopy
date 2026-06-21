/**
 * Canopy — Blog Data
 * The official build-in-public article for PromptWars submission.
 */

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    role: string
    avatar: string
  }
  category: string
  readTime: number
  publishedAt: string
  coverImage: string
  coverEmoji: string
  tags: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "your-carbon-footprint-just-grew-a-soul-inside-canopy",
    title: "Your Carbon Footprint Just Grew a Soul: Inside Canopy",
    excerpt:
      "There's a particular kind of fatigue that comes with most sustainability apps. Canopy starts from a simple but stubborn question: what if your carbon data wasn't a spreadsheet, but a living thing?",
    content: `
## A Tree That Knows What You Did Today

There's a particular kind of fatigue that comes with most sustainability apps. You log a commute, a meal, a purchase — and in return you get a number. A graph ticks slightly upward or downward. You close the tab and forget about it by lunch.

Canopy, built for **PromptWars Virtual**, starts from a simple but stubborn question: what if your carbon data wasn't a spreadsheet, but a living thing?

At the center of Canopy isn't a dashboard widget — it's an organic, hand-animated SVG ecosystem that responds to your real-world choices. Take the metro instead of a cab, eat a vegetarian meal, skip an unnecessary online order, and somewhere on your screen a tree quietly grows a little fuller.

The ecosystem moves through **seven distinct stages**, each one a small reward for sustained behavior rather than a single good day:

- **Bare Soil** — a tiny sprout just breaking through
- **Small Sapling** — the first leaves unfurl
- **Young Tree** — branches start reaching outward
- **Healthy Tree** — a full, established canopy
- **Large Tree** — flowers bloom across the branches
- **Forest Tree** — birds arrive and nest
- **Flourishing Ecosystem** — butterflies, particle effects, a fully alive scene

It's a deceptively simple idea, but it changes the emotional weight of the data. A declining number feels like failure. A wilting tree feels like neglect — and neglect is something people instinctively want to fix.

## Numbers That Actually Mean Something Here

Underneath the visuals, Canopy is doing serious work. Its carbon engine is calibrated specifically for Indian users, drawing on emission factors from the **IPCC's Sixth Assessment Report**, India's Ministry of Environment, Forest and Climate Change, and CEEW — rather than generic global averages that rarely reflect local realities.

That specificity shows up in the details. A petrol car costs you roughly **0.21 kg CO₂ per kilometer**, a diesel car 0.17, an electric car 0.12. A bus ride comes in at 0.089 kg/km, while the Delhi or Mumbai metro drops that figure to just **0.041** — a number that makes the case for public transit better than any lecture could.

On the food side, a beef-based meal carries roughly ten times the footprint of a vegan one (**3.0 kg CO₂ versus 0.2 kg**), with chicken and vegetarian options sitting somewhere in between.

Four categories get tracked in total: **travel, food, energy use, and shopping** — covering everything from flight types to smartphone purchases — giving the app a fuller picture of daily life than most carbon calculators bother to attempt.

## A Coach That Actually Knows You

Rather than serving up generic advice, Canopy plugs into **Google's Gemini 2.0 Flash** model to build a coach that responds to your actual logged behavior. It looks at your real activity data, quantifies the CO₂ impact of specific changes, and frames suggestions within an Indian context — with a smart offline fallback so the experience doesn't break when connectivity does.

There's also a layer of game design wrapped around all of this: **five auto-tracked challenges**, ten achievement badges across four rarity tiers, and a streak system that rewards consistency over perfection. Hit a milestone and the app responds with canvas-based particle celebrations rather than a quiet checkmark — the kind of small dopamine hit that keeps habits sticking.

## Built Like It Means to Last

Canopy isn't a weekend hackathon toy held together with duct tape. It's built on **Next.js 16.2** with the App Router and Turbopack, written in TypeScript, styled with Tailwind CSS v4, and managed with Zustand for state.

**Firebase** handles authentication — both email/password and Google OAuth — alongside Firestore for cross-device sync with offline persistence baked in. The whole thing ships to **Google Cloud Run** out of the Mumbai region, deployable with a single script.

It's the kind of architecture that suggests the team was thinking past the demo day — toward something that could actually hold real users and real data over time.

## Why It's Worth Paying Attention To

Climate anxiety is real, and so is the sense that individual action barely registers against an enormous, structural problem. Canopy doesn't pretend to solve climate change single-handedly. Its ambition is more modest and more achievable: make carbon awareness feel personal, visual, and just engaging enough that people stick with it longer than a New Year's resolution.

The project's own framing captures the philosophy well: **every choice is a seed.** Most carbon trackers ask you to stare at your guilt. Canopy asks you to watch something grow instead.

---

*Canopy was built for PromptWars Virtual by Pallavi. The full codebase and live demo are available at [github.com/pallaviXD/Canopy](https://github.com/pallaviXD/Canopy).*
    `,
    author: {
      name: "Pallavi",
      role: "Builder — PromptWars Virtual",
      avatar: "P",
    },
    category: "Build in Public",
    readTime: 6,
    publishedAt: "2026-06-21",
    coverImage: "https://tse1.mm.bing.net/th/id/OIP.kZf-8VKgryEQBIp00XgJcQHaDd?pid=Api&P=0&h=180",
    coverEmoji: "🌳",
    tags: ["canopy", "carbon footprint", "gemini", "firebase", "nextjs", "promptwars", "sustainability"],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category)
}

export const BLOG_CATEGORIES = [...new Set(BLOG_POSTS.map((p) => p.category))]
