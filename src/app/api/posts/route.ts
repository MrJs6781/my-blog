import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { postCreateSchema } from "@/lib/models/post";

// Mock data storage
const posts = new Map();

// GET /api/posts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const authorId = searchParams.get("author_id");

    // Filter mock posts based on query parameters
    let filteredPosts = Array.from(posts.values());

    if (status) {
      filteredPosts = filteredPosts.filter((post) => post.status === status);
    }

    if (authorId) {
      filteredPosts = filteredPosts.filter(
        (post) => post.author_id === authorId
      );
    }

    // If not admin and not requesting own posts, only return published posts
    if (
      !session?.user ||
      (session.user.role !== "admin" && session.user.id !== authorId)
    ) {
      filteredPosts = filteredPosts.filter(
        (post) => post.status === "published"
      );
    }

    // Simple pagination
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        totalItems: totalPosts,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = postCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid post data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const postData = validationResult.data;

    // Add missing data
    const now = new Date();
    const postId = Date.now().toString();

    const newPost = {
      ...postData,
      id: postId,
      author_id: session.user.id,
      created_at: now,
      updated_at: now,
      published_at: postData.status === "published" ? now : null,
    };

    // Save post to mock storage
    posts.set(postId, newPost);

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
