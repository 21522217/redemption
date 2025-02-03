"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PostCond from "./PostCond";
import {
  fetchPostsWithUsers,
  toggleLikePost,
  isPostLiked,
} from "@/lib/firebase/apis/posts.server";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Repeat, Share2 } from "lucide-react";
import Image from "next/image";

const PostView = () => {
  const { user, isLogin } = useAuth();
  const [postsWithUsers, setPostsWithUsers] = useState<
    Array<Post & { user: User }>
  >([]);
  const [likes, setLikes] = useState(new Map<string, boolean>());
  const [comments, setComments] = useState<number[]>([]);
  const [reposts, setReposts] = useState<number[]>([]);

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      await toggleLikePost(postId, user.uid);
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
        posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPostsWithUsers(posts);
        setComments(posts.map((post) => post.commentsCount));
        setReposts(posts.map((post) => post.repostsCount));

        if (user && user.uid) {
          const likedPosts = await Promise.all(
            posts.map(async (post) => ({
              postId: post.id,
              isLiked: await isPostLiked(post.id, user.uid),
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
  }, [user]);

  const formatNumber = (num: number) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();

  const getTimeAgo = (date: string | number | Date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - parsedDate.getTime()) / 3600000
    );
    return diffInHours < 24
      ? `${diffInHours}h`
      : `${Math.floor(diffInHours / 24)}d`;
  };

  return (
    <div className="flex flex-col w-full border border-border h-screen text-white bg-background-content">
      <div className="h-10" />
      {isLogin && <PostCond />}
      {postsWithUsers.map((post, index) => (
        <article
          key={post.id ?? `post-${index}`}
          className="border-b border-gray-400 p-4"
        >
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage
                src={post.user.profilePicture}
                alt={post.user.username}
              />
              <AvatarFallback>{post.user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">
                  · {getTimeAgo(post.createdAt)}
                </span>
              </div>
              <p className="mt-2 mb-3">{post.content}</p>
              {post.media && (
                <div className="rounded-xl overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={post.media}
                      alt="Post media"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-6 mt-4 text-gray-500">
                <button className="flex items-center gap-2 hover:text-red-500">
                  <Heart
                    className="w-5 h-5"
                    fill={likes.get(post.id) ? "red" : "none"}
                    onClick={() => handleLike(post.id)}
                  />
                  <span>{formatNumber(post.likesCount)}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{formatNumber(comments[index])}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-500">
                  <Repeat className="w-5 h-5" />
                  <span>{formatNumber(reposts[index])}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-violet-400">
                  <Share2 className="w-5 h-5" />
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
