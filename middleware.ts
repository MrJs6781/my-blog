import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Only protect specific routes
  const protectedPaths = ["/dashboard", "/admin", "/profile", "/settings"];

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value;

  // If no token, redirect to signin
  if (!token) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  try {
    // Verify token
    verify(token, process.env.JWT_SECRET || "fallback_secret");
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to signin
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
