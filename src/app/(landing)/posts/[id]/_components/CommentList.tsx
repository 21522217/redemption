"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  fetchCommentsWithUsers,
  deleteComment,
  updateComment,
} from "@/lib/firebase/apis/comment.server";
import {
  getPostAndUserById,
  isPostLiked,
  toggleLikePost,
} from "@/lib/firebase/apis/posts.server";
import { getTimeAgo, formatNumber } from "@/lib/utils";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { BadgeCheck } from "lucide-react";
import { Heart, MessageCircle, Repeat, Share2 } from "lucide-react";
import Image from "next/image";
import PostDropdown from "@/app/(landing)/_components/PostDropdown";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { PostSkeleton, CommentSkeleton } from "@/components/ui/skeleton";
import { fetchCurrentUser } from "@/lib/firebase/apis/user.server";
import { MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toggleRepost, isReposted } from "@/lib/firebase/apis/repost.server";

interface CommentListProps {
  postId: string;
  userId: string;
}

export default function CommentList({ postId, userId }: CommentListProps) {
  const { user: AuthUser } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const queryClient = useQueryClient();

  const [likes, setLikes] = useState(new Map<string, boolean>());
  const [reposts, setReposts] = useState(new Map<string, boolean>());
  const [showRepostDialog, setShowRepostDialog] = useState(false);

  const {
    data: postWithUser,
    isLoading: isPostLoading,
    error: postError,
    refetch,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const post = await getPostAndUserById(postId);
      if (AuthUser) {
        const isLiked = await isPostLiked(postId, AuthUser.uid);
        const isRepostedByUser = await isReposted(postId, AuthUser.uid);
        setLikes(new Map([[postId, isLiked]]));
        setReposts(new Map([[postId, isRepostedByUser]]));
      }
      return post;
    },
  });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsWithUsers(postId),
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!AuthUser) return null;
      return await fetchCurrentUser();
    },
    enabled: !!AuthUser,
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

  const updateCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      newContent,
    }: {
      commentId: string;
      newContent: string;
    }) => {
      await updateComment(commentId, newContent);
    },
    onSuccess: () => {
      setEditingCommentId(null);
      setEditingCommentContent("");
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
    if (!AuthUser) return;

    deleteCommentMutation.mutate(commentId, {
      onError: (error) => {
        console.error("Error deleting comment:", error);
      },
    });
  };

  const handleEditComment = (commentId: string, newContent: string) => {
    if (!AuthUser) return;

    updateCommentMutation.mutate(
      { commentId, newContent },
      {
        onError: (error) => {
          console.error("Error updating comment:", error);
        },
      }
    );
  };

  const handleLike = async (postId: string) => {
    if (!AuthUser) return;

    // Optimistic update
    const oldLikes = new Map(likes);
    const oldPostData = queryClient.getQueryData(["post", postId]);

    // Update likes state immediately
    setLikes((prevLikes) => {
      const updatedLikes = new Map(prevLikes);
      updatedLikes.set(postId, !updatedLikes.get(postId));
      return updatedLikes;
    });

    // Update post likes count immediately
    queryClient.setQueryData(["post", postId], (old: any) => ({
      ...old,
      likesCount: likes.get(postId) ? old.likesCount - 1 : old.likesCount + 1,
    }));

    try {
      await toggleLikePost(postId, AuthUser.uid);
    } catch (error) {
      // Rollback on error
      console.error("Failed to toggle like status:", error);
      setLikes(oldLikes);
      queryClient.setQueryData(["post", postId], oldPostData);
    }
  };

  const handleComment = () => {
    queryClient.invalidateQueries({ queryKey: ["comments", postId] });
  };

  const handleRepost = async (postId: string) => {
    if (!AuthUser) return;

    // Optimistic update
    const oldReposts = new Map(reposts);
    const oldPostData = queryClient.getQueryData(["post", postId]);

    // Update reposts state immediately
    setReposts((prevReposts) => {
      const updatedReposts = new Map(prevReposts);
      updatedReposts.set(postId, !updatedReposts.get(postId));
      return updatedReposts;
    });

    // Update post reposts count immediately
    queryClient.setQueryData(["post", postId], (old: any) => ({
      ...old,
      repostsCount: reposts.get(postId) ? old.repostsCount - 1 : old.repostsCount + 1,
    }));

    try {
      await toggleRepost(postId, AuthUser.uid);
    } catch (error) {
      // Rollback on error
      console.error("Failed to toggle repost status:", error);
      setReposts(oldReposts);
      queryClient.setQueryData(["post", postId], oldPostData);
    }
  };

  useEffect(() => {
    console.log(comments);
  }, [comments]);

  if (isPostLoading || isCommentsLoading) {
    return (
      <div className="flex flex-col w-full h-screen bg-zinc-50 dark:bg-background-content overflow-scroll mt-6 rounded-2xl">
        <PostSkeleton />
        {[...Array(3)].map((_, i) => (
          <CommentSkeleton key={i} />
        ))}
      </div>
    );
  }
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
                {AuthUser?.uid !== postWithUser.userId && (
                  <PostDropdown post={postWithUser} />
                )}
              </div>
              <p className="mt-3 break-words whitespace-pre-wrap">
                {postWithUser.content}
              </p>
              {postWithUser.media && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800">
                  <div className="relative w-full h-auto">
                    {postWithUser.type === "video" ? (
                      <video
                        src={postWithUser.media}
                        controls
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Image
                        src={postWithUser.media}
                        alt="Post media"
                        width={700}
                        height={475}
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-3 max-w-md text-zinc-500">
                <button
                  onClick={() => handleLike(postId)}
                  className="flex items-center gap-2 group"
                >
                  <div className="p-2 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500 text-red-500">
                    <Heart
                      className="w-5 h-5"
                      fill={likes.get(postId) ? "currentColor" : "none"}
                    />
                  </div>
                  <span>{formatNumber(postWithUser.likesCount ?? 0)}</span>
                </button>
                <button
                  className="flex items-center gap-2 group"
                  onClick={handleComment}
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 text-blue-500">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span>{formatNumber(postWithUser.commentsCount ?? 0)}</span>
                </button>
                {AuthUser?.uid !== postWithUser.userId && (
                  <button
                    className="flex items-center gap-2 group"
                    onClick={() => handleRepost(postId)}
                  >
                    <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 text-green-500">
                      <Repeat
                        className="w-5 h-5"
                        fill={reposts.get(postId) ? "currentColor" : "none"}
                      />
                    </div>
                    <span>{formatNumber(postWithUser.repostsCount ?? 0)}</span>
                  </button>
                )}
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
            <AvatarImage
              src={currentUser?.profilePicture}
              alt={currentUser?.username}
            />
            <AvatarFallback>{currentUser?.username?.charAt(0)}</AvatarFallback>
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
                <div className="flex items-center justify-between">
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
                  {AuthUser && comment.userId === AuthUser.uid && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingCommentContent(comment.content);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {editingCommentId === comment.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditComment(comment.id, editingCommentContent);
                    }}
                    className="mt-2"
                  >
                    <input
                      type="text"
                      value={editingCommentContent}
                      onChange={(e) => setEditingCommentContent(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none resize-none"
                    />
                    <Button
                      type="submit"
                      disabled={!editingCommentContent.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 mt-2"
                    >
                      Update
                    </Button>
                  </form>
                ) : (
                  <p className="mt-2 break-words whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showRepostDialog && (
        <Dialog
          open={showRepostDialog}
          onOpenChange={() => setShowRepostDialog(false)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Repost this post?</DialogTitle>
              <DialogDescription>
                This will appear on your profile and in your followers&apos;
                home timeline.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRepostDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => handleRepost(postId)}>Repost</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
