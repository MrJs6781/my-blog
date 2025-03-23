import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Since we're using client-side cookies for auth,
    // the actual logout happens on the client by removing cookies
    // This endpoint exists primarily for logging and future token blacklisting if needed

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
