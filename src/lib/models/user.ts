import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "user"]),
  image: z.string().optional(),
  bio: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
