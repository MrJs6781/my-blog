import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Define the interface for JWT payload
export interface JwtPayload {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
  };
  iat?: number;
  exp?: number;
}

export async function verifyJwtToken(
  token: string
): Promise<JwtPayload | null> {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function createJwtToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
}
