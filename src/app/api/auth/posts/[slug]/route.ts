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

// GET a single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT - update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const postIndex = posts.findIndex((p) => p.slug === slug);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();

    // Update the post (mock implementation)
    const updatedPost = {
      ...posts[postIndex],
      ...body,
      // Keep the original ID and slug
      id: posts[postIndex].id,
      slug: posts[postIndex].slug,
    };

    // In a real app, you would update the database here
    posts[postIndex] = updatedPost;

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const postIndex = posts.findIndex((p) => p.slug === slug);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // In a real app, you would delete from the database here
    const deletedPost = posts[postIndex];
    posts.splice(postIndex, 1);

    return NextResponse.json({
      success: true,
      post: deletedPost,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
