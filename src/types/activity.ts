export type ActivityType = "reply" | "like" | "follow" | "share" | "suggestion";

export interface Activity {
  id: string;
  type: ActivityType;
  source: "user" | "system";
  actorId: string;
  targetUserId: string;
  postId?: string;
  commentId?: string;
  reason?: string;
  mutualFollowers?: number;
  createdAt: string; // ISO 8601 format (e.g. "2024-03-17T04:00:00.000Z")
  isRead: boolean;
}
