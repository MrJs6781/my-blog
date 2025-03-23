import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth";

// Mock comments database - in a real app, this would be stored in a database
const comments = [
  {
    id: "1",
    postId: "1",
    author: {
      id: "user1",
      name: "Alex Johnson",
      avatar: "/images/placeholder-avatar.jpg",
    },
    content: "This was really helpful, thanks for sharing!",
    date: "2025-03-16T10:24:00Z",
    likes: 5,
  },
  {
    id: "2",
    postId: "1",
    author: {
      id: "user2",
      name: "Sam Wilson",
      avatar: "/images/placeholder-avatar.jpg",
    },
    content:
      "I've been looking for a clear explanation of Next.js 15 features. Great article!",
    date: "2025-03-16T12:45:00Z",
    likes: 3,
  },
  {
    id: "3",
    postId: "2",
    author: {
      id: "user3",
      name: "Taylor Smith",
      avatar: "/images/placeholder-avatar.jpg",
    },
    content: "Tailwind CSS has been a game-changer for my projects.",
    date: "2025-03-11T09:15:00Z",
    likes: 7,
  },
];

// Mock posts data - just for reference to map between slugs and IDs
const posts = [
  {
    id: "1",
    slug: "getting-started-with-nextjs-15",
  },
  {
    id: "2",
    slug: "mastering-tailwind-css-4",
  },
  {
    id: "3",
    slug: "building-with-typescript-and-express",
  },
];

// Helper function to get post ID from slug
function getPostIdFromSlug(slug: string): string | null {
  const post = posts.find((p) => p.slug === slug);
  return post ? post.id : null;
}

// GET - fetch comments for a specific post by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const slug = params.slug;

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch the comments for this post
    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the comments to ensure they have proper date fields
    const formattedComments = comments.map((comment) => ({
      ...comment,
      // Ensure date is in ISO format string
      date: comment.createdAt.toISOString(),
      // Keep createdAt as is for reference
      likes: 0, // Default value for likes since we don't have this in the database yet
    }));

    return NextResponse.json({
      comments: formattedComments,
      count: comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - add a new comment to a post (requires authentication)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  return withAuth(request, async (req, user) => {
    try {
      // Handle params as a Promise in newer Next.js versions
      const params = await context.params;
      const slug = params.slug;

      // Find the post
      const post = await prisma.post.findUnique({
        where: { slug },
      });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      const body = await req.json();

      // Validate required fields
      if (!body.content) {
        return NextResponse.json(
          { error: "Comment content is required" },
          { status: 400 }
        );
      }

      // Create a new comment
      const comment = await prisma.comment.create({
        data: {
          content: body.content,
          postId: post.id,
          authorId: user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        comment,
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      return NextResponse.json(
        { error: "Failed to add comment" },
        { status: 500 }
      );
    }
  });
}
