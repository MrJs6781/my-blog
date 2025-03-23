import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, Role } from "@/lib/auth";

// GET a tag by slug
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle params as a Promise in newer Next.js versions
    const params = await context.params;
    const slug = params.slug;

    // Find the tag
    const tag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Count posts with this tag
    const postCount = await prisma.tagsOnPosts.count({
      where: { tagId: tag.id },
    });

    return NextResponse.json({
      tag: {
        ...tag,
        postCount,
      },
    });
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json({ error: "Failed to fetch tag" }, { status: 500 });
  }
}

// PUT - update a tag (requires AUTHOR or ADMIN role)
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

        // Find the tag
        const tag = await prisma.tag.findUnique({
          where: { slug },
        });

        if (!tag) {
          return NextResponse.json({ error: "Tag not found" }, { status: 404 });
        }

        const body = await req.json();
        const { name, newSlug } = body;

        // Check if the new slug is already taken
        if (newSlug && newSlug !== slug) {
          const existingTag = await prisma.tag.findUnique({
            where: { slug: newSlug },
          });

          if (existingTag) {
            return NextResponse.json(
              { error: "Tag with this slug already exists" },
              { status: 409 }
            );
          }
        }

        // Update the tag
        const updatedTag = await prisma.tag.update({
          where: { id: tag.id },
          data: {
            name: name || tag.name,
            slug: newSlug || tag.slug,
          },
        });

        return NextResponse.json({
          success: true,
          tag: updatedTag,
        });
      } catch (error) {
        console.error("Error updating tag:", error);
        return NextResponse.json(
          { error: "Failed to update tag" },
          { status: 500 }
        );
      }
    },
    [Role.AUTHOR, Role.ADMIN]
  );
}

// DELETE - delete a tag (requires ADMIN role)
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

        // Find the tag
        const tag = await prisma.tag.findUnique({
          where: { slug },
        });

        if (!tag) {
          return NextResponse.json({ error: "Tag not found" }, { status: 404 });
        }

        // Check if there are posts using this tag
        const postsCount = await prisma.tagsOnPosts.count({
          where: { tagId: tag.id },
        });

        if (postsCount > 0) {
          return NextResponse.json(
            {
              error: "Cannot delete tag that is used by posts",
              postsCount,
            },
            { status: 400 }
          );
        }

        // Delete the tag
        const deletedTag = await prisma.tag.delete({
          where: { id: tag.id },
        });

        return NextResponse.json({
          success: true,
          tag: deletedTag,
        });
      } catch (error) {
        console.error("Error deleting tag:", error);
        return NextResponse.json(
          { error: "Failed to delete tag" },
          { status: 500 }
        );
      }
    },
    [Role.ADMIN]
  );
}
