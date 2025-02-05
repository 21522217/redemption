"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  fetchCommentsWithUsers,
  deleteComment,
} from "@/lib/firebase/apis/comment.server";
import { increaseCommentCount, decreaseCommentCount } from "@/lib/firebase/apis/posts.server";

import { getTimeAgo } from "@/lib/utils";
import { Comment } from "@/types/comment";

interface CommentListProps {
  postId: string;
  userId: string;
}

export default function CommentList({ postId, userId }: CommentListProps) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsWithUsers(postId),
  });

  const commentMutation = useMutation({
    mutationFn: async (comment: string) => {
      await createComment({ userId, postId, content: comment });
      await increaseCommentCount(postId);
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteComment(commentId);
      await decreaseCommentCount(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleCommentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (newComment.trim()) {
      commentMutation.mutate(newComment);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleCommentSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border-none focus:outline-none resize-none bg-background-content p-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Post
        </button>
      </form>
      {comments?.map((comment: Comment) => (
        <div key={comment.id} className="flex flex-col gap-2">
          <p>{comment.content}</p>
          <span className="text-zinc-500">
            {getTimeAgo(comment.createdAt?.toString())}
          </span>
          {comment.userId === userId && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-500"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
