"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  CalendarIcon,
  ChevronLeft,
  Tag,
  User,
} from "lucide-react";
import { CommentSection } from "@/components/blog/comment-section";
import { TableOfContents } from "@/components/blog/table-of-contents";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { PostWithRelations } from "@/lib/models/post";

// TOC items derived from the content
const tocItems = [
  { id: "introduction", text: "Introduction", level: 2 },
  { id: "installation", text: "Installation", level: 2 },
  { id: "key-features", text: "Key Features", level: 2 },
  { id: "improved-routing", text: "Improved Routing", level: 3 },
  { id: "server-components", text: "Server Components", level: 3 },
  { id: "turbopack", text: "Turbopack Improvements", level: 3 },
  {
    id: "performance-optimization",
    text: "Performance Optimization",
    level: 2,
  },
  { id: "image-optimization", text: "Image Optimization", level: 3 },
  { id: "code-splitting", text: "Code Splitting", level: 3 },
  { id: "conclusion", text: "Conclusion", level: 2 },
];

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const slug = params.slug as string;

  const [post, setPost] = useState<PostWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<PostWithRelations[]>([]);

  // Fetch post data
  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;

      setIsLoading(true);
      try {
        // Fetch post details
        const postResponse = await fetch(`/api/posts/by-slug/${slug}`);
        if (!postResponse.ok) {
          if (postResponse.status === 404) {
            throw new Error("Post not found");
          }
          throw new Error("Failed to fetch post");
        }

        const postData = await postResponse.json();
        setPost(postData.post);

        // Fetch comments for this post
        const commentsResponse = await fetch(
          `/api/comments?post_id=${postData.post.id}`
        );
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments || []);
        }

        // Fetch related posts (same category or tags)
        if (postData.post.category_id) {
          const relatedResponse = await fetch(
            `/api/posts?category_id=${postData.post.category_id}&limit=3&exclude=${postData.post.id}`
          );
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            setRelatedPosts(relatedData.posts || []);
          }
        }
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError(err.message || "Failed to load the post");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You must be signed in to leave a comment",
        variant: "destructive",
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Comment is empty",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: post?.id,
          content: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const data = await response.json();

      // Add new comment to the list
      setComments([...comments, data.comment]);
      setCommentText("");

      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    } catch (err) {
      console.error("Error submitting comment:", err);
      toast({
        title: "Error",
        description: "Failed to submit your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">
            {error === "Post not found" ? "Post Not Found" : "Error"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "We couldn't find the post you're looking for."}
          </p>
          <Button onClick={() => router.push("/blog")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/blog")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        {/* Post Header */}
        <div className="mb-8">
          {post.category && (
            <Link
              href={`/blog?category=${post.category.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {post.category.name}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author?.name || "Anonymous"}</span>
            </div>

            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>
                {new Date(
                  post.published_at || post.created_at || ""
                ).toLocaleDateString()}
              </span>
            </div>

            {post.reading_time && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.reading_time} min read</span>
              </div>
            )}

            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{comments.length} comments</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any) => (
                <Button key={tag.id} variant="outline" size="sm" asChild>
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
        )}

        <Separator className="my-8" />

        {/* Author Bio */}
        {post.author && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">About the Author</h3>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={post.author.image}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-medium">{post.author.name}</h4>
                    <p className="text-muted-foreground mt-1">
                      {"Author at My Blog"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Comments Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              placeholder="Leave a comment..."
              className="mb-3 min-h-24"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!user || isSubmittingComment}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!user || isSubmittingComment}>
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>

          {/* Comment List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment.user.image}
                          alt={comment.user.name}
                        />
                        <AvatarFallback>
                          {comment.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {comment.user.name}
                        </CardTitle>
                        <CardDescription>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base line-clamp-2">
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="hover:underline"
                      >
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt ||
                        relatedPost.content.substring(0, 100) + "..."}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" className="p-0" asChild>
                      <Link href={`/blog/${relatedPost.slug}`}>Read more</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
