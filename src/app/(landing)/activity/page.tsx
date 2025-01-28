"use client";

import { Separator } from "@/components/ui/separator";
import { useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import activitiesData from "@/data/activities-data.json";
import postsData from "@/data/posts-data.json";
import usersData from "@/data/users-data.json";
import commentsData from "@/data/comments-data.json";
import { ActivityCard } from "@/components/ActivityCard";

export default function Activity() {
  const [displayCount, setDisplayCount] = useState(5);
  const activities = activitiesData.activities;
  const currentActivities = activities.slice(0, displayCount);

  // Helper function để lấy thông tin post gốc
  const getOriginalPost = (postId: string) => {
    const post = postsData.posts.find((p) => p.id === postId);
    if (!post) return undefined;
    return {
      content: post.content,
      stats: {
        likes: post.stats.likes,
        replies: post.stats.replies,
        reposts: post.stats.reposts,
      },
    };
  };

  // Helper function để lấy thông tin reply
  const getReply = (commentId: string) => {
    const comment = commentsData.comments.find((c) => c.id === commentId);
    if (!comment) return undefined;
    return {
      content: comment.content,
    };
  };

  const loadMore = useCallback(() => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 350);
  }, []);

  return (
    <div className="min-h-screen px-4">
      <div className="p-4 shadow bg-card rounded-3xl">
        <InfiniteScroll
          dataLength={currentActivities.length}
          next={loadMore}
          hasMore={currentActivities.length < activities.length}
          loader={
            <div className="space-y-4 py-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex flex-col gap-4 pb-4"
                  >
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-neutral-200" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-5 w-44 bg-neutral-200 rounded" />
                        <div className="h-4 w-32 bg-neutral-200 rounded" />
                      </div>
                    </div>
                    <div className="h-24 w-full bg-neutral-200 rounded" />
                    <div className="flex gap-4">
                      <div className="h-8 w-16 bg-neutral-200 rounded" />
                      <div className="h-8 w-16 bg-neutral-200 rounded" />
                      <div className="h-8 w-16 bg-neutral-200 rounded" />
                      <div className="h-8 w-8 bg-neutral-200 rounded" />
                    </div>
                  </div>
                ))}
            </div>
          }
        >
          {currentActivities.map((activity, index) => {
            const actor = usersData.users.find(
              (u) => u.id === activity.actorId
            )!;
            const originalPost = activity.postId
              ? getOriginalPost(activity.postId)
              : undefined;
            const reply = activity.commentId
              ? getReply(activity.commentId)
              : undefined;
            const suggestion =
              activity.type === "suggestion"
                ? {
                    reason: activity.reason || "Gợi ý theo dõi",
                    mutualFollowers: activity.mutualFollowers || 0,
                  }
                : undefined;

            return (
              <div
                key={`${activity.type}-${activity.actorId}-${
                  activity.postId || ""
                }`}
              >
                <ActivityCard
                  actor={actor}
                  type={activity.type as any}
                  timestamp="1 ngày trước"
                  originalPost={originalPost}
                  reply={reply}
                  suggestion={suggestion}
                />
                {index < currentActivities.length - 1 && (
                  <Separator className="bg-neutral-200" />
                )}
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}
