import { NextRequest, NextResponse } from "next/server";
import { posts } from "../route";

// GET - Get a post by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const id = params.id;

    // Find the post
    const post = posts.find(post => post.id === id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
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

// PUT - Update a post by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const id = params.id;

    // Find the post index
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get the post
    const post = posts[postIndex];

    // Get the request body
    const body = await request.json();
    
    // Update post fields while preserving ID and slug
    const updatedPost = {
      ...post,
      ...body,
      id: post.id, // Keep original ID
      slug: post.slug // Keep original slug
    };

    // Update post in the array
    posts[postIndex] = updatedPost;

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const id = params.id;

    // Find the post index
    const postIndex = posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get the post
    const deletedPost = posts[postIndex];

    // Remove post from the array
    posts.splice(postIndex, 1);

    return NextResponse.json({ success: true, post: deletedPost });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
} 