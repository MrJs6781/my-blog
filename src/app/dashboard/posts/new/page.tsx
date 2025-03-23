"use client";

import { useState } from "react";
import { PostEditor } from "@/components/blog/post-editor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

// Mock categories and tags that would come from an API in a real app
const categories = [
  { id: "development", name: "Development" },
  { id: "design", name: "Design" },
  { id: "backend", name: "Backend" },
  { id: "frontend", name: "Frontend" },
  { id: "devops", name: "DevOps" },
];

const tags = [
  { id: "nextjs", name: "Next.js" },
  { id: "react", name: "React" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "tailwind", name: "Tailwind CSS" },
  { id: "css", name: "CSS" },
  { id: "design", name: "Design" },
  { id: "api", name: "API" },
  { id: "express", name: "Express" },
];

export default function NewPostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async (postData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Format data for API
      const apiData = {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        coverImage: postData.coverImage || "/images/placeholder-cover.jpg",
        category:
          categories.find((c) => c.id === postData.categoryId)?.name ||
          "Uncategorized",
        tags: postData.tags
          .map((tagId: string) => tags.find((t) => t.id === tagId)?.name || "")
          .filter(Boolean),
        published: postData.published,
      };

      // Call API to create post
      const response = await axios.post("/api/auth/posts", apiData);

      // Redirect to dashboard or post edit page
      if (response.data.success) {
        router.push(
          postData.published
            ? `/dashboard/posts/${response.data.post.id}`
            : "/dashboard/posts"
        );
      }
    } catch (err) {
      console.error("Failed to save post:", err);
      setError("Failed to save your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    // In a real app, this would open a preview in a new tab or modal
    console.log("Preview functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Create New Post</h1>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      <PostEditor
        categories={categories}
        tags={tags}
        onSave={handleSave}
        onPreview={handlePreview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
