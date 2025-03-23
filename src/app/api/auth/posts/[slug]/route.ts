import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, Role } from "@/lib/auth";

// GET a single post by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const slug = params.slug;

    console.log(slug);

    // Find the post in the database
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        relatedPosts: {
          include: {
            relatedTo: {
              select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                featuredImage: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Format the post for the response
    const formattedPost = {
      ...post,
      tags: post.tags.map((t: any) => t.tag.name),
      relatedPosts: post.relatedPosts.map((r: any) => r.relatedTo),
    };

    return NextResponse.json({ post: formattedPost });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT - update a post (requires authentication and AUTHOR or ADMIN role)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        // Handle params as a Promise in newer Next.js versions
        const params = await context.params;
        const slug = params.slug;

        // Find the post
        const post = await prisma.post.findUnique({
          where: { slug },
          include: {
            tags: true,
          },
        });

        if (!post) {
          return NextResponse.json(
            { error: "Post not found" },
            { status: 404 }
          );
        }

        // Check if the user is the author or an admin
        if (post.authorId !== user.id && user.role !== Role.ADMIN) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { title, content, excerpt, categoryId, tags, published } = body;

        // Update the post
        const updatedPost = await prisma.post.update({
          where: { id: post.id },
          data: {
            title,
            content,
            excerpt,
            categoryId,
            published: published !== undefined ? published : post.published,
            featuredImage: body.featuredImage || post.featuredImage,
            readTime: content ? calculateReadTime(content) : post.readTime,
          },
        });

        // Update tags if provided
        if (tags && Array.isArray(tags)) {
          // Remove existing tags
          await prisma.tagsOnPosts.deleteMany({
            where: { postId: post.id },
          });

          // Add new tags
          for (const tagName of tags) {
            // Find or create the tag
            let tag = await prisma.tag.findUnique({
              where: { name: tagName },
            });

            if (!tag) {
              tag = await prisma.tag.create({
                data: {
                  name: tagName,
                  slug: tagName.toLowerCase().replace(/\s+/g, "-"),
                },
              });
            }

            // Link the tag to the post
            await prisma.tagsOnPosts.create({
              data: {
                postId: post.id,
                tagId: tag.id,
              },
            });
          }
        }

        return NextResponse.json({
          success: true,
          post: updatedPost,
        });
      } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
          { error: "Failed to update post" },
          { status: 500 }
        );
      }
    },
    [Role.AUTHOR, Role.ADMIN]
  );
}

// DELETE a post (requires authentication and AUTHOR or ADMIN role)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        // Handle params as a Promise in newer Next.js versions
        const params = await context.params;
        const slug = params.slug;

        // Find the post
        const post = await prisma.post.findUnique({
          where: { slug },
        });

        if (!post) {
          return NextResponse.json(
            { error: "Post not found" },
            { status: 404 }
          );
        }

        // Check if the user is the author or an admin
        if (post.authorId !== user.id && user.role !== Role.ADMIN) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Delete related records first
        await prisma.tagsOnPosts.deleteMany({
          where: { postId: post.id },
        });

        await prisma.relatedPost.deleteMany({
          where: {
            OR: [{ postId: post.id }, { relatedToId: post.id }],
          },
        });

        await prisma.comment.deleteMany({
          where: { postId: post.id },
        });

        // Delete the post
        const deletedPost = await prisma.post.delete({
          where: { id: post.id },
        });

        return NextResponse.json({
          success: true,
          post: deletedPost,
        });
      } catch (error) {
        console.error("Error deleting post:", error);
        return NextResponse.json(
          { error: "Failed to delete post" },
          { status: 500 }
        );
      }
    },
    [Role.AUTHOR, Role.ADMIN]
  );
}

// Helper function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}
