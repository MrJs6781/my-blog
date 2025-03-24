import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import type { User } from "@/lib/models/user";

// Mock user database
const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "user123", // In a real app, this would be hashed
    role: "user",
  },
];

// Define auth config
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Find the user with matching email and password
        const user = users.find(
          (user) => user.email === email && user.password === password
        );

        if (!user) {
          return null;
        }

        // Return the user without the password
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      // Send properties to the client
      if (session.user && token.sub) {
        session.user.id = token.sub;

        // Add role and other custom properties
        const user = users.find((user) => user.id === token.sub);
        if (user) {
          session.user.role = user.role;
        }
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      // Pass user id and role to the token
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "my-secret-key",
};

// Export the NextAuth handler
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Export a function to get the session on the server
export const getServerSession = auth;
