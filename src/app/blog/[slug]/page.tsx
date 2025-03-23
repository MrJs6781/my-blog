import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { CommentSection } from "@/components/blog/comment-section";
import { TableOfContents } from "@/components/blog/table-of-contents";

// This would typically come from a database or API
const post = {
  slug: "getting-started-with-nextjs-15",
  title: "Getting Started with Next.js 15",
  excerpt:
    "Learn how to build modern web applications with Next.js 15 and its new features.",
  content: `
  <h2 id="introduction">Introduction</h2>
  <p>Next.js 15 brings significant improvements to the React framework, making it even more powerful for building modern web applications. In this article, we'll explore the new features and how to leverage them in your projects.</p>
  
  <h2 id="installation">Installation</h2>
  <p>Getting started with Next.js 15 is straightforward. You can create a new project using the following command:</p>
  <pre><code>npx create-next-app@latest my-app</code></pre>
  <p>This will set up a new Next.js project with all the latest features and configurations.</p>
  
  <h2 id="key-features">Key Features</h2>
  <p>Next.js 15 introduces several exciting features that improve developer experience and application performance:</p>
  
  <h3 id="improved-routing">Improved Routing</h3>
  <p>The App Router has been refined with better error handling and improved nested routing capabilities. This makes creating complex application structures more intuitive than ever.</p>
  
  <h3 id="server-components">Server Components</h3>
  <p>React Server Components are now fully integrated into Next.js, allowing you to build applications that combine the interactivity of client-side apps with the performance benefits of server rendering.</p>
  
  <h3 id="turbopack">Turbopack Improvements</h3>
  <p>The new version includes significant improvements to Turbopack, making development even faster with quicker refresh times and optimized builds.</p>
  
  <h2 id="performance-optimization">Performance Optimization</h2>
  <p>Next.js 15 places a strong emphasis on performance optimization. Here are some techniques you can use to ensure your application runs smoothly:</p>
  
  <h3 id="image-optimization">Image Optimization</h3>
  <p>The Image component has been enhanced to provide better performance with improved loading strategies and optimization algorithms.</p>
  
  <h3 id="code-splitting">Code Splitting</h3>
  <p>Next.js automatically splits your code to ensure that only the necessary JavaScript is loaded for each page, significantly improving load times.</p>
  
  <h2 id="conclusion">Conclusion</h2>
  <p>Next.js 15 represents a significant step forward in the evolution of the framework. With its focus on developer experience, performance, and seamless integration with the React ecosystem, it's an excellent choice for building modern web applications.</p>
  `,
  date: "March 15, 2025",
  readTime: "5 min read",
  author: {
    name: "John Doe",
    avatar: "/images/placeholder-avatar.jpg",
    bio: "Senior Frontend Developer with a passion for React and modern web technologies.",
  },
  coverImage: "/images/placeholder-cover.jpg",
  category: "Development",
  tags: ["Next.js", "React", "JavaScript"],
  relatedPosts: [
    {
      id: "2",
      title: "Mastering Tailwind CSS 4",
      slug: "mastering-tailwind-css-4",
      excerpt:
        "Explore the new features in Tailwind CSS 4 and how to use them effectively.",
      coverImage: "/images/placeholder-cover.jpg",
    },
    {
      id: "3",
      title: "Building with TypeScript and Express",
      slug: "building-with-typescript-and-express",
      excerpt:
        "How to create a robust backend API using TypeScript and Express.js.",
      coverImage: "/images/placeholder-cover.jpg",
    },
  ],
};

// TOC items derived from the content
const tocItems = [
  { id: "introduction", text: "Introduction", level: 2 },
  { id: "installation", text: "Installation", level: 2 },
  { id: "key-features", text: "Key Features", level: 2 },
  { id: "improved-routing", text: "Improved Routing", level: 3 },
  { id: "server-components", text: "Server Components", level: 3 },
  { id: "turbopack", text: "Turbopack Improvements", level: 3 },
  {
    id: "performance-optimization",
    text: "Performance Optimization",
    level: 2,
  },
  { id: "image-optimization", text: "Image Optimization", level: 3 },
  { id: "code-splitting", text: "Code Splitting", level: 3 },
  { id: "conclusion", text: "Conclusion", level: 2 },
];

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch the post based on the slug
  // const { slug } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Link href="/blog">
              <Badge variant="outline" className="rounded-md">
                {post.category}
              </Badge>
            </Link>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{post.title}</h1>
          <p className="mb-6 text-xl text-muted-foreground">{post.excerpt}</p>

          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {post.author.bio}
              </div>
            </div>
          </div>
        </header>

        {/* Cover image */}
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Social sharing sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 flex flex-col items-center gap-4 pt-4">
              <Button variant="outline" size="icon" aria-label="Like">
                <ThumbsUp className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Comment">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Bookmark">
                <Bookmark className="h-5 w-5" />
              </Button>

              <Separator className="my-2 w-full" />

              <Button
                variant="outline"
                size="icon"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Article content */}
              <div className="lg:col-span-3">
                <div
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/blog?tag=${tag}`}>
                        <Badge variant="secondary">{tag}</Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Share buttons (mobile) */}
                <div className="mt-8 flex items-center justify-between border-y py-4 lg:hidden">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" aria-label="Like">
                      <ThumbsUp className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Comment">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Bookmark">
                      <Bookmark className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Author bio */}
                <div className="mt-8 rounded-lg bg-muted p-6">
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={post.author.avatar}
                        alt={post.author.name}
                      />
                      <AvatarFallback>
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">
                        About {post.author.name}
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        {post.author.bio}
                      </p>
                      <Button variant="link" className="mt-2 h-auto p-0">
                        View all posts
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments section */}
                <div className="mt-12">
                  <CommentSection postSlug={post.slug} />
                </div>
              </div>

              {/* Table of contents */}
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <TableOfContents items={tocItems} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related posts */}
      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {post.relatedPosts.map((relatedPost) => (
            <Card key={relatedPost.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={relatedPost.coverImage}
                  alt={relatedPost.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold">
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="hover:text-primary"
                  >
                    {relatedPost.title}
                  </Link>
                </h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {relatedPost.excerpt}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
