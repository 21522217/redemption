"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  fetchCommentsWithUsers,
  deleteComment,
} from "@/lib/firebase/apis/comment.server";
import { getPostAndUserById } from "@/lib/firebase/apis/posts.server";
import { getTimeAgo, formatNumber } from "@/lib/utils";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import { Heart, MessageCircle, Repeat, Share2 } from "lucide-react";
import Image from "next/image";
import PostDropdown from "@/app/(landing)/_components/PostDropdown";
import { Button } from "@/components/ui/button";

interface CommentListProps {
  postId: string;
  userId: string;
}

export default function CommentList({ postId, userId }: CommentListProps) {
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();

  const {
    data: postWithUser,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostAndUserById(postId),
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsWithUsers(postId),
  });

  const commentMutation = useMutation({
    mutationFn: async (comment: string) => {
      await createComment(postId, { userId, postId, content: comment });
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteComment(postId, commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
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

  const handleEditComment = (commentId: string, newContent: string) => {
    // Implement the edit comment functionality here
  };

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  if (isPostLoading || isCommentsLoading) return <div>Loading...</div>;
  if (postError) return <div>Error: {postError.message}</div>;
  if (commentsError) return <div>Error: {commentsError.message}</div>;

  return (
    <div className="flex flex-col w-full h-screen bg-zinc-50 dark:bg-background-content overflow-scroll mt-6 rounded-2xl">
      {/* Original Post */}
      {postWithUser && (
        <article className="border-b border-zinc-400/15 p-4">
          <div className="flex items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap flex-row">
                <div className="flex items-center gap-2 flex-wrap flex-row">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={postWithUser.user.profilePicture}
                      alt={postWithUser.user.username}
                    />
                    <AvatarFallback>
                      {postWithUser.user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold hover:underline">
                        {postWithUser.user.username}
                      </span>
                      {postWithUser.user.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <span className="text-zinc-500 text-sm">
                      {getTimeAgo(postWithUser.createdAt)}
                    </span>
                  </div>
                </div>
                <PostDropdown post={postWithUser} />
              </div>
              <p className="mt-3 break-words whitespace-pre-wrap">
                {postWithUser.content}
              </p>
              {postWithUser.media && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800">
                  <div className="relative w-full h-auto">
                    <Image
                      src={postWithUser.media}
                      alt="Post media"
                      width={700}
                      height={475}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-3 max-w-md text-zinc-500">
                <button className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500 text-red-500">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span>{formatNumber(postWithUser.likesCount)}</span>
                </button>
                <button className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 text-blue-500">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span>{formatNumber(postWithUser.commentsCount)}</span>
                </button>
                <button className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 text-green-500">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <span>{formatNumber(postWithUser.repostsCount)}</span>
                </button>
                <button className="group">
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-violet-500 text-violet-500">
                    <Share2 className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Comment Input */}
      <form
        onSubmit={handleCommentSubmit}
        className="border-b border-zinc-400/15 p-4"
      >
        <div className="flex gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={postWithUser?.user.profilePicture} />
            <AvatarFallback>
              {postWithUser?.user.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Post your reply"
              className="flex-1 bg-transparent border-none focus:outline-none resize-none"
            />
            <Button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
            >
              Reply
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex flex-col">
        {comments?.map((comment: Comment & { user: User }) => (
          <div
            key={comment.id}
            className="border-b border-zinc-400/15 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={comment.user.profilePicture}
                  alt={comment.user.username}
                />
                <AvatarFallback>
                  {comment.user.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold hover:underline">
                    {comment.user.username}
                  </span>
                  {comment.user.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-zinc-500 text-sm">
                    {getTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-2 break-words whitespace-pre-wrap">
                  {comment.content}
                </p>
                <div className="flex items-center gap-6 mt-3 text-zinc-500">
                  <button className="flex items-center gap-2 group">
                    <div className="p-2 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500">
                      <Heart className="w-4 h-4" />
                    </div>
                  </button>
                  <button className="flex items-center gap-2 group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  </button>
                  <button className="flex items-center gap-2 group">
                    <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500">
                      <Repeat className="w-4 h-4" />
                    </div>
                  </button>
                  <button className="group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-violet-500">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
