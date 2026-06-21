import Link from "next/link"
import { SiteHeader } from "@/components/canopy/site-header"
import { SiteFooter } from "@/components/canopy/site-footer"
import { BlogNewsletter } from "@/components/canopy/blog-newsletter"
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog — Canopy",
  description:
    "Insights, tips, and science-backed guides on reducing your carbon footprint and living more sustainably.",
}

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const rest = BLOG_POSTS.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* ── Page header ── */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            📖 The Canopy Blog
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            Ideas for a greener planet
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Science-backed insights, practical tips, and behind-the-scenes stories from the Canopy
            team.
          </p>
        </div>

        {/* ── Category filter ── */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          <Link
            href="/blog"
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            All
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground hover:border-emerald-200 hover:text-emerald-700 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* ── Featured post ── */}
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-14 block overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_8px_40px_rgba(5,150,105,0.08)] hover:shadow-[0_12px_50px_rgba(5,150,105,0.14)] transition-all duration-300 hover:-translate-y-1"
        >
          <div className="grid md:grid-cols-[1fr_1.2fr]">
            {/* Visual side */}
            <div className="flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 p-16">
              <span className="text-8xl drop-shadow-lg">{featured.coverEmoji}</span>
            </div>

            {/* Content side */}
            <div className="flex flex-col justify-center p-8 md:p-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {featured.category}
                </span>
                <span className="text-xs text-muted-foreground">Featured</span>
              </div>
              <h2 className="text-2xl font-bold text-forest leading-tight group-hover:text-primary transition-colors">
                {featured.title}
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {featured.author.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{featured.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(featured.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    · {featured.readTime} min read
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* ── Post grid ── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* ── Newsletter CTA ── */}
        <BlogNewsletter />
      </main>

      <SiteFooter />
    </div>
  )
}

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[number] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_4px_20px_rgba(5,150,105,0.06)] hover:shadow-[0_8px_30px_rgba(5,150,105,0.12)] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 text-6xl">
        {post.coverEmoji}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
            {post.category}
          </span>
          <span className="text-xs text-muted-foreground">{post.readTime} min</span>
        </div>
        <h3 className="font-bold text-forest leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {post.author.avatar}
          </div>
          <div>
            <p className="text-xs font-semibold">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
