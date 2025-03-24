import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { categoryCreateSchema } from "@/lib/models/category";

// Mock data storage
const categories = new Map([
  [
    "1",
    {
      id: "1",
      name: "Technology",
      slug: "technology",
      description: "Technology related posts",
    },
  ],
  [
    "2",
    {
      id: "2",
      name: "Travel",
      slug: "travel",
      description: "Travel related posts",
    },
  ],
  [
    "3",
    { id: "3", name: "Food", slug: "food", description: "Food related posts" },
  ],
]);

// GET /api/categories
export async function GET() {
  try {
    // Get all categories
    const allCategories = Array.from(categories.values());
    return NextResponse.json({ categories: allCategories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories
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
    const validationResult = categoryCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid category data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const categoryData = validationResult.data;

    // Check if slug already exists
    const existingCategory = Array.from(categories.values()).find(
      (category) => category.slug === categoryData.slug
    );

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const categoryId = Date.now().toString();
    const newCategory = {
      ...categoryData,
      id: categoryId,
    };

    // Save category to mock storage
    categories.set(categoryId, newCategory);

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
