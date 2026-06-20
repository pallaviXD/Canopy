<div align="center">

<img src="public/icon.svg" alt="Canopy" width="80" height="80" />

# Canopy

### Grow your impact. Shrink your footprint.

**A carbon footprint awareness platform where your sustainable actions grow a living ecosystem.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Coach-4285F4?logo=google)](https://aistudio.google.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Live Demo](#) · [Report Bug](issues) · [Google Solution Challenge](https://developers.google.com/community/gdsc-solution-challenge)

![Canopy Dashboard Preview](public/placeholder.jpg)

</div>

---

## What is Canopy?

Canopy is not a carbon calculator. It is a **sustainability companion** — a platform where every real-world action you take directly transforms a living digital ecosystem. Log a metro ride, eat a vegetarian meal, skip an online order — and watch your tree grow leaves, flowers bloom, birds arrive, and butterflies appear.

Built for the **Google Solution Challenge**, Canopy targets **UN SDG 13: Climate Action** by making carbon awareness personal, visual, and emotionally engaging for Indian users.

> *"My sustainable actions are growing this living world."*

---

## Features

### 🌳 Living Ecosystem (7 Growth Stages)
The entire dashboard centers on an organic SVG ecosystem that evolves based on your behavior — not a chart, not a dashboard widget. A living, breathing world.

| Score | Stage |
|---|---|
| 0–20 | Bare Ground — a tiny sprout |
| 20–40 | Small Sapling — first leaves |
| 40–60 | Young Tree — branches forming |
| 60–80 | Healthy Tree — full canopy, flowers |
| 80–90 | Flowering Tree — butterflies appear |
| 90–100 | Flourishing Ecosystem — birds, particles, full scene |

Each ecosystem element is individually animated:
- **Leaves** — organic bezier shapes, independent sway per leaf
- **Flowers** — 5-petal bloom animations, staggered entry
- **Birds** — perched with bob animation, flying arc paths via `animateMotion`
- **Butterflies** — organic wing bezier paths, floating drift
- **Sunlight** — breathing glow, light shafts through canopy
- **Particles** — pollen and dust drifting upward with SVG `<animate>`
- **Grass** — individual blade sway with randomized timing

### 📊 Carbon Engine
Real emission factors calibrated for India:

| Category | Modes |
|---|---|
| Travel | Petrol Car, Diesel Car, Electric Car, Bus, Auto Rickshaw, Metro, Domestic/International Flight |
| Food | Beef, Lamb, Chicken, Fish, Vegetarian, Vegan |
| Energy | Electricity (0.82 kg/kWh) |
| Shopping | Clothing, Online Order, Smartphone |

**Canopy Score** = `100 − ((weekly emissions / 34.3) × 50)`  
Benchmarked against the Indian weekly average of **34.3 kg CO₂**.

### 🤖 AI Coach (Powered by Gemini)
A sustainability coach that reads your **actual emission data** and gives specific, quantified advice — not generic tips.

- Personalized context built from your real logs
- CO₂ savings quantified for every suggestion
- Indian context (local transit, food culture, averages)
- Smart fallback responses when offline or quota exceeded
- 6 quick-prompt chips for instant guidance

### 🏆 Challenge System
5 auto-tracked challenges that compute progress from your activity logs:

| Challenge | CO₂ Saved | Auto-tracked by |
|---|---|---|
| Take Public Transit Twice | 3.4 kg | metro/bus logs |
| Skip Meat for 3 Meals | 2.1 kg | vegetarian/vegan food logs |
| Buy Nothing New for 7 Days | 5.8 kg | absence of shopping logs |
| Walk Trips Under 2km | 1.8 kg | short metro logs |
| Eat One Plant-Based Day | 2.8 kg | all-vegan day detection |

### 🔥 Streak System
Consecutive daily logging tracked with visual dot indicators. Milestones unlock ecosystem features:
- 3 days → Ecosystem growth
- 7 days → Flowers bloom
- 14 days → Birds appear
- 30 days → Full ecosystem upgrade

### 🏅 Achievement Badges (10 badges, 4 rarity tiers)
Automatically unlocked: First Step 🌱, 7-Day Streak 🔥, 30-Day Streak 🌳, Plant-Based Week 🥗, Transit Champion 🚇, Low Carbon Month 🏆, Eco Warrior ⚡, Carbon Crusher 💪, Green Commuter 🚲, Mindful Shopper 🛍️

### 🎉 Celebration System
Canvas-based particle animations trigger on every meaningful moment — challenge completions, streak milestones, ecosystem upgrades, first log, achievement unlocks.

### 📈 Insights & Analytics
- Weekly trend line chart (SVG, 7 days)
- Category donut breakdown (Travel / Food / Energy / Shopping)
- Monthly 4-week bar chart
- Best and worst day detection
- vs Indian average + vs Global average comparison bars

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 with localStorage persistence |
| AI | Google Gemini 1.5/2.0 Flash via `@google/generative-ai` |
| Auth | Firebase Authentication (Google Sign-In) |
| Database | Firebase Firestore (offline IndexedDB persistence) |
| Analytics | Vercel Analytics |
| Icons | Lucide React |
| Fonts | DM Sans + Geist Mono |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/your-username/canopy.git
cd canopy
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Required for AI Coach
GEMINI_API_KEY=AIzaSy...your_key_here

# Optional — for user accounts and cross-device sync
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

> **Note:** The app works fully without Firebase — all data persists in browser localStorage via Zustand. Firebase only adds cross-device sync and Google Sign-In.
>
> Get your free Gemini API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Google Cloud Platform

Canopy is optimized for GCP deployment. Choose your preferred method:

### Option A — Cloud Run (Recommended)

**1. Build the Docker image**

```bash
npm run docker:build
```

**2. Authenticate with GCP**

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

**3. Build and push to Artifact Registry**

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/canopy
```

**4. Deploy to Cloud Run**

```bash
gcloud run deploy canopy \
  --image gcr.io/YOUR_PROJECT_ID/canopy \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key_here
```

Your app is live at the URL Cloud Run provides.

---

### Option B — Firebase Hosting + Cloud Functions

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

### Option C — App Engine

**1. Create `app.yaml`**

```yaml
runtime: nodejs20
env: standard
instance_class: F2

env_variables:
  GEMINI_API_KEY: "your_key_here"

automatic_scaling:
  min_idle_instances: 0
  max_idle_instances: 1
```

**2. Deploy**

```bash
gcloud app deploy
```

---

### Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]
```

> Add `output: 'standalone'` to `next.config.mjs` for optimal Docker builds.

---

## Project Architecture

```
canopy/
├── app/
│   ├── api/coach/route.ts          # Gemini AI proxy with smart fallback
│   ├── dashboard/page.tsx          # Main dashboard (5-panel SPA)
│   ├── globals.css                 # Design tokens + animation keyframes
│   ├── layout.tsx                  # Root layout with AppProvider
│   └── page.tsx                    # Landing page
│
├── components/canopy/
│   ├── ecosystem/                  # 8-layer SVG ecosystem
│   │   ├── ecosystem-controller.tsx  # Root compositor
│   │   ├── tree.tsx                  # Organic trunk + branch paths
│   │   ├── leaves.tsx                # Bezier leaf clusters
│   │   ├── flowers.tsx               # 5-petal bloom animations
│   │   ├── birds.tsx                 # Perched + flying birds
│   │   ├── butterflies.tsx           # Bezier wing butterflies
│   │   ├── sunlight.tsx              # Sun disc + light shafts
│   │   ├── ground.tsx                # Grass, ground flowers, moss
│   │   └── particles.tsx             # Pollen + dust particles
│   ├── dashboard/
│   │   ├── sidebar.tsx               # Live streak dots + nav
│   │   ├── challenges-panel.tsx      # Auto-tracked challenges
│   │   ├── insights-panel.tsx        # SVG charts
│   │   ├── coach-panel.tsx           # AI conversation UI
│   │   └── profile-panel.tsx         # Achievements + badges
│   ├── celebration-overlay.tsx      # Canvas particle system
│   ├── log-activity-modal.tsx       # Activity logging with live preview
│   └── app-provider.tsx             # Firebase init + achievement checks
│
└── lib/
    ├── emission-factors.ts          # Single source of CO₂ constants
    ├── carbon-engine.ts             # Pure emission calculations
    ├── ecosystem-engine.ts          # Stage + visual state computation
    ├── challenge-engine.ts          # Auto-progress from logs
    ├── achievement-engine.ts        # Badge unlock logic
    ├── analytics-engine.ts          # Weekly/monthly summaries
    ├── streak-engine.ts             # Consecutive day tracking
    ├── gemini-context-builder.ts    # Structured AI prompts
    ├── firebase-service.ts          # Auth + Firestore CRUD
    └── store.ts                     # Zustand global state
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Recommended | Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey). App works without it using smart fallback responses. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Optional | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Optional | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Optional | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Optional | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Optional | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Optional | Firebase app ID |

---

## Emission Factors Reference

All values in kg CO₂ per unit. Source: IPCC, MoEFCC India, CEEW.

### Travel (kg CO₂/km)
| Mode | Factor |
|---|---|
| Petrol Car | 0.21 |
| Diesel Car | 0.17 |
| Electric Car | 0.12 |
| Auto Rickshaw | 0.13 |
| Bus | 0.089 |
| Metro | 0.041 |
| Domestic Flight | 0.255 |
| International Flight | 0.195 |

### Food (kg CO₂/meal)
| Type | Factor |
|---|---|
| Beef | 3.0 |
| Lamb | 2.4 |
| Chicken | 0.7 |
| Fish | 0.6 |
| Vegetarian | 0.3 |
| Vegan | 0.2 |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Google AI Studio](https://aistudio.google.com) — Gemini API
- [Firebase](https://firebase.google.com) — Auth and Firestore
- [Lucide React](https://lucide.dev) — Icons
- [Tailwind CSS](https://tailwindcss.com) — Styling
- Emission factors: IPCC AR6, Ministry of Environment Forest and Climate Change (India), CEEW

---

<div align="center">

Built with ❤️ for the **Google Solution Challenge**

**Canopy — Grow your impact. Shrink your footprint.**

</div>
