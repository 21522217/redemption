import { Timestamp } from "firebase/firestore";

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
