import { NextRequest, NextResponse } from "next/server";

// Mock comments database
const comments = [
  {
    id: "1",
    postId: "1",
    author: "Alice Johnson",
    content: "Great post! Very informative and well-written.",
    date: "2025-03-16",
    email: "alice@example.com",
  },
  {
    id: "2",
    postId: "1",
    author: "Bob Smith",
    content:
      "I have a question about the third point. Could you elaborate more?",
    date: "2025-03-17",
    email: "bob@example.com",
  },
];

// GET comments for a post
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const postComments = comments.filter(
      (comment) => comment.postId === postId
    );

    return NextResponse.json({ comments: postComments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.postId || !body.author || !body.content || !body.email) {
      return NextResponse.json(
        { error: "Post ID, author, email and content are required" },
        { status: 400 }
      );
    }

    // Create a new comment
    const newComment = {
      id: (comments.length + 1).toString(),
      date: new Date().toISOString().split("T")[0],
      ...body,
    };

    // In a real app, you would save to database here
    comments.push(newComment);

    return NextResponse.json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
