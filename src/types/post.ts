import { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  userId: string;
  type: "text" | "image" | "video" | "audio" | "poll";
  content: string;
  media?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isPinned: boolean;
  tags?: string[];
  locationName?: string;
  poll?: {
    question: string;
    options: string[];
    endsAt: Timestamp;
  };
  isSensitive?: boolean;
}

export interface LikedPost {
  userId: string;
  postId: string;
  createdAt: Timestamp;
  isLiked: boolean;
}
