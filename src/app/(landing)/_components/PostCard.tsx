"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BadgeCheck, Heart, MessageCircle, Repeat, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostDropdown from "./PostDropdown";
import { Post } from "@/types/post";
import { User } from "@/types/user";
import { formatNumber, getTimeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { isPostLiked, toggleLikePost } from "@/lib/firebase/apis/posts.server";
import { toggleRepost, isReposted } from "@/lib/firebase/apis/repost.server";
import { useAuth } from "@/contexts/AuthContext";

interface PostCardProps {
  user: User;
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ user, post }) => {
  const router = useRouter();
  const { user: AuthUser } = useAuth();

  const [likes, setLikes] = useState(new Map<string, boolean>());
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [reposts, setReposts] = useState(new Map<string, boolean>());
  const [repostsCount, setRepostsCount] = useState(post.repostsCount);

  useEffect(() => {
    const fetchLikesAndReposts = async () => {
      if (AuthUser) {
        const isLiked = await isPostLiked(post.id, AuthUser.uid);
        const isRepostedStatus = await isReposted(post.id, AuthUser.uid);
        setLikes(new Map([[post.id, isLiked]]));
        setReposts(new Map([[post.id, isRepostedStatus]]));
      }
    };
    fetchLikesAndReposts();
  }, [AuthUser, post.id]);

  const handleLike = async (postId: string) => {
    if (!AuthUser) return;
    try {
      setLikesCount((prevCount) =>
        likes.get(postId) ? prevCount - 1 : prevCount + 1
      );
      setLikes((prevLikes) => {
        const updatedLikes = new Map(prevLikes);
        updatedLikes.set(postId, !updatedLikes.get(postId));
        return updatedLikes;
      });
      await toggleLikePost(postId, AuthUser.uid);
    } catch (error) {
      console.error("Failed to toggle like status:", error);
      setLikesCount((prevCount) =>
        likes.get(postId) ? prevCount + 1 : prevCount - 1
      );
    }
  };

  const handleComment = (postId: string) => {
    console.log("Commenting on post:", postId);
    router.push(`/posts/${postId}`);
  };

  const handleRepost = async (postId: string) => {
    if (!AuthUser) return;
    try {
      setRepostsCount((prevCount) =>
        reposts.get(postId) ? prevCount - 1 : prevCount + 1
      );
      setReposts((prevReposts) => {
        const updatedReposts = new Map(prevReposts);
        updatedReposts.set(postId, !updatedReposts.get(postId));
        return updatedReposts;
      });
      await toggleRepost(postId, AuthUser.uid);
    } catch (error) {
      console.error("Failed to toggle repost status:", error);
      setRepostsCount((prevCount) =>
        reposts.get(postId) ? prevCount + 1 : prevCount - 1
      );
    }
  };

  return (
    <div className="flex items-start">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between flex-wrap flex-row">
          <div className="flex items-center gap-2 flex-wrap flex-row">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.profilePicture} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-bold hover:underline">{user.username}</span>
            {user.isVerified && (
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-500">{getTimeAgo(post.createdAt)}</span>
          </div>
          {AuthUser?.uid !== user.id && <PostDropdown post={post} />}
        </div>
        <p className="mt-1 break-words whitespace-pre-wrap">{post.content}</p>
        {post.media && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800">
            <div className="relative w-full h-auto">
              {post.media.endsWith(".mp4") ? (
                <video
                  src={post.media}
                  controls
                  className="object-cover w-full h-auto"
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
        <div className="flex items-center justify-between mt-3 w-fit space-x-4 text-zinc-500">
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
            <span>{formatNumber(likesCount)}</span>
          </button>
          <button
            className="flex items-center gap-2 group"
            onClick={() => handleComment(post.id)}
          >
            <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 text-blue-500">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span>{formatNumber(post.commentsCount)}</span>
          </button>
          {AuthUser?.uid !== user.id && (
            <button
              className="flex items-center gap-2 group"
              onClick={() => handleRepost(post.id)}
            >
              <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 text-green-500">
                <Repeat
                  className="w-5 h-5"
                  fill={reposts.get(post.id) ? "currentColor" : "none"}
                />
              </div>
              <span>{formatNumber(repostsCount)}</span>
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
  );
};

export default PostCard;
