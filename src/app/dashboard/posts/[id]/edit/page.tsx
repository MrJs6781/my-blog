"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// This would come from your API in a real implementation
const CATEGORIES = [
  { id: "1", name: "Development" },
  { id: "2", name: "Design" },
  { id: "3", name: "Backend" },
  { id: "4", name: "Frontend" },
  { id: "5", name: "DevOps" },
];

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const postId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [post, setPost] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    categoryId: "",
    published: false,
    coverImage: "",
  });

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchPost = async () => {
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setPost({
          title: "Sample Post Title",
          slug: "sample-post-title",
          content:
            "This is the full content of the blog post. It would typically be much longer and contain markdown formatting.",
          excerpt: "This is a brief excerpt that summarizes the post content.",
          categoryId: "1",
          published: true,
          coverImage: "/images/placeholder-cover.jpg",
        });
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPost((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // This would be your API call to update the post
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to posts list after successful save
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Error saving post:", error);
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-6">
        <Link
          href="/dashboard/posts"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to posts
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
          <CardDescription>
            Make changes to your post and save when you're done.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={post.slug}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                This will be used for the URL of your post.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={post.excerpt}
                onChange={handleChange}
                rows={2}
                required
              />
              <p className="text-xs text-muted-foreground">
                A brief summary of your post.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={post.content}
                onChange={handleChange}
                rows={12}
                required
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown formatting.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={post.categoryId}
                onValueChange={(value) =>
                  handleSelectChange("categoryId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                name="coverImage"
                value={post.coverImage}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={post.published}
                onCheckedChange={(checked) =>
                  handleSwitchChange("published", checked)
                }
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard/posts")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
