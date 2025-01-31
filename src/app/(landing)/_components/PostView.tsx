"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PostCond from "./PostCond";
import { fetchPostsWithUsers } from "@/lib/firebase/apis/posts.server";
import type { Post } from "@/types/post";
import type { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Heart, Repeat, Share2 } from "lucide-react";
import Image from "next/image";

const PostView = () => {
  const { isLogin } = useAuth();
  const [postsWithUsers, setPostsWithUsers] = useState<
    Array<Post & { user: User }>
  >([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await fetchPostsWithUsers();
        setPostsWithUsers(posts);
      } catch (error) {
        console.error("Failed to fetch posts with users:", error);
      }
    };
    fetchPosts();
  }, []);

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
    <div className="flex flex-col w-full border border-border min-h-screen text-white">
      <div className="h-10" />
      {isLogin && <PostCond />}

      {postsWithUsers.map((post) => (
        <article key={post.id} className="border-b border-gray-800 p-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage
                src={post.user.profilePicture || "/placeholder.svg"}
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

              {post.type === "image" && post.media && (
                <div className="grid grid-cols-3 gap-0.5 rounded-xl overflow-hidden">
                  {[post.media].map((img, i) => (
                    <div key={`${post.id}`} className="aspect-square relative">
                      <Image
                        src={img}
                        alt="Post media"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 mt-4 text-gray-500">
                <button className="flex items-center gap-2 hover:text-red-500">
                  <Heart className="w-5 h-5" />
                  <span>{formatNumber(post.likesCount)}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500">
                  <MessageCircle className="w-5 h-5" />
                  <span>{formatNumber(post.commentsCount)}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-green-500">
                  <Repeat className="w-5 h-5" />
                  <span>{formatNumber(post.repostsCount)}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500">
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
