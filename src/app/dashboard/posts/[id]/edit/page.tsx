"use client";

import { useState, useEffect } from "react";
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

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<any>(null);
  const router = useRouter();

  // Fetch the post data when the component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch post by ID
        const response = await axios.get(`/api/auth/posts/${params.id}`);

        if (response.data.post) {
          // Format post data for the editor
          const postData = response.data.post;

          // Find category ID from name
          const categoryId =
            categories.find((c) => c.name === postData.category)?.id || "";

          // Find tag IDs from names
          const tagIds = postData.tags
            .map(
              (tagName: string) =>
                tags.find((t) => t.name === tagName)?.id || ""
            )
            .filter(Boolean);

          setPost({
            ...postData,
            categoryId,
            tags: tagIds,
            published: true, // Assuming fetched posts are published
          });
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load the post. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

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

      // Call API to update post
      const response = await axios.put(`/api/auth/posts/${params.id}`, apiData);

      // Redirect to dashboard or post view page
      if (response.data.success) {
        router.push(
          postData.published
            ? `/blog/${response.data.post.slug}`
            : "/dashboard/posts"
        );
      }
    } catch (err) {
      console.error("Failed to update post:", err);
      setError("Failed to update your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    // In a real app, this would open a preview in a new tab or modal
    window.open(`/blog/${post.slug}?preview=true`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        {error || "Post not found"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/posts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Post</h1>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          {error}
        </div>
      )}

      <PostEditor
        initialData={post}
        categories={categories}
        tags={tags}
        onSave={handleSave}
        onPreview={handlePreview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
