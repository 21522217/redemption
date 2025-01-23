"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui-thread/avatar";
import { Button } from "@/components/ui-thread/button";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useState } from "react";
import { VerifiedBadgeSVG } from "public";

interface PostViewProps {
  user: {
    avatar: string;
    displayName: string;
    isVerified: boolean;
  };
  post: {
    content: string;
    stats: {
      likes: number;
      replies: number;
      reposts: number;
    };
    isLiked: boolean;
  };
}

const PostView: React.FC<PostViewProps> = ({ user, post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="py-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.displayName} />
          <AvatarFallback>
            {user.displayName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="font-bold text-neutral-950">
              {user.displayName}
            </span>
            {user.isVerified && <VerifiedBadgeSVG />}
          </div>
          <p className="text-[15px] leading-normal mb-3">{post.content}</p>
          <div className="flex items-center gap-6 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-0 hover:text-red-500"
              onClick={toggleLike}
            >
              <Heart
                className={`h-[18px] w-[18px] ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="ml-1 text-sm">
                {post.stats.likes.toLocaleString()}
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-0">
              <MessageCircle className="h-[18px] w-[18px]" />
              <span className="ml-1 text-sm">
                {post.stats.replies.toLocaleString()}
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-0">
              <Repeat2 className="h-[18px] w-[18px]" />
              <span className="ml-1 text-sm">
                {post.stats.reposts.toLocaleString()}
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-0">
              <Share className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView;
