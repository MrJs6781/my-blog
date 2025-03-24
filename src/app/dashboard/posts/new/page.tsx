"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Dynamic import for the React Quill editor to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded bg-muted animate-pulse"></div>
  ),
});

// Quill editor modules and formats
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "code-block"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "code-block",
];

export default function NewPost() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [readTime, setReadTime] = useState(3); // estimated reading time in minutes

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  // Generate slug from title
  useEffect(() => {
    if (title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")
      );
    }
  }, [title]);

  // Fetch categories and tags
  useEffect(() => {
    if (user) {
      // Fetch categories from API
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data.categories || []);
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
        });

      // Fetch tags from API
      fetch("/api/tags")
        .then((res) => res.json())
        .then((data) => {
          setAvailableTags(data.tags || []);
        })
        .catch((err) => {
          console.error("Error fetching tags:", err);
        });
    }
  }, [user]);

  // Calculate reading time based on content length
  useEffect(() => {
    if (content) {
      // Strip HTML tags and count words
      const text = content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter(Boolean).length;
      // Average reading speed is about 200-250 words per minute
      const estimatedTime = Math.max(1, Math.ceil(words / 200));
      setReadTime(estimatedTime);
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!title || !content || !categoryId) {
      setError("Title, content, and category are required");
      setIsSubmitting(false);
      return;
    }

    // Process tags (comma-separated string to array)
    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const postData = {
        title,
        content,
        excerpt:
          excerpt || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
        slug,
        featured_image: featuredImage,
        category_id: categoryId,
        tags: tagArray,
        status: published ? "published" : "draft",
        author_id: user?.id,
        reading_time: readTime,
      };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create post");
      }

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      // Redirect to posts list
      router.push("/dashboard/posts");
    } catch (error: any) {
      console.error("Error creating post:", error);
      setError(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-12 w-64 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Create New Post</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                className="text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (title) {
                      setSlug(
                        title
                          .toLowerCase()
                          .replace(/[^\w\s]/gi, "")
                          .replace(/\s+/g, "-")
                      );
                    }
                  }}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This will be the URL of your post: yoursite.com/blog/{slug}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-2">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief summary of your post (shown in previews)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Card>
                    <CardContent className="p-4">
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        placeholder="Write your post content here..."
                        className="min-h-[300px]"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {featuredImage && (
                    <div className="mt-2 aspect-video w-full max-h-60 rounded-md overflow-hidden">
                      <img
                        src={featuredImage}
                        alt="Featured"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate tags with commas
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {availableTags.map((tag) => (
                        <Button
                          key={tag.id}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentTags = tags
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean);
                            if (!currentTags.includes(tag.name)) {
                              const newTags = [...currentTags, tag.name].join(
                                ", "
                              );
                              setTags(newTags);
                            }
                          }}
                          className="text-xs"
                        >
                          {tag.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={published}
                    onCheckedChange={setPublished}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <div className="space-y-2">
                  <Label>Estimated Reading Time</Label>
                  <p className="text-sm">
                    {readTime} {readTime === 1 ? "minute" : "minutes"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                {content ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {title || "Untitled Post"}
                      </CardTitle>
                      {excerpt && <CardDescription>{excerpt}</CardDescription>}
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                      {readTime} min read
                      {categoryId &&
                        ` • ${
                          categories.find((c) => c.id === categoryId)?.name
                        }`}
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-muted rounded-md">
                    <p className="text-muted-foreground">
                      Write some content to see the preview
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save {published ? "& Publish" : "as Draft"}</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
