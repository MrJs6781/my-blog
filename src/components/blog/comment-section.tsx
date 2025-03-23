"use client";

import { FC, useState } from "react";
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

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
}

const CommentItem: FC<{
  comment: Comment;
  postId: string;
  level?: number;
}> = ({ comment, postId, level = 0 }) => {
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

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;

    // In a real app, you would call an API to save the reply
    console.log(
      `Replying to comment ${comment.id} on post ${postId}:`,
      replyContent
    );

    // Reset the form
    setReplyContent("");
    setIsReplying(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
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
                {formatDate(comment.createdAt)}
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
                  postId={postId}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommentSection: FC<CommentSectionProps> = ({
  comments,
  postId,
}) => {
  const [commentContent, setCommentContent] = useState("");

  const handleCommentSubmit = () => {
    if (!commentContent.trim()) return;

    // In a real app, you would call an API to save the comment
    console.log(`Adding comment to post ${postId}:`, commentContent);

    // Reset the form
    setCommentContent("");
  };

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-2xl font-bold">Comments ({comments?.length})</h2>

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
      <div className="space-y-6">
        {comments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
