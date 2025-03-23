"use client";

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, Flag, Reply, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useParams } from "next/navigation";

interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  date?: string;
  createdAt?: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
}

const CommentItem: FC<{
  comment: Comment;
  postSlug: string;
  level?: number;
  onCommentAdded: () => void;
}> = ({ comment, postSlug, level = 0, onCommentAdded }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    // In a real app, you would call an API to update the like status
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked((prev) => !prev);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    try {
      // Call the API to save the reply
      // In a real app, this would include proper reply nesting
      await axios.post(`/api/auth/posts/${postSlug}/comments`, {
        content: replyContent,
        parentId: comment.id, // This would be used in a real implementation
      });

      // Notify parent component to refresh comments
      onCommentAdded();

      // Reset the form
      setReplyContent("");
      setIsReplying(false);
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Check if the dateString is empty or invalid
      if (!dateString) {
        return "Unknown date";
      }

      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  return (
    <div
      className={`border-l-2 pl-4 ${
        level === 0 ? "border-transparent" : "border-muted"
      } mb-4`}
    >
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <span className="font-semibold">{comment.author.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {formatDate(comment.date || comment.createdAt || "")}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mb-2 text-sm">{comment.content}</div>

          <div className="mb-4 flex gap-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2"
              onClick={handleLike}
            >
              <ThumbsUp
                className={`h-4 w-4 ${
                  isLiked ? "fill-primary text-primary" : ""
                }`}
              />
              <span>{likeCount > 0 ? likeCount : ""}</span>
              <span>{isLiked ? "Liked" : "Like"}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-4 w-4" />
              Reply
            </Button>
          </div>

          {isReplying && (
            <div className="mb-4">
              <Textarea
                placeholder="Write a reply..."
                className="mb-2 min-h-[80px]"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment?.replies?.length > 0 && (
            <div className="mt-4">
              {comment?.replies?.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postSlug={postSlug}
                  level={level + 1}
                  onCommentAdded={onCommentAdded}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommentSection: FC<CommentSectionProps> = ({ postId }) => {
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const slug = params?.slug as string;

  // Fetch comments when component mounts or when comments are added/updated
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      // Use the slug from URL params instead of post ID
      const response = await axios.get(`/api/auth/posts/${slug}/comments`);

      console.log("Comments API response:", response.data);

      // Ensure each comment has a valid date field
      const processedComments = (response.data.comments || []).map(
        (comment: any) => {
          // If comment.date is missing or invalid, set a default date
          if (!comment.date && comment.createdAt) {
            comment.date = comment.createdAt;
          }

          if (!comment.date) {
            comment.date = new Date().toISOString();
          }

          return comment;
        }
      );

      setComments(processedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;

    try {
      // Call API to save the comment
      await axios.post(`/api/auth/posts/${slug}/comments`, {
        content: commentContent,
      });

      // Refresh comments
      fetchComments();

      // Reset the form
      setCommentContent("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">
        Comments ({comments?.length || 0})
      </h2>

      {/* Add new comment */}
      <div className="mb-8">
        <Textarea
          placeholder="Add a comment..."
          className="mb-4 min-h-[100px]"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleCommentSubmit}
            disabled={!commentContent.trim()}
          >
            Post Comment
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading comments...</p>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postSlug={slug}
              onCommentAdded={fetchComments}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};
