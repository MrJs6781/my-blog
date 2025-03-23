"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

interface CommentsProps {
  postId: string;
}

interface CommentAuthor {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  postId: string;
  author: CommentAuthor;
  content: string;
  date: string;
  likes: number;
}

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await axios.get(`/api/auth/posts/${postId}/comments`);

        if (response.data && response.data.comments) {
          setComments(response.data.comments);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);

      // In a real application, the author would come from the authenticated user
      const mockAuthor = {
        id: "user123",
        name: "Guest User",
        avatar: "/images/placeholder-avatar.jpg",
      };

      const response = await axios.post(`/api/auth/posts/${postId}/comments`, {
        content: newComment,
        author: mockAuthor,
      });

      if (response.data && response.data.success) {
        setComments([response.data.comment, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Add a comment
          </label>
          <textarea
            id="comment"
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring disabled:opacity-50"
          disabled={isSubmitting || !newComment.trim()}
        >
          {isSubmitting ? "Submitting..." : "Submit Comment"}
        </button>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6">
              <div className="flex items-start">
                <Image
                  src={
                    comment.author.avatar || "/images/placeholder-avatar.jpg"
                  }
                  alt={comment.author.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">{comment.author.name}</h3>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                  <div className="mt-2 flex items-center">
                    <button className="text-gray-500 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      {comment.likes} likes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
