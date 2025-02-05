import { Timestamp } from "firebase/firestore";

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}
