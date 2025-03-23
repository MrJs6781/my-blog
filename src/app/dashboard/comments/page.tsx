"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Check,
  X,
  AlertTriangle,
  MoreVertical,
  Eye,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

// Types
interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
  likes: number;
  status: "approved" | "pending" | "spam";
}

interface Post {
  id: string;
  title: string;
  slug: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<string>("all");

  // Fetch comments and posts data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch comments
        const commentsResponse = await axios.get("/api/auth/comments");
        setComments(commentsResponse.data.comments || []);

        // Fetch posts for the dropdown filter
        const postsResponse = await axios.get("/api/auth/posts");
        setPosts(postsResponse.data.posts || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter comments based on search, tab, and post selection
  useEffect(() => {
    let result = comments;

    // Filter by status (tab)
    if (currentTab !== "all") {
      result = result.filter((comment) => comment.status === currentTab);
    }

    // Filter by post
    if (selectedPost !== "all") {
      result = result.filter((comment) => comment.postId === selectedPost);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (comment) =>
          comment.content.toLowerCase().includes(term) ||
          comment.author.name.toLowerCase().includes(term)
      );
    }

    setFilteredComments(result);
  }, [comments, currentTab, selectedPost, searchTerm]);

  const handleStatusChange = async (commentId: string, newStatus: string) => {
    try {
      // Update status via API
      await axios.patch("/api/auth/comments", {
        id: commentId,
        status: newStatus,
      });

      // Update local state to reflect the change
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                status: newStatus as "approved" | "pending" | "spam",
              }
            : comment
        )
      );

      // If the action was to delete, remove from array
      if (newStatus === "deleted") {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      }
    } catch (err) {
      console.error("Failed to update comment status:", err);
      // You could add error toast notification here
    }
  };

  // Format comment date
  const formatCommentDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (err) {
      return "Unknown date";
    }
  };

  // Get the post title for a given post ID
  const getPostTitle = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    return post ? post.title : "Unknown Post";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Comments</h1>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Manage Comments</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredComments.length} comments
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedPost} onValueChange={setSelectedPost}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by post" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                {posts.map((post) => (
                  <SelectItem key={post.id} value={post.id}>
                    {post.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">
                  {comments.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <Badge variant="secondary" className="ml-2">
                  {comments.filter((c) => c.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                <Badge variant="secondary" className="ml-2">
                  {comments.filter((c) => c.status === "approved").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="spam">
                Spam
                <Badge variant="secondary" className="ml-2">
                  {comments.filter((c) => c.status === "spam").length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={currentTab} className="mt-0">
              {filteredComments.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No comments found.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={comment.author.avatar}
                              alt={comment.author.name}
                            />
                            <AvatarFallback>
                              {comment.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatCommentDate(comment.date)}
                              </span>
                              <Badge
                                variant={
                                  comment.status === "approved"
                                    ? "default"
                                    : comment.status === "pending"
                                    ? "outline"
                                    : "destructive"
                                }
                                className="ml-1"
                              >
                                {comment.status}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm">{comment.content}</p>
                            <div className="mt-2 text-xs text-muted-foreground">
                              On post:{" "}
                              <span className="font-medium">
                                {getPostTitle(comment.postId)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quick action buttons based on status */}
                          {comment.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleStatusChange(comment.id, "approved")
                                }
                                title="Approve"
                              >
                                <Check className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleStatusChange(comment.id, "spam")
                                }
                                title="Mark as spam"
                              >
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              </Button>
                            </>
                          )}

                          {/* Dropdown for all actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a
                                  href={`/blog/${
                                    posts.find((p) => p.id === comment.postId)
                                      ?.slug
                                  }`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View in context
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {comment.status !== "approved" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(comment.id, "approved")
                                  }
                                >
                                  <Check className="mr-2 h-4 w-4 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {comment.status !== "pending" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(comment.id, "pending")
                                  }
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Mark as pending
                                </DropdownMenuItem>
                              )}
                              {comment.status !== "spam" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(comment.id, "spam")
                                  }
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                                  Mark as spam
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                  handleStatusChange(comment.id, "deleted")
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
