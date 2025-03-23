import { NextRequest, NextResponse } from "next/server";

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

// GET all tags
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      tags,
      count: tags.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST - create a new tag (admin only)
export async function POST(request: NextRequest) {
  try {
    // In a real app, you would validate authentication and authorization here
    // Only admin users should be able to create tags

    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    // Create slug from name if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-");

    // Check if tag with this slug already exists
    if (tags.some((tag) => tag.slug === slug)) {
      return NextResponse.json(
        { error: "Tag with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new tag
    const newTag = {
      id: slug,
      name: body.name,
      slug: slug,
      count: 0,
      ...body,
    };

    // In a real app, you would save to database here
    tags.push(newTag);

    return NextResponse.json({
      success: true,
      tag: newTag,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
