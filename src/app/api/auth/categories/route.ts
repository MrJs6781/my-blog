import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, Role } from "@/lib/auth";

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

// GET - fetch all categories
export async function GET(request: NextRequest) {
  try {
    // Fetch all categories
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - create a new category (requires ADMIN role)
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, user) => {
      try {
        const body = await req.json();
        const { name, slug } = body;

        // Validate input
        if (!name || !slug) {
          return NextResponse.json(
            { error: "Name and slug are required" },
            { status: 400 }
          );
        }

        // Check if category already exists
        const existingCategory = await prisma.category.findFirst({
          where: {
            OR: [{ name }, { slug }],
          },
        });

        if (existingCategory) {
          return NextResponse.json(
            { error: "Category with this name or slug already exists" },
            { status: 409 }
          );
        }

        // Create the category
        const category = await prisma.category.create({
          data: {
            name,
            slug,
          },
        });

        return NextResponse.json({
          success: true,
          category,
        });
      } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
          { error: "Failed to create category" },
          { status: 500 }
        );
      }
    },
    [Role.ADMIN]
  );
}
