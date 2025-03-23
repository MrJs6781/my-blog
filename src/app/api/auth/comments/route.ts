import { NextRequest, NextResponse } from "next/server";

// Mock comments database - in a real app, this would be stored in a database
export const comments = [
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
    status: "approved", // approved, pending, spam
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
    status: "approved",
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
    status: "approved",
  },
  {
    id: "4",
    postId: "3",
    author: {
      id: "user4",
      name: "Jordan Lee",
      avatar: "/images/placeholder-avatar.jpg",
    },
    content:
      "Could you explain more about error handling in TypeScript and Express?",
    date: "2025-03-06T14:30:00Z",
    likes: 2,
    status: "pending",
  },
  {
    id: "5",
    postId: "1",
    author: {
      id: "user5",
      name: "Anonymous User",
      avatar: "/images/placeholder-avatar.jpg",
    },
    content: "Check out my website at www.spam-link.com for more tech tips!",
    date: "2025-03-17T08:12:00Z",
    likes: 0,
    status: "spam",
  },
];

// GET all comments with optional filtering
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const postId = url.searchParams.get("postId");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Apply filters
    let filteredComments = [...comments];

    if (status) {
      filteredComments = filteredComments.filter(
        (comment) => comment.status === status
      );
    }

    if (postId) {
      filteredComments = filteredComments.filter(
        (comment) => comment.postId === postId
      );
    }

    // Sort by date (newest first)
    filteredComments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);

    return NextResponse.json({
      comments: paginatedComments,
      totalComments: filteredComments.length,
      currentPage: page,
      totalPages: Math.ceil(filteredComments.length / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// PATCH - update comment status (for moderation)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Comment ID and status are required" },
        { status: 400 }
      );
    }

    // Check valid status values
    if (!["approved", "pending", "spam", "deleted"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Find comment by ID
    const commentIndex = comments.findIndex((c) => c.id === id);

    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Special handling for "deleted" status
    if (status === "deleted") {
      const deletedComment = comments.splice(commentIndex, 1)[0];
      return NextResponse.json({
        success: true,
        comment: deletedComment,
        action: "deleted",
      });
    }

    // Update comment status
    comments[commentIndex].status = status;

    return NextResponse.json({
      success: true,
      comment: comments[commentIndex],
      action: "updated",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}
