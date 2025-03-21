import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/post-card";

// This would typically come from an API call in production
const featuredPosts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-with-nextjs-15",
    excerpt:
      "Learn how to build modern web applications with Next.js 15 and its new features.",
    date: "2025-03-15",
    author: {
      name: "John Doe",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Development",
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS 4",
    slug: "mastering-tailwind-css-4",
    excerpt:
      "Explore the new features in Tailwind CSS 4 and how to use them effectively.",
    date: "2025-03-10",
    author: {
      name: "Jane Smith",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Design",
  },
  {
    id: "3",
    title: "Building with TypeScript and Express",
    slug: "building-with-typescript-and-express",
    excerpt:
      "How to create a robust backend API using TypeScript and Express.js.",
    date: "2025-03-05",
    author: {
      name: "Mike Johnson",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Backend",
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          Welcome to My Blog
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Sharing insights about web development, design, and technology
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/blog">Browse Articles</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Featured posts section */}
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Posts</h2>
          <Button asChild variant="ghost" className="gap-1">
            <Link href="/blog">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter subscription */}
      <section className="rounded-lg bg-muted p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            Subscribe to the Newsletter
          </h2>
          <p className="mb-6 text-muted-foreground">
            Get the latest articles and news delivered to your inbox.
          </p>
          <form className="flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border border-input bg-background px-4 py-2"
              required
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
