<div align="center">

<img src="public/icon.svg" alt="Canopy" width="80" height="80" />

# Canopy

### Grow your impact. Shrink your footprint.

**A full-stack carbon footprint awareness platform where your sustainable actions grow a living ecosystem.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?logo=google)](https://aistudio.google.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com)
[![GCP](https://img.shields.io/badge/GCP-Cloud%20Run-4285F4?logo=googlecloud)](https://cloud.google.com/run)
[![PromptWars](https://img.shields.io/badge/PromptWars-Virtual-34A853?logo=google)](https://hack2skill.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Built for [PromptWars Virtual](https://hack2skill.com) — Challenge 3**

[🌐 Live Demo](https://canopy-738945954126.asia-south1.run.app) · [📝 Blog](https://canopy-738945954126.asia-south1.run.app/blog) · [📁 Google Drive](https://drive.google.com/drive/folders/1PabB5sqnNO0K5PreIf3_R2CIIKIOhGvL?usp=drive_link) · [💻 GitHub](https://github.com/pallaviXD/Canopy)

</div>

---

## 🌐 Live Deployment

| | |
|---|---|
| **Production URL** | https://canopy-738945954126.asia-south1.run.app |
| **Blog / Build-in-Public** | https://canopy-738945954126.asia-south1.run.app/blog |
| **Login** | https://canopy-738945954126.asia-south1.run.app/login |
| **Sign Up** | https://canopy-738945954126.asia-south1.run.app/signup |
| **Dashboard** | https://canopy-738945954126.asia-south1.run.app/dashboard |
| **Platform** | GCP Cloud Run — `asia-south1` (Mumbai) |

---

## 📁 Submission Assets

| Asset | Link |
|---|---|
| 🌐 Live App | https://canopy-738945954126.asia-south1.run.app |
| 💻 GitHub Repo | https://github.com/pallaviXD/Canopy |
| 📁 Google Drive (assets, screenshots, demo) | https://drive.google.com/drive/folders/1PabB5sqnNO0K5PreIf3_R2CIIKIOhGvL?usp=drive_link |
| 📝 Technical Blog | https://canopy-738945954126.asia-south1.run.app/blog |
| 🎥 Demo Video | *(uploading — link will be added to Google Drive)* |

---

## What is Canopy?

Canopy is a **sustainability companion** built with Google Antigravity (Gemini + Firebase + GCP). Every real-world action you take directly transforms a living digital ecosystem. Log a metro ride, eat a vegetarian meal, skip an online order — and watch your tree grow leaves, flowers bloom, birds arrive, and butterflies appear.

> *"Every choice is a seed."*

---

## ✨ Features

### 🔐 Firebase Authentication
- Email/Password sign-up and login
- Google OAuth one-tap sign-in
- Protected routes — dashboard requires authentication
- Firestore for real-time cross-device data sync

### 🌳 Living Ecosystem (7 Growth Stages)
An organic SVG ecosystem that evolves based on your real behavior — not a chart, not a widget.

| Score | Stage |
|---|---|
| 0–10 | Bare Soil |
| 10–25 | Small Sapling |
| 25–40 | Young Tree |
| 40–55 | Healthy Tree |
| 55–72 | Large Tree — flowers bloom |
| 72–88 | Forest Tree — birds nest |
| 88–100 | Flourishing Ecosystem — butterflies, particles |

### 📊 Carbon Engine (India-calibrated)
Real emission factors from IPCC AR6, MoEFCC India, CEEW — covering travel, food, energy, and shopping.

### 🤖 AI Coach (Google Gemini 2.0 Flash)
Personalized coaching using your actual activity data. Quantified CO₂ savings, Indian context, smart offline fallback.

### 🏆 Challenges, Achievements & Streaks
5 auto-tracked challenges, 10 achievement badges, streak system with milestone unlocks and particle celebrations.

### 📝 Build-in-Public Blog
One original long-form article covering the full technical and product story of building Canopy.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5 with localStorage persistence |
| AI | Google Gemini 2.0 Flash |
| Auth | Firebase Authentication (Email/Password + Google OAuth) |
| Database | Firebase Firestore (offline IndexedDB persistence) |
| Deployment | GCP Cloud Run via Cloud Build (no Docker locally) |
| Icons | Lucide React |
| Fonts | DM Sans + Geist Mono |

---

## 🚀 Getting Started Locally

```bash
# 1. Clone
git clone https://github.com/pallaviXD/Canopy.git
cd Canopy

# 2. Install
npm install

# 3. Configure
cp .env.local.example .env.local
# Fill in your Firebase + Gemini keys

# 4. Run
npm run dev
# Open http://localhost:3000
```

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 📁 Project Structure

```
canopy/
├── app/
│   ├── api/coach/route.ts          # Gemini AI proxy
│   ├── blog/page.tsx               # Build-in-public blog
│   ├── blog/[slug]/page.tsx        # Full article page
│   ├── dashboard/page.tsx          # Protected dashboard
│   ├── login/page.tsx              # Firebase login
│   ├── signup/page.tsx             # Firebase signup
│   └── page.tsx                    # Landing page
│
├── components/canopy/
│   ├── auth-guard.tsx              # Route protection
│   ├── auth-form.tsx               # Login/signup with Firebase
│   ├── app-provider.tsx            # Firebase auth state sync
│   ├── ecosystem/                  # 8-layer animated SVG
│   └── dashboard/                  # Dashboard panels
│
└── lib/
    ├── blog-data.ts                # Blog content
    ├── firebase-config.ts          # Firebase singleton
    ├── firebase-service.ts         # Auth + Firestore CRUD
    ├── carbon-engine.ts            # Emission calculations
    ├── ecosystem-engine.ts         # Visual state computation
    ├── gemini-context-builder.ts   # AI prompt builder
    └── store.ts                    # Zustand global state
```

---

## ☁️ Deploy to GCP (No Docker Required)

```powershell
# From project root — builds and deploys entirely on GCP Cloud Build
.\deploy-cloudrun.ps1
```

The script automatically enables APIs, creates Artifact Registry, builds the image on GCP Cloud Build (no local Docker needed), and deploys to Cloud Run.

---

## 🌐 Routes

| Route | Auth Required |
|---|---|
| `/` | No |
| `/login` | No |
| `/signup` | No |
| `/blog` | No |
| `/blog/[slug]` | No |
| `/dashboard` | ✅ Yes |

---

## 📊 Emission Factors (India-calibrated)

| Travel Mode | kg CO₂/km |
|---|---|
| Petrol Car | 0.21 |
| Metro | 0.041 |
| Bus | 0.089 |
| Domestic Flight | 0.255 |

| Food | kg CO₂/meal |
|---|---|
| Beef | 3.0 |
| Chicken | 0.7 |
| Vegan | 0.2 |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with 🌱 for **PromptWars Virtual — Challenge 3**

**Canopy — Grow your impact. Shrink your footprint.**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-canopy--738945954126.asia--south1.run.app-34A853)](https://canopy-738945954126.asia-south1.run.app)
[![Google Drive](https://img.shields.io/badge/📁%20Google%20Drive-Submission%20Assets-4285F4?logo=googledrive)](https://drive.google.com/drive/folders/1PabB5sqnNO0K5PreIf3_R2CIIKIOhGvL?usp=drive_link)

</div>
