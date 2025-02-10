"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share } from "lucide-react";
import { Label } from "./ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { checkIfFollowing } from "@/lib/firebase/apis/follow.server";

// Định nghĩa các type cho activities
interface ActivityCardProps {
  actor: {
    id: string;
    displayName: string;
    avatar: string;
    tagName?: string;
    bio?: string;
  };
  type: "like" | "reply" | "share" | "follow" | "suggestion";
  timestamp: string;
  originalPost?: {
    content: string;
    stats: {
      likes: number;
      replies: number;
      reposts: number;
    };
  };
  reply?: {
    content: string;
  };
  suggestion?: {
    reason: string;
    mutualFollowers: number;
  };
  onFollow?: (actorId: string) => void;
  onUnfollow?: (actorId: string) => void;
  followers?: number;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  actor,
  type,
  originalPost,
  reply,
  suggestion,
  onFollow,
  onUnfollow,
  followers,
}) => {
  const router = useRouter();
  const { user: AuthUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (AuthUser) {
        const following = await checkIfFollowing(AuthUser.uid, actor.id);
        setIsFollowing(following);
      }
    };
    fetchFollowStatus();
  }, [AuthUser, actor.id]);

  const handleProfileClick = () => {
    router.push(`/profile/${actor.id}`);
  };

  // Helper function để render action text và button text
  const getActionAndButton = () => {
    switch (type) {
      case "follow":
        return {
          text: "followed you",
          button: isFollowing ? "Following" : "Follow back",
        };
      case "suggestion":
        return {
          text: suggestion?.reason || "Suggested for you",
          button: isFollowing ? "Following" : "Follow",
        };
      case "like":
        return { text: "liked your post" };
      case "reply":
        return { text: "replied to your post" };
      case "share":
        return { text: "shared your post" };
    }
  };

  const actionInfo = getActionAndButton();

  return (
    <div
      className="flex gap-4 py-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      onClick={handleProfileClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={actor.avatar} alt={actor.displayName} />
        <AvatarFallback>
          {actor.displayName
            .split(" ")
            .map((name) => name[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 flex-col space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[15px] font-semibold">
                {actor.displayName}
              </Label>
              {actor.tagName && (
                <p className="text-sm text-muted-foreground">
                  @{actor.tagName}
                </p>
              )}
            </div>
            {(type === "follow" || type === "suggestion") && (
              <Button
                variant={
                  actionInfo.button === "Following" ? "outline" : "default"
                }
                size="sm"
                className={`rounded-[10px] font-semibold px-6 py-1.5 text-sm self-center cursor-pointer
                  ${
                    actionInfo.button === "Following"
                      ? "bg-transparent hover:bg-background border-[#999999] text-foreground"
                      : "bg-black text-white hover:bg-black/90 dark:bg-foreground dark:text-background"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFollowing) {
                    onUnfollow?.(actor.id);
                  } else {
                    onFollow?.(actor.id);
                  }
                  setIsFollowing(!isFollowing);
                }}
              >
                {actionInfo.button}
              </Button>
            )}
          </div>
        </div>

        {/* Bio section */}
        {actor.bio && (
          <div className="max-w-[500px]">
            <p className="text-[13px] leading-[1.6] text-zinc-600 dark:text-zinc-400">
              {actor.bio}
            </p>
          </div>
        )}

        {/* Mutual followers section */}
        {suggestion && (
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold">{followers || 0}</span>
            <span className="text-sm text-muted-foreground">followers</span>
          </div>

        )}

        {/* Original post with faded style */}
        {originalPost &&
          (type === "like" || type === "share" || type === "reply") && (
            <div className="mt-2 p-3 rounded-lg bg-muted/10">
              <Label className="text-[15px] leading-normal text-[#999999]">
                {originalPost.content}
              </Label>
            </div>
          )}

        {/* Reply with full interaction buttons */}
        {type === "reply" && reply && (
          <div className="mt-2 p-3 rounded-lg bg-muted/5">
            <Label className="text-[15px] leading-normal">
              {reply.content}
            </Label>
            <div className="flex items-center gap-3 mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-3 h-8"
              >
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {originalPost?.stats.likes || 0}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-3 h-8"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {originalPost?.stats.replies || 0}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-3 h-8"
              >
                <Share className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {originalPost?.stats.reposts || 0}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
