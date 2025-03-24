import { z } from "zod";

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featured_image: z.string().optional(),
  author_id: z.string(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  category_id: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  published_at: z.date().optional(),
  reading_time: z.number().optional(),
});

export type Post = z.infer<typeof postSchema>;

export const postUpdateSchema = postSchema.partial().omit({ id: true });

export type PostUpdate = z.infer<typeof postUpdateSchema>;

export const postCreateSchema = postSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    published_at: true,
  })
  .extend({
    tags: z.array(z.string()).optional(),
  });

export type PostCreate = z.infer<typeof postCreateSchema>;

export interface PostWithRelations extends Post {
  author?: {
    id: string;
    name: string;
    image?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  tags?: {
    id: string;
    name: string;
  }[];
}
