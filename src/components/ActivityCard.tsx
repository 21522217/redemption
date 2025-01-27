import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { Label } from "./ui/label";

interface ActivityCardProps {
  user: {
    displayName: string;
    avatar: string;
  };
  post: {
    content: string;
    isLiked: boolean;
    stats: {
      likes: number;
      replies: number;
      reposts: number;
    };
  };
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ user, post }) => {
  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.avatar} alt={user.displayName} />
        <AvatarFallback>
          {user.displayName
            .split(" ")
            .map((name) => name[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 flex-col py-2">
        <div className="flex flex-col gap-1">
          <Label className="font-bold">{user.displayName}</Label>
          <Label className="text-[15px] text-accent-foreground mb-3">
            Pick for you
          </Label>
        </div>

        <Label className="text-[15px] leading-normal mb-3">
          {post.content}
        </Label>

        <div className="flex items-center gap-3 mt-3">
          <Button variant="ghost" className="rounded-full px-3">
            <Heart
              className={`${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span className="text-sm">{post.stats.likes.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" className="rounded-full px-3">
            <MessageCircle className="h-[18px] w-[18px]" />
            <span className="text-sm">
              {post.stats.replies.toLocaleString()}
            </span>
          </Button>
          <Button variant="ghost" className="rounded-full px-3">
            <Repeat2 className="h-[18px] w-[18px]" />
            <span className="text-sm">
              {post.stats.reposts.toLocaleString()}
            </span>
          </Button>
          <Button variant="ghost" className="rounded-full px-3">
            <Share className="h-[18px] w-[18px]" />
          </Button>
        </div>
      </div>
    </div>
  );
};
