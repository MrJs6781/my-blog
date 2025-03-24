import { NextRequest, NextResponse } from "next/server";

// Reuse the sample posts from the search API
// Import them from a shared data file in a real application
const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js 13",
    slug: "getting-started-with-nextjs-13",
    excerpt:
      "Learn the basics of Next.js 13 and how to build modern web applications.",
    content:
      "<h2>Introduction to Next.js 13</h2><p>Next.js 13 introduces a new App Router built on React Server Components, offering developers new powerful features for building modern web applications.</p><h2>Key Features</h2><p>Some of the key features in Next.js 13 include:</p><ul><li>App Router</li><li>React Server Components</li><li>Streaming</li><li>Turbopack (beta)</li><li>Improved Image Component</li></ul><h2>Getting Started</h2><p>To create a new Next.js 13 project, run the following command:</p><pre><code>npx create-next-app@latest my-app</code></pre><p>This will set up a new project with the latest version of Next.js.</p><h2>Conclusion</h2><p>Next.js 13 provides a solid foundation for building fast, scalable, and user-friendly web applications. Its innovative features make it a top choice for modern web development.</p>",
    category_id: "1",
    category: { id: "1", name: "Web Development" },
    tags: [
      { id: "1", name: "Next.js" },
      { id: "2", name: "React" },
    ],
    reading_time: 5,
    published: true,
    published_at: "2023-05-15T00:00:00.000Z",
    created_at: "2023-05-10T00:00:00.000Z",
    featured_image: "/images/blog/nextjs-13.jpg",
    author: {
      id: "1",
      name: "John Developer",
      bio: "Full-stack developer specializing in React and Next.js",
      image: "/images/authors/john.jpg",
    },
  },
  {
    id: "2",
    title: "Building a Blog with Next.js and TypeScript",
    slug: "building-blog-nextjs-typescript",
    excerpt:
      "Step-by-step guide to creating a blog platform using Next.js and TypeScript.",
    content:
      "<h2>Why Build a Blog with Next.js?</h2><p>Next.js provides an excellent framework for building blogs due to its static generation capabilities, SEO-friendly approach, and developer experience.</p><h2>Setting Up Your Project</h2><p>Let's start by creating a new Next.js project with TypeScript:</p><pre><code>npx create-next-app@latest my-blog --typescript</code></pre><h2>Creating Blog Posts</h2><p>We'll use Markdown files to store our blog posts, making it easy to write and manage content.</p><h2>Styling with Tailwind CSS</h2><p>Tailwind CSS provides a utility-first approach that makes it easy to create beautiful designs without leaving your HTML.</p><h2>Deployment</h2><p>We'll deploy our blog to Vercel, which offers the best experience for Next.js applications.</p>",
    category_id: "1",
    category: { id: "1", name: "Web Development" },
    tags: [
      { id: "1", name: "Next.js" },
      { id: "2", name: "React" },
      { id: "3", name: "TypeScript" },
    ],
    reading_time: 8,
    published: true,
    published_at: "2023-06-20T00:00:00.000Z",
    created_at: "2023-06-15T00:00:00.000Z",
    featured_image: "/images/blog/blog-with-nextjs.jpg",
    author: {
      id: "1",
      name: "John Developer",
      bio: "Full-stack developer specializing in React and Next.js",
      image: "/images/authors/john.jpg",
    },
  },
  {
    id: "3",
    title: "Authentication in Next.js Applications",
    slug: "authentication-nextjs-applications",
    excerpt:
      "Implement secure authentication in your Next.js applications with JWT and cookies.",
    content:
      "<h2>Authentication Fundamentals</h2><p>Authentication is a critical aspect of web applications, ensuring that users can securely access their accounts and data.</p><h2>JWT Authentication</h2><p>JSON Web Tokens (JWT) provide a compact and self-contained method for securely transmitting information between parties.</p><h2>Setting Up Authentication</h2><p>We'll implement a complete authentication system using Next.js API routes, JWT, and cookies.</p><h2>Protecting Routes</h2><p>Learn how to create protected routes that only authenticated users can access.</p><h2>User Profiles</h2><p>Build functionality for users to view and update their profiles after authentication.</p>",
    category_id: "2",
    category: { id: "2", name: "Security" },
    tags: [
      { id: "1", name: "Next.js" },
      { id: "4", name: "Authentication" },
      { id: "5", name: "JWT" },
    ],
    reading_time: 10,
    published: true,
    published_at: "2023-07-10T00:00:00.000Z",
    created_at: "2023-07-05T00:00:00.000Z",
    featured_image: "/images/blog/auth-nextjs.jpg",
    author: {
      id: "2",
      name: "Alice Security",
      bio: "Security expert focused on web application security",
      image: "/images/authors/alice.jpg",
    },
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  // Find the post with the matching slug
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ post });
}
