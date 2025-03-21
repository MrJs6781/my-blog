import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Author {
  name: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: Author;
  coverImage: string;
  category: string;
  readingTime?: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // Format date
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="absolute left-2 top-2">
          <Badge
            variant="secondary"
            className="bg-background/80 backdrop-blur-sm"
          >
            {post.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime}</span>
            </div>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 text-xl font-bold leading-tight tracking-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex items-center space-x-2">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm font-medium">{post.author.name}</span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read more
        </Link>
      </CardFooter>
    </Card>
  );
}
