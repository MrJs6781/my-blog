import { NextRequest, NextResponse } from "next/server";

// Sample mock posts data for demonstration
const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js 13",
    slug: "getting-started-with-nextjs-13",
    excerpt:
      "Learn the basics of Next.js 13 and how to build modern web applications.",
    content:
      "Next.js 13 introduces a new App Router built on React Server Components, offering developers new powerful features...",
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
  },
  {
    id: "2",
    title: "Building a Blog with Next.js and TypeScript",
    slug: "building-blog-nextjs-typescript",
    excerpt:
      "Step-by-step guide to creating a blog platform using Next.js and TypeScript.",
    content:
      "In this comprehensive guide, we'll walk through the process of building a modern blog with Next.js and TypeScript...",
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
  },
  {
    id: "3",
    title: "Authentication in Next.js Applications",
    slug: "authentication-nextjs-applications",
    excerpt:
      "Implement secure authentication in your Next.js applications with JWT and cookies.",
    content:
      "Authentication is a critical aspect of web applications. In this tutorial, we'll explore how to implement authentication in Next.js...",
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
  },
  {
    id: "4",
    title: "Optimizing Performance in React Applications",
    slug: "optimizing-performance-react-applications",
    excerpt:
      "Learn techniques to improve the performance of your React applications.",
    content:
      "Performance optimization is crucial for providing a good user experience. In this article, we'll discuss various techniques to optimize React applications...",
    category_id: "3",
    category: { id: "3", name: "Performance" },
    tags: [
      { id: "2", name: "React" },
      { id: "6", name: "Performance" },
      { id: "7", name: "Optimization" },
    ],
    reading_time: 7,
    published: true,
    published_at: "2023-08-05T00:00:00.000Z",
    created_at: "2023-08-01T00:00:00.000Z",
    featured_image: "/images/blog/react-performance.jpg",
  },
  {
    id: "5",
    title: "Introduction to Tailwind CSS",
    slug: "introduction-tailwind-css",
    excerpt:
      "Discover the benefits of using Tailwind CSS for styling your web applications.",
    content:
      "Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without ever leaving your HTML. In this introduction...",
    category_id: "4",
    category: { id: "4", name: "CSS" },
    tags: [
      { id: "8", name: "Tailwind" },
      { id: "9", name: "CSS" },
      { id: "10", name: "Styling" },
    ],
    reading_time: 6,
    published: true,
    published_at: "2023-09-12T00:00:00.000Z",
    created_at: "2023-09-08T00:00:00.000Z",
    featured_image: "/images/blog/tailwind-css.jpg",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("category_id");
  const tagId = searchParams.get("tag_id");
  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const exclude = searchParams.get("exclude");

  // Start with all published posts
  let filteredPosts = posts.filter((post) => post.published);

  // Apply search query filter (case-insensitive search in title, excerpt, and content)
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Apply category filter
  if (categoryId) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category_id === categoryId
    );
  }

  // Apply tag filter
  if (tagId) {
    filteredPosts = filteredPosts.filter((post) =>
      post.tags.some((tag) => tag.id === tagId)
    );
  }

  // Exclude a specific post (useful for "related posts" that exclude the current post)
  if (exclude) {
    filteredPosts = filteredPosts.filter((post) => post.id !== exclude);
  }

  // Sort by published date (newest first)
  filteredPosts.sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  // Extract all unique categories and tags for filters
  const allCategories = Array.from(new Set(posts.map((post) => post.category)))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  const allTags = Array.from(
    new Set(
      posts.flatMap((post) => post.tags).map((tag) => JSON.stringify(tag))
    )
  )
    .map((tag) => JSON.parse(tag))
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({
    posts: paginatedPosts,
    pagination: {
      total: totalPosts,
      page,
      limit,
      totalPages,
    },
    categories: allCategories,
    tags: allTags,
  });
}
