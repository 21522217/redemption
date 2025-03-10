"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  fetchPostsWithUsers,
  toggleLikePost,
  isPostLiked,
} from "@/lib/firebase/apis/posts.server";
import { toggleRepost, isReposted } from "@/lib/firebase/apis/repost.server";
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
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const PostView = () => {
  const { user: AuthUser, isLogin } = useAuth();
  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null);

  const [likes, setLikes] = useState(new Map<string, boolean>());
  const [reposts, setReposts] = useState(new Map<string, boolean>());

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
    const oldPostData = queryClient.getQueryData(["postsWithUsers"]);

    queryClient.setQueryData(["postsWithUsers"], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) => {
            if (post.id === postId) {
              const isCurrentlyLiked = likes.get(postId);
              return {
                ...post,
                isLiked: !isCurrentlyLiked, // Update the local state
                likesCount: isCurrentlyLiked
                  ? post.likesCount - 1
                  : post.likesCount + 1,
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
      queryClient.setQueryData(["postsWithUsers"], oldPostData);
    }
  };

  const handleComment = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const handleRepost = async (postId: string) => {
    if (!AuthUser) return;

    // Optimistic update
    const oldPostData = queryClient.getQueryData(["postsWithUsers"]);

    queryClient.setQueryData(["postsWithUsers"], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) => {
            if (post.id === postId) {
              const isCurrentlyReposted = reposts.get(postId);
              return {
                ...post,
                isReposted: !isCurrentlyReposted, // Update the local state
                repostsCount: isCurrentlyReposted
                  ? post.repostsCount - 1
                  : post.repostsCount + 1,
              };
            }
            return post;
          }),
        })),
      };
    });

    try {
      await toggleRepost(postId, AuthUser.uid);
      setReposts(
        (prevReposts) => new Map(prevReposts.set(postId, !prevReposts.get(postId)))
      );
    } catch (error) {
      // Rollback on error
      console.error("Failed to toggle repost status:", error);
      queryClient.setQueryData(["postsWithUsers"], oldPostData);
    }
  };

  useEffect(() => {
    if (postsWithUsers.length > 0 && AuthUser) {
      postsWithUsers.forEach(async (post) => {
        const isLiked = await isPostLiked(post.id, AuthUser.uid);
        setLikes((prevLikes) => new Map(prevLikes.set(post.id, isLiked)));

        const isRepostedStatus = await isReposted(post.id, AuthUser.uid);
        setReposts(
          (prevReposts) => new Map(prevReposts.set(post.id, isRepostedStatus))
        );
      });
    }
  }, [postsWithUsers, AuthUser]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-card  overflow-scroll mt-6 rounded-2xl">
      {isLogin && <PostCond />}
      {postsWithUsers.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-500">No posts</p>
        </div>
      ) : (
        postsWithUsers.map((post, index) => (
          <article
            key={post.id ?? `post-${index}`}
            className="border-b border-zinc-400/15 p-4 cursor-pointer"
            ref={
              index === postsWithUsers.length - 1 ? lastPostElementRef : null
            }
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
                  {post.user.id !== AuthUser?.uid && (
                    <PostDropdown post={post} />
                  )}
                </div>
                <p className="mt-1 break-words whitespace-pre-wrap">
                  {post.content}
                </p>
                {post.media && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800">
                    <div className="relative w-full h-auto">
                      {post.media.endsWith(".mp4") ? (
                        <video
                          src={post.media}
                          controls
                          className="w-full h-auto object-cover"
                        />
                      ) : (
                        <Image
                          src={post.media || "/placeholder.svg"}
                          alt="Post media"
                          layout="responsive"
                          width={700}
                          height={475}
                          className="object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="flex w-fit items-center justify-between mt-3 space-x-4 text-zinc-500">
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
                  {post.user.id !== AuthUser?.uid && (
                    <button
                      className="flex items-center gap-2 group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRepost(post.id);
                      }}
                    >
                      <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 text-green-500">
                        <Repeat
                          className="w-5 h-5"
                          fill={reposts.get(post.id) ? "currentColor" : "none"}
                        />
                      </div>
                      <span>{formatNumber(post.repostsCount ?? 0)}</span>
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
        ))
      )}

      {isFetching && (
        <div className="flex flex-col items-center justify-center bg-transparent pt-2 pb-2">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PostView;
