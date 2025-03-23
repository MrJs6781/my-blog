"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Comments from "./comments";

interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  author: Author;
  coverImage: string;
  featuredImage?: string;
  category: string | { id: string; name: string; slug: string };
  tags: string[];
  readTime: string;
}

export default function BlogPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Get params using the useParams hook which is the correct way for client components
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch the post by its slug
        const response = await axios.get(`/api/auth/posts/${slug}`);

        if (response.data && response.data.post) {
          setPost(response.data.post);
        } else {
          setError("Failed to fetch the post");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load the post. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-64 bg-gray-200 rounded my-6"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <p className="mt-2">
            <Link href="/blog" className="text-blue-500 hover:underline">
              Return to blog
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Post not found</p>
          <p className="mt-2">
            <Link href="/blog" className="text-blue-500 hover:underline">
              Return to blog
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>

          <div className="flex items-center mb-4">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
            )}
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-gray-500">
                {post.date} · {post.readTime}
              </p>
            </div>
          </div>

          {/* Support both coverImage and featuredImage */}
          {(post.coverImage || post.featuredImage) && (
            <div className="relative h-80 md:h-96 w-full mb-8">
              <Image
                src={
                  post.coverImage ||
                  post.featuredImage ||
                  "/images/placeholder-cover.jpg"
                }
                alt={post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {typeof post.category === "string"
                ? post.category
                : post.category.name}
            </span>
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div
          className="prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t">
          <h3 className="text-xl font-semibold mb-4">About the Author</h3>
          <div className="flex items-start">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={60}
                height={60}
                className="rounded-full mr-4"
              />
            )}
            <div>
              <p className="font-medium text-lg">{post.author.name}</p>
              <p className="text-gray-600">{post.author.bio || "Author"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/blog" className="text-blue-500 hover:underline">
            ← Back to all posts
          </Link>
        </div>

        {/* Add Comments */}
        <Comments slug={post.slug} />
      </article>
    </div>
  );
}
