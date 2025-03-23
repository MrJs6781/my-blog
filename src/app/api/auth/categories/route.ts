import { NextRequest, NextResponse } from "next/server";

// Mock categories database - in a real app, this would be stored in a database
export const categories = [
  {
    id: "development",
    name: "Development",
    description: "Articles about software development and programming",
    slug: "development",
    count: 5,
  },
  {
    id: "design",
    name: "Design",
    description: "Articles about UI/UX design and visual aesthetics",
    slug: "design",
    count: 3,
  },
  {
    id: "backend",
    name: "Backend",
    description: "Articles about server-side technologies and databases",
    slug: "backend",
    count: 2,
  },
  {
    id: "frontend",
    name: "Frontend",
    description: "Articles about client-side technologies and frameworks",
    slug: "frontend",
    count: 4,
  },
  {
    id: "devops",
    name: "DevOps",
    description: "Articles about deployment, CI/CD, and infrastructure",
    slug: "devops",
    count: 1,
  },
];

// GET all categories
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      categories,
      count: categories.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    // In a real app, you would validate authentication and authorization here
    // Only admin users should be able to create categories

    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create slug from name if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-");

    // Check if category with this slug already exists
    if (categories.some((cat) => cat.slug === slug)) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = {
      id: slug,
      name: body.name,
      description: body.description || "",
      slug: slug,
      count: 0,
      ...body,
    };

    // In a real app, you would save to database here
    categories.push(newCategory);

    return NextResponse.json({
      success: true,
      category: newCategory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
