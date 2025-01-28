import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat2, Share, UserPlus } from "lucide-react";
import { Label } from "./ui/label";

// Định nghĩa các type cho activities
interface ActivityCardProps {
  actor: {
    id: string;
    displayName: string;
    avatar: string;
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
}

// Thay đổi cách format số để đảm bảo nhất quán giữa server và client
const formatNumber = (num: number) => {
  // Sử dụng en-US locale để đảm bảo format nhất quán
  return num.toLocaleString("en-US");
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  actor,
  type,
  timestamp,
  originalPost,
  reply,
  suggestion,
}) => {
  // Helper function để render action text và button text
  const getActionAndButton = () => {
    switch (type) {
      case "follow":
        return {
          text: "followed you",
          button: "Follow back",
        };
      case "suggestion":
        return {
          text: suggestion?.reason || "Suggested for you",
          button: "Follow",
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
    <div className="flex gap-4 py-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={actor.avatar} alt={actor.displayName} />
        <AvatarFallback>
          {actor.displayName
            .split(" ")
            .map((name) => name[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 flex-col">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Label className="font-semibold text-[15px]">
                {actor.displayName}
              </Label>
              <span className="text-sm text-[#999999]">· {timestamp}</span>
            </div>
            {(type === "follow" || type === "suggestion") && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-4 h-8"
              >
                {actionInfo.button}
              </Button>
            )}
          </div>
          <Label className="text-[15px] text-[#999999] mt-0.5">
            {actionInfo.text}
            {suggestion && (
              <span className="text-sm text-[#999999] ml-1">
                · {suggestion.mutualFollowers} mutual followers
              </span>
            )}
          </Label>
        </div>

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
