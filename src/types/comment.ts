export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  replyTo?: string; // ID của comment mà comment này trả lời
  createdAt: string;
  likes: number;
}

export interface CommentWithUser extends Comment {
  user: {
    username: string;
    displayName: string;
    avatar: string;
    isVerified: boolean;
  };
}
