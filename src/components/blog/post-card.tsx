import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MessageSquare, Eye } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    coverImage?: string;
    author?: {
      name: string;
      avatar?: string;
    };
    category?: string;
    readTime?: string;
    commentCount?: number;
    viewCount?: number;
  };
  variant?: "default" | "compact";
}

export const PostCard: FC<PostCardProps> = ({ post, variant = "default" }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <Link href={`/blog/${post.slug}`} className="flex h-full">
          {post.coverImage && (
            <div className="relative h-full w-24 shrink-0 sm:w-32">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex flex-col p-3">
            <h3 className="line-clamp-2 font-semibold">{post.title}</h3>
            <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
      <Link href={`/blog/${post.slug}`}>
        {post.coverImage && (
          <div className="relative h-48 w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </Link>
      <CardContent className="flex-1 p-4 pt-5">
        {post.category && (
          <Badge className="mb-2" variant="secondary">
            {post.category}
          </Badge>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-xl font-semibold tracking-tight hover:underline">
            {post.title}
          </h3>
        </Link>
        <p className="line-clamp-3 text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-4 py-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        {post.readTime && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        )}
        {post.commentCount !== undefined && (
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.commentCount} comments</span>
          </div>
        )}
        {post.viewCount !== undefined && (
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.viewCount} views</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
