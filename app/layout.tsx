import type { Metadata, Viewport } from 'next'
import { DM_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/components/canopy/app-provider'

// @vercel/analytics only loads on Vercel — safe to import anywhere but
// we only render it when the env var is present to avoid GCP/Cloud Run errors.
let Analytics: React.ComponentType | null = null
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('@vercel/analytics/next')
  Analytics = mod.Analytics ?? null
} catch {
  // Not on Vercel — skip analytics entirely
}

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Canopy — Grow your impact. Shrink your footprint.',
  description:
    'Canopy helps you understand, track, and reduce your carbon footprint through daily activity logging, AI-powered coaching, challenges, and a living ecosystem that grows with every choice.',
  keywords: ['carbon footprint', 'sustainability', 'climate', 'eco tracker', 'green living', 'Gemini AI'],
  authors: [{ name: 'Canopy' }],
  openGraph: {
    title: 'Canopy — Grow your impact. Shrink your footprint.',
    description: 'Track, reduce, and grow — one eco-choice at a time.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#059669',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${dmSans.variable} ${geistMono.variable}`}>
      <body className="bg-background font-sans antialiased">
        <AppProvider>
          {children}
        </AppProvider>
        {Analytics && process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
