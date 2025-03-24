import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth/jwt";

// Mock database for comments
type Comment = {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

let comments: Comment[] = [
  {
    id: "1",
    post_id: "1",
    content: "This is an amazing post! Thanks for sharing your insights.",
    created_at: new Date().toISOString(),
    user: {
      id: "user1",
      name: "John Doe",
      image: null,
    },
  },
  {
    id: "2",
    post_id: "1",
    content: "I learned a lot from this. Very well explained.",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: {
      id: "user2",
      name: "Jane Smith",
      image: null,
    },
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  // Filter comments by post ID
  const postComments = comments.filter((comment) => comment.post_id === postId);

  return NextResponse.json({ comments: postComments });
}

export async function POST(request: NextRequest) {
  // For demo purposes, we'll simulate an authenticated user
  const mockUser = {
    id: "user3",
    name: "Demo User",
    email: "demo@example.com",
    role: "user",
    image: null,
  };

  try {
    const body = await request.json();

    if (!body.post_id || !body.content) {
      return NextResponse.json(
        { error: "Post ID and content are required" },
        { status: 400 }
      );
    }

    // Create a new comment
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      post_id: body.post_id,
      content: body.content,
      created_at: new Date().toISOString(),
      user: {
        id: mockUser.id,
        name: mockUser.name,
        image: mockUser.image,
      },
    };

    // Add to our mock database
    comments.push(newComment);

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
