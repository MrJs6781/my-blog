import { NextRequest, NextResponse } from "next/server";

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

    const postId = getPostIdFromSlug(slug);

    if (!postId) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Filter comments by post ID
    const postComments = comments.filter(
      (comment) => comment.postId === postId
    );

    return NextResponse.json({
      comments: postComments,
      count: postComments.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - add a new comment to a post
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const slug = params.slug;

    const postId = getPostIdFromSlug(slug);

    if (!postId) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.content) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    // In a real app, you would get the current user info from an auth token
    const mockUser = {
      id: "current-user",
      name: "Current User",
      avatar: "/images/placeholder-avatar.jpg",
    };

    // Create a new comment
    const newComment = {
      id: (comments.length + 1).toString(),
      postId,
      author: mockUser,
      content: body.content,
      date: new Date().toISOString(),
      likes: 0,
    };

    // Add to the comments array (in a real app, save to database)
    comments.push(newComment);

    return NextResponse.json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
