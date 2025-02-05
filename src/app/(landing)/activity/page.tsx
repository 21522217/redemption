"use client";

import { Separator } from "@/components/ui/separator";
import { useState, useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ActivityCard } from "@/components/ActivityCard";
import {
  getUserSuggestions,
  isFollowing,
} from "@/lib/firebase/apis/lam-user.server";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

/* Giữ lại code cũ để tham khảo
import activitiesData from "@/data/activities-data.json";
import postsData from "@/data/posts-data.json";
import usersData from "@/data/users-data.json";
import commentsData from "@/data/comments-data.json";

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
*/

interface FollowState {
  theyFollowMe: boolean; // Họ follow mình
  iFollowThem: boolean; // Mình follow họ
}

export default function Activity() {
  const { user: AuthUser } = useAuth();
  const [displayCount, setDisplayCount] = useState(5);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [followStatus, setFollowStatus] = useState<Record<string, FollowState>>(
    {}
  );

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!AuthUser) return;

      const users = await getUserSuggestions(AuthUser.uid);

      const filteredUsers = users.filter((user) => user.id !== AuthUser.uid);
      setSuggestions(filteredUsers);

      const status: Record<string, FollowState> = {};
      for (const user of filteredUsers) {
        const theyFollowMe = await isFollowing(user.id, AuthUser.uid);
        const iFollowThem = await isFollowing(AuthUser.uid, user.id);

        status[user.id] = {
          theyFollowMe,
          iFollowThem,
        };
      }
      setFollowStatus(status);
    };

    loadSuggestions();
  }, [AuthUser]);

  // Helper function để xác định text hiển thị
  const getFollowButtonText = (userId: string) => {
    const status = followStatus[userId];
    if (!status) return "Follow";

    if (status.iFollowThem) return "Following";
    if (status.theyFollowMe) return "Follow back";
    return "Follow";
  };

  const currentSuggestions = suggestions.slice(0, displayCount);

  const loadMore = useCallback(() => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 350);
  }, []);

  return (
    <div className="flex flex-col w-full h-screen bg-zinc-50 dark:bg-background-content overflow-scroll mt-6 rounded-2xl">
      <div className="flex flex-col w-full">
        <InfiniteScroll
          dataLength={currentSuggestions.length}
          next={loadMore}
          hasMore={currentSuggestions.length < suggestions.length}
          loader={
            <div className="space-y-4 p-4 border-b border-zinc-200 dark:border-zinc-400/15">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse flex flex-col gap-4 pb-4"
                  >
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-neutral-200/20" />
                      <div className="flex flex-col gap-1.5">
                        <div className="h-5 w-44 bg-zinc-200 dark:bg-neutral-200/20 rounded" />
                        <div className="h-4 w-32 bg-zinc-200 dark:bg-neutral-200/20 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          }
        >
          {currentSuggestions.map((user, index) => (
            <div
              key={user.id}
              className="border-b border-zinc-200 dark:border-zinc-400/15 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="p-4">
                <ActivityCard
                  actor={{
                    id: user.id,
                    displayName: user.firstName + " " + user.lastName,
                    avatar: user.profilePicture,
                    tagName:
                      user.firstName.toLowerCase() +
                      user.lastName.toLowerCase(),
                    bio: user.bio || "This is a test bio",
                  }}
                  type="suggestion"
                  timestamp="Suggested for you"
                  suggestion={{
                    reason: getFollowButtonText(user.id),
                    mutualFollowers: 0,
                  }}
                />
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}
