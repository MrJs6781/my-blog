"use client";

import { FC } from "react";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Author {
  name: string;
  avatar?: string;
  bio?: string;
}

interface Post {
  title: string;
  content: string;
  date: string;
  lastUpdated?: string;
  readTime?: string;
  coverImage?: string;
  author?: Author;
  category?: string;
  tags?: string[];
}

interface PostContentProps {
  post: Post;
}

export const PostContent: FC<PostContentProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <article className="mx-auto max-w-3xl">
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        {/* Post Metadata */}
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {post.author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          {post.readTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          )}
          {post.category && <Badge variant="secondary">{post.category}</Badge>}
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </header>

      {/* Post Content */}
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-2 text-lg font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      {post.author && post.author.bio && (
        <div className="mt-10 rounded-lg border p-6">
          <div className="flex items-center gap-4">
            {post.author.avatar && (
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{post.author.name}</h3>
              <p className="text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
