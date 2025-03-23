import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, Role } from "@/lib/auth";

// Mock tags database - in a real app, this would be stored in a database
export const tags = [
  {
    id: "nextjs",
    name: "Next.js",
    slug: "nextjs",
    count: 4,
  },
  {
    id: "react",
    name: "React",
    slug: "react",
    count: 6,
  },
  {
    id: "javascript",
    name: "JavaScript",
    slug: "javascript",
    count: 8,
  },
  {
    id: "typescript",
    name: "TypeScript",
    slug: "typescript",
    count: 5,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    slug: "tailwind-css",
    count: 3,
  },
  {
    id: "css",
    name: "CSS",
    slug: "css",
    count: 4,
  },
  {
    id: "design",
    name: "Design",
    slug: "design",
    count: 2,
  },
  {
    id: "api",
    name: "API",
    slug: "api",
    count: 3,
  },
  {
    id: "express",
    name: "Express",
    slug: "express",
    count: 2,
  },
];

// GET - fetch all tags
export async function GET(request: NextRequest) {
  try {
    // Fetch all tags
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST - create a new tag (requires AUTHOR or ADMIN role)
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        const body = await req.json();
        const { name, slug } = body;

        // Validate input
        if (!name) {
          return NextResponse.json(
            { error: "Tag name is required" },
            { status: 400 }
          );
        }

        // Create slug from name if not provided
        const tagSlug = slug || name.toLowerCase().replace(/\s+/g, "-");

        // Check if tag already exists
        const existingTag = await prisma.tag.findFirst({
          where: {
            OR: [{ name }, { slug: tagSlug }],
          },
        });

        if (existingTag) {
          return NextResponse.json(
            { error: "Tag with this name or slug already exists" },
            { status: 409 }
          );
        }

        // Create the tag
        const tag = await prisma.tag.create({
          data: {
            name,
            slug: tagSlug,
          },
        });

        return NextResponse.json({
          success: true,
          tag,
        });
      } catch (error) {
        console.error("Error creating tag:", error);
        return NextResponse.json(
          { error: "Failed to create tag" },
          { status: 500 }
        );
      }
    },
    [Role.AUTHOR, Role.ADMIN]
  );
}
