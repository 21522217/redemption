export interface Post {
  id?: string;
  userId: string;
  type: "text" | "image" | "video" | "audio" | "poll";
  content: string;
  media?: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isPinned: boolean;
  tags?: string[];
  locationName?: string;
  poll?: {
    question: string;
    options: string[];
    endsAt: Date;
  };
  isSensitive?: boolean;
}

export interface LikedPost {
  userId: string;
  postId: string;
  createdAt: Date;
  isLiked: boolean;
}
