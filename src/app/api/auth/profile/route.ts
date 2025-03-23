import { NextRequest, NextResponse } from "next/server";

// Mock user data - would be stored in a database in a real app
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    bio: "Senior Frontend Developer with a passion for React and modern web technologies.",
    avatar: "/images/placeholder-avatar.jpg",
    role: "admin",
    social: {
      twitter: "johndoe",
      github: "johndoe",
      linkedin: "johndoe",
    },
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    bio: "UI/UX Designer creating beautiful and functional user experiences.",
    avatar: "/images/placeholder-avatar.jpg",
    role: "author",
    social: {
      twitter: "janesmith",
      github: "janesmith",
      linkedin: "janesmith",
    },
  },
];

// GET - fetch the current user's profile
export async function GET(request: NextRequest) {
  try {
    // In a real app, you would get the user ID from an auth token
    // For this mock, we'll always return the first user
    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive information like password before returning
    const { id, name, email, bio, avatar, role, social } = user;

    return NextResponse.json({
      profile: { id, name, email, bio, avatar, role, social },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PATCH - update the current user's profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // In a real app, you would get the user ID from an auth token
    // For this mock, we'll always update the first user
    const userIndex = 0;
    const user = users[userIndex];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate the updates
    const allowedFields = ["name", "bio", "social"];
    const updates: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Update the user
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
    };

    // Return the updated profile (excluding sensitive data)
    const { id, name, email, bio, avatar, role, social } = users[userIndex];

    return NextResponse.json({
      success: true,
      profile: { id, name, email, bio, avatar, role, social },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
