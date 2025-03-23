import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    // Return the user without the password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  });
}
