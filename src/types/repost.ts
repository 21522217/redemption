import { Timestamp } from "firebase/firestore";

export interface Repost {
  id: string;
  userId: string;
  originalPostId: string;
  createdAt: Timestamp;
}
