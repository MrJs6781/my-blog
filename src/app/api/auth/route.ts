import { NextRequest, NextResponse } from "next/server";

// Sign in API route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // In a real application, you would verify credentials against your backend
    // This is just a mock implementation
    if (email === "test@example.com" && password === "password") {
      // Mock successful authentication
      return NextResponse.json({
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
        },
        token: "mock-jwt-token",
      });
    }

    // Authentication failed
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
