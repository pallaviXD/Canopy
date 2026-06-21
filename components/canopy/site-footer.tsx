import Link from "next/link"
import { CanopyLogo } from "@/components/canopy/canopy-logo"

const columns = [
  { title: "Product", links: [
    { label: "Features", href: "#features" },
    { label: "AI Coach", href: "#ai-coach" },
    { label: "Challenges", href: "#challenges" },
    { label: "Insights", href: "#insights" },
  ]},
  { title: "Company", links: [
    { label: "About", href: "#" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ]},
  { title: "Resources", links: [
    { label: "Help Center", href: "#" },
    { label: "Carbon Guide", href: "/blog/understanding-your-carbon-footprint" },
    { label: "Community", href: "#" },
    { label: "Privacy", href: "#" },
  ]},
]

export function SiteFooter() {
  return (
    <footer className="border-t border-emerald-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <CanopyLogo size={36} />
              <span className="text-lg font-bold text-forest">Canopy</span>
            </Link>
            <p className="mt-4 max-w-xs text-pretty leading-relaxed text-muted-foreground">
              Grow your impact. Shrink your footprint. Track, understand and reduce your carbon
              footprint one decision at a time.
            </p>
            {/* GCP badge */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.19 2.38a9.344 9.344 0 0 0-9.234 6.893c.053-.02.094-.04.074-.04h3.67l.79-1.966h9.823l-3.02 7.702h1.314l-2.752 7.013C13.983 21.99 15 22 16.29 22c5.054 0 9.162-4.03 9.162-9s-4.109-9-9.162-9l-4.1.38z" />
              </svg>
              Deployed on Google Cloud
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-forest">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-emerald-100 pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Canopy. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Made for a greener planet.
          </p>
        </div>
      </div>
    </footer>
  )
}
