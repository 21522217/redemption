"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  fetchCommentsWithUsers,
  deleteComment,
} from "@/lib/firebase/apis/comment.server";
import {
  increaseCommentCount,
  decreaseCommentCount,
  getPostAndUserById,
} from "@/lib/firebase/apis/posts.server";

import { getTimeAgo } from "@/lib/utils";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import { Heart, MessageCircle, Repeat, Share2 } from "lucide-react";
import Image from "next/image";
import PostDropdown from "@/app/(landing)/_components/PostDropdown";

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
      await createComment({ userId, postId, content: comment });
      await increaseCommentCount(postId);
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteComment(commentId);
      await decreaseCommentCount(postId);
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

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  if (isPostLoading || isCommentsLoading) return <div>Loading...</div>;
  if (postError) return <div>Error: {postError.message}</div>;
  if (commentsError) return <div>Error: {commentsError.message}</div>;

  return (
    <div className="flex flex-col gap-4">
      {postWithUser && (
        <article className="border-b border-zinc-400/15 p-4 cursor-pointer">
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
                  <span className="font-bold hover:underline">
                    {postWithUser.user.username}
                  </span>
                  <span className="text-zinc-500">
                    {postWithUser.user.firstName} {postWithUser.user.lastName}
                  </span>
                  {postWithUser.user.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-zinc-500">·</span>
                  <span className="text-zinc-500">
                    {getTimeAgo(postWithUser.createdAt)}
                  </span>
                </div>
                <PostDropdown post={postWithUser} />
              </div>
              <p className="mt-1 break-words whitespace-pre-wrap">
                {postWithUser.content}
              </p>
              {postWithUser.media && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800">
                  <div className="aspect-video relative">
                    <Image
                      src={postWithUser.media || "/placeholder.svg"}
                      alt="Post media"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-3 max-w-md text-zinc-500">
                <button className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span>{postWithUser.likesCount}</span>
                </button>
                <button className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span>{postWithUser.commentsCount}</span>
                </button>
                <button className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <span>{postWithUser.repostsCount}</span>
                </button>
                <button className="group">
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-violet-500">
                    <Share2 className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </article>
      )}
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
      {comments?.map((comment: Comment & { user: User }) => (
        <div key={comment.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={comment.user.profilePicture}
                alt={comment.user.username}
              />
              <AvatarFallback>
                {comment.user.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="font-bold hover:underline">
              {comment.user.username}
            </span>
            <span className="text-zinc-500">
              {comment.user.firstName} {comment.user.lastName}
            </span>
          </div>
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
          {comment.userId === postId && (
            <div className="text-blue-500">
              This is a comment on your own post.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
