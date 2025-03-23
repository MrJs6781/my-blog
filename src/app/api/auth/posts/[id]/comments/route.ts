import { NextRequest, NextResponse } from "next/server";
import { posts } from "../../route";

// Mock comments
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

// GET - fetch comments for a specific post by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const id = params.id;

    // Find the post
    const post = posts.find((post) => post.id === id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch comments for this post
    const postComments = comments.filter(
      (comment) => comment.postId === post.id
    );

    return NextResponse.json({
      comments: postComments,
      count: postComments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - add a new comment to a post
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const id = params.id;

    // Find the post
    const post = posts.find((post) => post.id === id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get the request body
    const body = await request.json();

    // Validate required fields
    if (!body.content || !body.author) {
      return NextResponse.json(
        { error: "Comment content and author are required" },
        { status: 400 }
      );
    }

    // Create a new comment
    const newComment = {
      id: Date.now().toString(), // Generate a simple ID
      postId: post.id,
      author: body.author,
      content: body.content,
      date: new Date().toISOString(),
      likes: 0,
    };

    // Add the comment to the array
    comments.push(newComment);

    return NextResponse.json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
