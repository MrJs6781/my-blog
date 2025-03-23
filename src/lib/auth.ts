import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

// Define Role enum here instead of importing from @prisma/client
export enum Role {
  USER = "USER",
  AUTHOR = "AUTHOR",
  ADMIN = "ADMIN",
}

// Define a User type
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  bio?: string | null;
  avatar?: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

// Salt rounds for bcrypt
const SALT_ROUNDS = 10;

// JWT expiration time (1 week)
const JWT_EXPIRATION = "7d";

// Interface for JWT payload
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Function to compare a password with a hash
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Function to generate a JWT token
export function generateToken(user: {
  id: string;
  email: string;
  role: Role;
}): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: JWT_EXPIRATION,
  });
}

// Function to verify a JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    return null;
  }
}

// Middleware to protect routes
export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>,
  requiredRoles?: Role[]
): Promise<NextResponse> {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the token
    const token = authHeader.split(" ")[1];

    // Verify the token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user has the required role
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Call the handler with the authenticated user
    return handler(request, user);
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
