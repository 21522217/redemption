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
          text: "Đã theo dõi bạn",
          button: "Theo dõi lại",
        };
      case "suggestion":
        return {
          text: suggestion?.reason || "Gợi ý theo dõi",
          button: "Theo dõi",
        };
      case "like":
        return { text: "đã thích bài của bạn" };
      case "reply":
        return { text: "đã trả lời bài của bạn" };
      case "share":
        return { text: "đã chia sẻ bài của bạn" };
    }
  };

  const actionInfo = getActionAndButton();

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-12 w-12">
        <AvatarImage src={actor.avatar} alt={actor.displayName} />
        <AvatarFallback>
          {actor.displayName
            .split(" ")
            .map((name) => name[0])
            .join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 flex-col py-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Label className="font-bold">{actor.displayName}</Label>
            {(type === "follow" || type === "suggestion") && (
              <Button variant="outline" size="sm" className="rounded-full px-4">
                {actionInfo.button}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Label className="text-[15px] text-accent-foreground">
              {actionInfo.text}
              {suggestion && (
                <span className="text-sm text-muted-foreground ml-1">
                  · {suggestion.mutualFollowers} mutual followers
                </span>
              )}
            </Label>
            <span className="text-sm text-muted-foreground">· {timestamp}</span>
          </div>
        </div>

        {/* Hiển thị post gốc với style rất mờ */}
        {originalPost &&
          (type === "like" || type === "share" || type === "reply") && (
            <div className="mt-3 p-3 rounded-lg bg-muted/20">
              <Label className="text-[15px] leading-normal text-muted-foreground/40">
                {originalPost.content}
              </Label>
            </div>
          )}

        {/* Hiển thị reply với text đậm và đầy đủ tương tác */}
        {type === "reply" && reply && (
          <div className="mt-3 p-3 rounded-lg bg-muted">
            <Label className="text-[15px] leading-normal text-foreground">
              {reply.content}
            </Label>
            <div className="flex items-center gap-3 mt-3">
              <Button variant="ghost" size="sm" className="rounded-full px-3">
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {originalPost?.stats.likes || 0}
                </span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-3">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {originalPost?.stats.replies || 0}
                </span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-3">
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
