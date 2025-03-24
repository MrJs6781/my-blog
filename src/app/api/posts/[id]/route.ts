import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { postUpdateSchema } from "@/lib/models/post";

// Mock data storage - referring to the same Map used in the main posts route
// In a real application, this would be a database
const posts = new Map();

// GET /api/posts/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const postId = params.id;

    // Get post from mock storage
    const post = posts.get(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // If post is not published, check if user is author or admin
    if (
      post.status !== "published" &&
      (!session?.user ||
        (session.user.id !== post.author_id && session.user.role !== "admin"))
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;
    const post = posts.get(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is author or admin
    if (session.user.id !== post.author_id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = postUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid post data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Update post status specific logic
    const now = new Date();
    let publishedAt = post.published_at;

    // If changing from draft to published, set published date
    if (post.status !== "published" && updateData.status === "published") {
      publishedAt = now;
    }

    // Update post in mock storage
    const updatedPost = {
      ...post,
      ...updateData,
      updated_at: now,
      published_at: publishedAt,
    };

    posts.set(postId, updatedPost);

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;
    const post = posts.get(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is author or admin
    if (session.user.id !== post.author_id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete post from mock storage
    posts.delete(postId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
