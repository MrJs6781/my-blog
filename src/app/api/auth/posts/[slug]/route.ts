import { NextRequest, NextResponse } from "next/server";
import { posts } from "../route"; // Import posts from the main posts route

// GET a single post by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
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
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
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
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
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
