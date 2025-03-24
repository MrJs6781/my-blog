import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { tagCreateSchema } from "@/lib/models/tag";

// Mock data storage
const tags = new Map([
  ["1", { id: "1", name: "React", slug: "react" }],
  ["2", { id: "2", name: "NextJS", slug: "nextjs" }],
  ["3", { id: "3", name: "Typescript", slug: "typescript" }],
  ["4", { id: "4", name: "Web Development", slug: "web-development" }],
]);

// GET /api/tags
export async function GET() {
  try {
    // Get all tags
    const allTags = Array.from(tags.values());
    return NextResponse.json({ tags: allTags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/tags
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate with Zod schema
    const validationResult = tagCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid tag data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const tagData = validationResult.data;

    // Check if slug already exists
    const existingTag = Array.from(tags.values()).find(
      (tag) => tag.slug === tagData.slug
    );

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new tag
    const tagId = Date.now().toString();
    const newTag = {
      ...tagData,
      id: tagId,
    };

    // Save tag to mock storage
    tags.set(tagId, newTag);

    return NextResponse.json({ tag: newTag }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
