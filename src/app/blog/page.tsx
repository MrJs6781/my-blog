"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarIcon, Clock, Tag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PostWithRelations } from "@/lib/models/post";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const tagParam = searchParams.get("tag");
  const searchQuery = searchParams.get("q");

  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchQuery || "");

  // Fetch posts, categories, and tags
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Build query params for filtering
        const queryParams = new URLSearchParams();
        queryParams.append("status", "published");

        if (categoryParam) {
          queryParams.append("category_id", categoryParam);
        }

        if (tagParam) {
          queryParams.append("tag", tagParam);
        }

        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }

        // Fetch published posts
        const postsResponse = await fetch(
          `/api/posts?${queryParams.toString()}`
        );
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }
        const postsData = await postsResponse.json();
        setPosts(postsData.posts || []);

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.categories || []);

        // Fetch tags
        const tagsResponse = await fetch("/api/tags");
        if (!tagsResponse.ok) {
          throw new Error("Failed to fetch tags");
        }
        const tagsData = await tagsResponse.json();
        setTags(tagsData.tags || []);
      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError("Failed to load blog posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [categoryParam, tagParam, searchQuery]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = searchTerm
      ? `/blog?q=${encodeURIComponent(searchTerm)}`
      : "/blog";
    window.location.href = url;
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[250px]" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-1/3" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container py-10">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">
            Oops, something went wrong
          </h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Format the page title based on filters
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }

    if (categoryParam) {
      const categoryName = categories.find((c) => c.id === categoryParam)?.name;
      return categoryName ? `Posts in ${categoryName}` : "Blog";
    }

    if (tagParam) {
      const tagName = tags.find((t) => t.id === tagParam)?.name;
      return tagName ? `Posts Tagged with "${tagName}"` : "Blog";
    }

    return "Latest Blog Posts";
  };

  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>

          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <Input
              placeholder="Search posts..."
              className="mr-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No posts found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery || categoryParam || tagParam
                ? "Try different search terms or filters"
                : "Check back later for new content"}
            </p>
            <Button asChild variant="outline">
              <Link href="/blog">View All Posts</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  {post.category && (
                    <div className="mb-2">
                      <Link
                        href={`/blog?category=${post.category.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {post.category.name}
                      </Link>
                    </div>
                  )}
                  <CardTitle className="line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {post.excerpt || post.content.substring(0, 120) + "..."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden rounded-md mb-4">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="object-cover w-full h-full transition-all hover:scale-105"
                      />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="text-sm text-muted-foreground pt-0">
                  <div className="flex flex-wrap gap-x-4 gap-y-2 w-full">
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span>{post.author?.name || "Anonymous"}</span>
                    </div>

                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {new Date(
                          post.published_at || post.created_at || ""
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    {post.reading_time && (
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{post.reading_time} min read</span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <div className="space-y-4 w-full sm:w-1/2">
            <h2 className="text-xl font-bold">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    categoryParam === category.id ? "default" : "outline"
                  }
                  size="sm"
                  asChild
                >
                  <Link href={`/blog?category=${category.id}`}>
                    {category.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4 w-full sm:w-1/2">
            <h2 className="text-xl font-bold">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  variant="outline"
                  size="sm"
                  className={tagParam === tag.id ? "bg-primary/10" : ""}
                  asChild
                >
                  <Link
                    href={`/blog?tag=${tag.id}`}
                    className="flex items-center"
                  >
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    {tag.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
