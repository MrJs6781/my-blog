"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/context/auth-context";
import { PostWithRelations } from "@/lib/models/post";

export default function PostsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts on component mount
  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push("/signin");
      return;
    }

    async function fetchPosts() {
      try {
        const query =
          user?.role === "admin"
            ? "/api/posts"
            : `/api/posts?author_id=${user?.id}`;

        const response = await fetch(query);

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchPosts();
    }
  }, [user, router]);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Remove the deleted post from state
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Posts</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
              <CardFooter>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">My Posts</h1>
        <Card className="mb-4">
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state
  if (posts.length === 0) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Posts</h1>
          <Button asChild>
            <Link href="/dashboard/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground mb-4">
              You haven't created any posts yet.
            </p>
            <Button asChild>
              <Link href="/dashboard/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Post
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show posts list
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Button asChild>
          <Link href="/dashboard/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                {post.status === "published"
                  ? `Published on ${new Date(
                      post.published_at ?? ""
                    ).toLocaleDateString()}`
                  : `Draft - Last updated on ${new Date(
                      post.updated_at ?? ""
                    ).toLocaleDateString()}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {post.excerpt || post.content.substring(0, 150)}...
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/posts/${post.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(post.id ?? "")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
