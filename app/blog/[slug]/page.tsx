import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/canopy/site-header"
import { SiteFooter } from "@/components/canopy/site-footer"
import { getBlogPost, BLOG_POSTS } from "@/lib/blog-data"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: "Not Found — Canopy" }
  return {
    title: `${post.title} — Canopy Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const renderedContent = post.content
    .trim()
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("### "))
        return <h3 key={i} className="mt-8 text-xl font-bold text-forest">{line.slice(4)}</h3>
      if (line.startsWith("## "))
        return <h2 key={i} className="mt-10 text-2xl font-bold text-forest">{line.slice(3)}</h2>
      if (line.startsWith("# "))
        return <h1 key={i} className="mt-12 text-3xl font-bold text-forest">{line.slice(2)}</h1>
      if (line.startsWith("- "))
        return (
          <li key={i} className="ml-5 list-disc text-muted-foreground leading-relaxed">
            {parseBold(line.slice(2))}
          </li>
        )
      if (line.startsWith("---"))
        return <hr key={i} className="my-8 border-border" />
      if (line.trim() === "")
        return <div key={i} className="h-3" />
      return (
        <p key={i} className="leading-relaxed text-muted-foreground">
          {parseBold(line)}
        </p>
      )
    })

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">{post.title}</span>
        </nav>

        <article>
          {/* Category & meta */}
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground">{post.readTime} min read</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold leading-tight text-forest sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>

          {/* Author */}
          <div className="mt-8 flex items-center gap-4 border-y border-border py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-sm">
              {post.author.avatar}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.role}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Cover image */}
          <div className="my-10 relative h-72 w-full overflow-hidden rounded-3xl shadow-[0_12px_40px_rgba(5,150,105,0.2)]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Article content */}
          <div className="space-y-2">
            {renderedContent}
          </div>

          {/* Tags */}
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* CTA */}
        <div className="mt-14 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-8 text-center">
          <span className="text-4xl">🌱</span>
          <h2 className="mt-3 text-xl font-bold text-forest">Try Canopy</h2>
          <p className="mt-2 text-muted-foreground">
            Track your carbon footprint, grow your ecosystem, and get AI-powered coaching.
          </p>
          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(5,150,105,0.3)] hover:shadow-[0_4px_20px_rgba(5,150,105,0.45)] transition-all"
            >
              Start for free
            </Link>
            <Link
              href="https://github.com/pallaviXD/Canopy"
              target="_blank"
              className="rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-forest hover:border-emerald-200 transition-colors"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">{part}</strong>
    ) : (
      part
    )
  )
}
