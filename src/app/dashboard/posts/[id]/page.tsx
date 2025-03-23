"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Pencil,
  Trash2,
  ArrowLeft,
  Loader2,
  Calendar,
  User,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PostDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const postId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchPost = async () => {
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        setPost({
          id: postId,
          title: "Understanding Next.js 15 App Router",
          slug: "understanding-nextjs-15-app-router",
          content:
            "This is the full content of the blog post. It would typically be much longer and contain markdown formatting.",
          excerpt:
            "Learn how the App Router works in Next.js 15 and how to structure your application.",
          category: "Development",
          published: true,
          coverImage: "/images/placeholder-cover.jpg",
          createdAt: "2025-03-15T12:30:00Z",
          updatedAt: "2025-03-18T10:15:00Z",
          author: {
            name: "John Doe",
            avatar: "/images/placeholder-avatar.jpg",
          },
          stats: {
            views: 1243,
            likes: 87,
            comments: 32,
          },
        });
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // This would be your API call to delete the post
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to posts list after successful deletion
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{post.title}</CardTitle>
              <CardDescription className="mt-2">{post.excerpt}</CardDescription>
            </div>
            <Badge variant={post.published ? "default" : "outline"}>
              {post.published ? "Published" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {post.coverImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Published: {formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>By: {post.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline">
                {typeof post.category === "string"
                  ? post.category
                  : post.category?.name || "Uncategorized"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 rounded-lg bg-muted p-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Views</p>
                <p className="text-lg font-bold">
                  {post.stats.views.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Likes</p>
                <p className="text-lg font-bold">{post.stats.likes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Comments</p>
                <p className="text-lg font-bold">{post.stats.comments}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Content Preview</h3>
            <div className="rounded-md border p-4">
              <p className="line-clamp-4 text-muted-foreground">
                {post.content}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <em>
                  Content shortened for preview. The full post contains more
                  text and formatting.
                </em>
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/blog/${post.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Post
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/posts/${postId}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the post "{post.title}". This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
