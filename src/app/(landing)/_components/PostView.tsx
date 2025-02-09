"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  fetchPostsWithUsers,
  toggleLikePost,
} from "@/lib/firebase/apis/posts.server";
import { createRepost } from "@/lib/firebase/apis/repost.server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle,
  Heart,
  Repeat,
  Share2,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import PostDropdown from "./PostDropdown";
import PostCond from "./PostCond";
import { getTimeAgo, formatNumber } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const PostView = () => {
  const { user: AuthUser, isLogin } = useAuth();
  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null);

  const [likes, setLikes] = useState(new Map<string, boolean>());
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["postsWithUsers"],
      queryFn: async ({ pageParam = 1 }) => {
        const posts = await fetchPostsWithUsers(pageParam);
        return { posts, nextPage: posts.length ? pageParam + 1 : undefined };
      },
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });

  const postsWithUsers = data?.pages.flatMap((page) => page.posts) || [];

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  const handleLike = async (postId: string) => {
    if (!AuthUser) return;

    // Optimistic update
    const oldLikes = new Map(likes);
    const oldPostData = queryClient.getQueryData(["postsWithUsers"]);

    // Update likes state immediately
    setLikes((prevLikes) => {
      const updatedLikes = new Map(prevLikes);
      updatedLikes.set(postId, !updatedLikes.get(postId));
      return updatedLikes;
    });

    queryClient.setQueryData(["postsWithUsers"], (old: any) => {
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) => {
            if (post.id === postId) {
              return {
                ...post,
                likesCount: Math.max(
                  0,
                  likes.get(postId) ? post.likesCount - 1 : post.likesCount + 1
                ),
              };
            }
            return post;
          }),
        })),
      };
    });

    try {
      await toggleLikePost(postId, AuthUser.uid);
    } catch (error) {
      // Rollback on error
      console.error("Failed to toggle like status:", error);
      setLikes(oldLikes);
      queryClient.setQueryData(["postsWithUsers"], oldPostData);
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const handleRepost = (postId: string) => {
    setSelectedPostId(postId);
    setShowRepostDialog(true);
  };

  const confirmRepost = async () => {
    if (!AuthUser || !selectedPostId) return;
    try {
      await createRepost(selectedPostId, AuthUser.uid);
      await Promise.all([setShowRepostDialog(false), router.push("/profile")]);
    } catch (error) {
      console.error("Failed to create repost:", error);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-background-content overflow-scroll mt-6 rounded-2xl">
      {isLogin && <PostCond />}
      {postsWithUsers.map((post, index) => (
        <article
          key={post.id ?? `post-${index}`}
          className="border-b border-zinc-400/15 p-4 cursor-pointer"
          ref={index === postsWithUsers.length - 1 ? lastPostElementRef : null}
        >
          <div className="flex items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap flex-row">
                <div className="flex items-center gap-2 flex-wrap flex-row">
                  <Avatar
                    onClick={() =>
                      router.push(
                        post.user.id === AuthUser?.uid
                          ? "/profile"
                          : `/profile/${post.user.id}`
                      )
                    }
                    className="w-10 h-10"
                  >
                    <AvatarImage
                      src={post.user.profilePicture}
                      alt={post.user.username}
                    />
                    <AvatarFallback>
                      {post.user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    onClick={() =>
                      router.push(
                        post.user.id === AuthUser?.uid
                          ? "/profile"
                          : `/profile/${post.user.id}`
                      )
                    }
                    className="font-bold hover:underline"
                  >
                    {post.user.username}
                  </span>
                  {post.user.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-zinc-500">·</span>
                  <span className="text-zinc-500">
                    {getTimeAgo(post.createdAt)}
                  </span>
                </div>
                <PostDropdown post={post} />
              </div>
              <p className="mt-1 break-words whitespace-pre-wrap">
                {post.content}
              </p>
              {post.media && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800">
                  <div className="relative w-full h-auto">
                    <Image
                      src={post.media || "/placeholder.svg"}
                      alt="Post media"
                      layout="responsive"
                      width={700}
                      height={475}
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mt-3 max-w-md text-zinc-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 group"
                >
                  <div className="p-2 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500 text-red-500">
                    <Heart
                      className="w-5 h-5"
                      fill={likes.get(post.id) ? "currentColor" : "none"}
                    />
                  </div>
                  <span>{formatNumber(post.likesCount ?? 0)}</span>
                </button>
                <button
                  className="flex items-center gap-2 group"
                  onClick={() => handleComment(post.id)}
                >
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 text-blue-500">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span>{formatNumber(post.commentsCount ?? 0)}</span>
                </button>
                <button
                  className="flex items-center gap-2 group"
                  onClick={() => handleRepost(post.id)}
                >
                  <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 text-green-500">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <span>{formatNumber(post.repostsCount ?? 0)}</span>
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
      ))}

      {isFetching && (
        <div className="flex flex-col items-center justify-center bg-transparent pt-2 pb-2">
          <Loader2 className="animate-spin" />
        </div>
      )}

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
              <Button onClick={confirmRepost}>Repost</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PostView;
