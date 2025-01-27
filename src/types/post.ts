export interface Post {
  id: number;
  userId: number;
  content: string;
  media?: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isPinned: boolean;
  isSponsored: boolean;
  tags: string[];
}
