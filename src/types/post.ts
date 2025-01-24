import { Media } from "./media";

export interface Post {
  id: string;
  userId: string;
  content: string;
  media?: Media[];
  createdAt: string;
  stats: {
    likes: number;
    replies: number;
    reposts: number;
    views?: number; // Chỉ dùng cho video
  };
  isLiked?: boolean;
  isReposted?: boolean;
  replyTo?: {
    // Nếu post này là reply cho post khác
    postId: string;
    userId: string;
    username: string;
  };
  mentions?: string[]; // Danh sách userIds được tag
  hashtags?: string[]; // Danh sách hashtags
}

export interface PostWithUser extends Post {
  user: {
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
}
