"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchPostsWithUsers,
  isPostLiked,
  toggleLikePost,
} from "@/lib/firebase/apis/posts.server";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Repeat, Share2, BadgeCheck } from "lucide-react";
import Image from "next/image";
import PostDropdown from "./PostDropdown";
import PostCond from "./PostCond";
import { Timestamp } from "firebase/firestore";

const PostView = () => {
  const { user: AuthUser, isLogin } = useAuth();
  const [postsWithUsers, setPostsWithUsers] = useState<
    Array<Post & { user: User }>
  >([]);
  const [likes, setLikes] = useState(new Map<string, boolean>());
  const [comments, setComments] = useState<number[]>([]);
  const [reposts, setReposts] = useState<number[]>([]);

  const handleLike = async (postId: string) => {
    if (!AuthUser) return;
    try {
      await toggleLikePost(postId, AuthUser.uid);
      setLikes((prevLikes) => {
        const updatedLikes = new Map(prevLikes);
        updatedLikes.set(postId, !updatedLikes.get(postId));
        return updatedLikes;
      });
    } catch (error) {
      console.error("Failed to toggle like status:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await fetchPostsWithUsers();
        setPostsWithUsers(posts);
        setComments(posts.map((post) => post.commentsCount));
        setReposts(posts.map((post) => post.repostsCount));

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
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, [AuthUser]);

  const formatNumber = (num: number) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();

  const getTimeAgo = (date: Timestamp | undefined) => {
    if (!date) return "";
    const parsedDate = date.toDate();
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - parsedDate.getTime()) / 60000
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  return (
    <div className="flex flex-col w-full h-screen bg-background-content overflow-scroll mt-6 rounded-2xl">
      {isLogin && <PostCond />}
      {postsWithUsers.map((post, index) => (
        <article
          key={post.id ?? `post-${index}`}
          className="border-b border-zinc-400/15 p-4 cursor-pointer"
        >
          <div className="flex items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap flex-row">
                <div className="flex items-center gap-2 flex-wrap flex-row">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={post.user.profilePicture}
                      alt={post.user.username}
                    />
                    <AvatarFallback>
                      {post.user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold hover:underline">
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
                <PostDropdown />
              </div>
              <p className="mt-1 break-words whitespace-pre-wrap">
                {post.content}
              </p>
              {post.media && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800">
                  <div className="aspect-video relative">
                    <Image
                      src={post.media || "/placeholder.svg"}
                      alt="Post media"
                      fill
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
                  <div className="p-2 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500">
                    <Heart
                      className="w-5 h-5"
                      fill={likes.get(post.id) ? "currentColor" : "none"}
                    />
                  </div>
                  <span>{formatNumber(post.likesCount)}</span>
                </button>
                <button className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span>{formatNumber(comments[index])}</span>
                </button>
                <button className="flex items-center gap-2 group">
                  <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <span>{formatNumber(reposts[index])}</span>
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
      ))}
    </div>
  );
};

export default PostView;
