import { z } from "zod";

export const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export type Tag = z.infer<typeof tagSchema>;

export const tagCreateSchema = tagSchema.omit({ id: true });

export type TagCreate = z.infer<typeof tagCreateSchema>;

export const tagUpdateSchema = tagSchema.partial().omit({ id: true });

export type TagUpdate = z.infer<typeof tagUpdateSchema>;
