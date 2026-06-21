import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/canopy/site-header"
import { SiteFooter } from "@/components/canopy/site-footer"
import { BlogNewsletter } from "@/components/canopy/blog-newsletter"
import { BLOG_POSTS } from "@/lib/blog-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog — Canopy",
  description:
    "Build-in-public journey: inside Canopy, a carbon footprint tracker built for PromptWars Virtual using Google Gemini, Firebase, and Next.js.",
}

export default function BlogPage() {
  const post = BLOG_POSTS[0]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {/* Page header */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
            📖 Build in Public
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-forest sm:text-5xl">
            The Canopy Blog
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Behind-the-scenes of building Canopy for PromptWars Virtual — the decisions, the tech, and the thinking.
          </p>
        </div>

        {/* Single featured article */}
        <Link
          href={`/blog/${post.slug}`}
          className="group block overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_8px_40px_rgba(5,150,105,0.08)] hover:shadow-[0_12px_50px_rgba(5,150,105,0.16)] transition-all duration-300 hover:-translate-y-1"
        >
          {/* Cover image */}
          <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-700">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-5 left-6 flex items-center gap-2">
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                {post.category}
              </span>
              <span className="text-xs text-white/80">{post.readTime} min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold text-forest leading-tight group-hover:text-primary transition-colors md:text-3xl">
              {post.title}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
              {post.excerpt}
            </p>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                  {post.author.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                Read article →
              </span>
            </div>
          </div>
        </Link>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Newsletter */}
        <BlogNewsletter />
      </main>

      <SiteFooter />
    </div>
  )
}
