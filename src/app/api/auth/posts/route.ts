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
];

// GET all posts
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const category = url.searchParams.get("category");

    // Filter and paginate posts
    let filteredPosts = [...posts];

    if (category) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category === category
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      totalPosts: filteredPosts.length,
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST - create a new post
export async function POST(request: NextRequest) {
  try {
    // In a real app, you would validate authentication here

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Create a new post (mock implementation)
    const newPost = {
      id: (posts.length + 1).toString(),
      slug: body.title.toLowerCase().replace(/\s+/g, "-"),
      date: new Date().toISOString().split("T")[0],
      author: {
        id: "1",
        name: "John Doe",
        avatar: "/images/placeholder-avatar.jpg",
      },
      readTime: `${Math.ceil(body.content.length / 1000)} min read`,
      ...body,
    };

    // In a real app, you would save to database here
    posts.push(newPost);

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
