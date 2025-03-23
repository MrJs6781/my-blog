import { NextRequest, NextResponse } from "next/server";

// Mock database - in a real app, this would be replaced with your database connection
const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-with-nextjs-15",
    content: "This is the full content of the blog post about Next.js 15...",
    excerpt:
      "Learn how to build modern web applications with Next.js 15 and its new features.",
    date: "2025-03-15",
    author: {
      id: "1",
      name: "John Doe",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Development",
    tags: ["nextjs", "react", "javascript"],
    readTime: "5 min read",
  },
  {
    id: "2",
    title: "Mastering Tailwind CSS 4",
    slug: "mastering-tailwind-css-4",
    content:
      "This is the full content of the blog post about Tailwind CSS 4...",
    excerpt:
      "Explore the new features in Tailwind CSS 4 and how to use them effectively.",
    date: "2025-03-10",
    author: {
      id: "2",
      name: "Jane Smith",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Design",
    tags: ["tailwind", "css", "design"],
    readTime: "4 min read",
  },
  {
    id: "3",
    title: "Building with TypeScript and Express",
    slug: "building-with-typescript-and-express",
    content:
      "This is the full content of the blog post about TypeScript and Express...",
    excerpt:
      "How to create a robust backend API using TypeScript and Express.js.",
    date: "2025-03-05",
    author: {
      id: "1",
      name: "John Doe",
      avatar: "/images/placeholder-avatar.jpg",
    },
    coverImage: "/images/placeholder-cover.jpg",
    category: "Backend",
    tags: ["typescript", "express", "api"],
    readTime: "6 min read",
  },
];

// GET - search posts by query, tags or category
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q") || "";
    const tags = url.searchParams.get("tags")?.split(",") || [];
    const category = url.searchParams.get("category");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Filter posts based on search parameters
    let searchResults = [...posts];

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      searchResults = searchResults.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.excerpt.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by tags if provided
    if (tags.length > 0) {
      searchResults = searchResults.filter((post) =>
        tags.some((tag) => post.tags.includes(tag))
      );
    }

    // Filter by category if provided
    if (category) {
      searchResults = searchResults.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedResults,
      totalPosts: searchResults.length,
      currentPage: page,
      totalPages: Math.ceil(searchResults.length / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search posts" },
      { status: 500 }
    );
  }
}
