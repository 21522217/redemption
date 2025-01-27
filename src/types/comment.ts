export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  replyTo?: string;
  createdAt: string;
  likes: number;
}