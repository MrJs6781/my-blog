import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});

export type Category = z.infer<typeof categorySchema>;

export const categoryCreateSchema = categorySchema.omit({ id: true });

export type CategoryCreate = z.infer<typeof categoryCreateSchema>;

export const categoryUpdateSchema = categorySchema.partial().omit({ id: true });

export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
