"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  fetchPostsWithUsers,
  isPostLiked,
  toggleLikePost,
} from "@/lib/firebase/apis/posts.server";
import { createRepost } from "@/lib/firebase/apis/repost.server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Repeat, Share2, BadgeCheck } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import SpinningLoading from "@/components/SpinningLoading";

const PostView = () => {
  const { user: AuthUser, isLogin } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const [likes, setLikes] = useState(new Map<string, boolean>());
  const [showRepostDialog, setShowRepostDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const {
    data: postsWithUsers = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["postsWithUsers", page],
    queryFn: async () => {
      const posts = await fetchPostsWithUsers(page);
      if (posts.length === 0) {
        setHasMore(false);
      }
      if (AuthUser) {
        const likedPosts = await Promise.all(
          posts.map(async (post) => ({
            postId: post.id,
            isLiked: await isPostLiked(post.id, AuthUser.uid),
          }))
        );
        setLikes(
          new Map(likedPosts.map(({ postId, isLiked }) => [postId, isLiked]))
        );
      }
      return posts;
    },
  });

  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }
  }, [hasMore]);

  const handleLike = async (postId: string) => {
    if (!AuthUser) return;
    try {
      await toggleLikePost(postId, AuthUser.uid);
      setLikes((prevLikes) => {
        const updatedLikes = new Map(prevLikes);
        updatedLikes.set(postId, !updatedLikes.get(postId));
        return updatedLikes;
      });
      refetch();
    } catch (error) {
      console.error("Failed to toggle like status:", error);
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
      setShowRepostDialog(false);
      router.push("/profile");
    } catch (error) {
      console.error("Failed to create repost:", error);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-zinc-50 dark:bg-background-content overflow-scroll mt-6 rounded-2xl">
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
      {isLoading && <SpinningLoading />}
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
