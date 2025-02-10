"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import {
  getUserSuggestions,
  isFollowing,
} from "@/lib/firebase/apis/lam-user.server";
import { useAuth } from "@/contexts/AuthContext";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { createFollow, deleteFollow } from "@/lib/firebase/apis/follow.server";
import { Loader2 } from "lucide-react";

interface FollowState {
  theyFollowMe: boolean;
  iFollowThem: boolean;
}

export default function Activity() {
  const { user: AuthUser } = useAuth();
  const [followStatus, setFollowStatus] = useState<Record<string, FollowState>>(
    {}
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    data: suggestionsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", "suggestions", AuthUser?.uid],
    queryFn: async ({ pageParam = 1 }) => {
      const suggestions = await getUserSuggestions(
        pageParam,
        AuthUser?.uid || ""
      );
      return {
        users: suggestions,
        nextPage: suggestions.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const suggestions = useMemo(() => {
    if (!suggestionsData) return [];
    return suggestionsData.pages
      .flatMap((page) => page.users)
      .filter((user) => user.id !== AuthUser?.uid);
  }, [suggestionsData, AuthUser?.uid]);

  useQuery({
    queryKey: ["followStatus", suggestions],
    queryFn: async () => {
      if (!AuthUser) return {};

      const status: Record<string, FollowState> = {};
      for (const user of suggestions) {
        const theyFollowMe = await isFollowing(user.id, AuthUser.uid);
        const iFollowThem = await isFollowing(AuthUser.uid, user.id);

        status[user.id] = {
          theyFollowMe,
          iFollowThem,
        };
      }
      setFollowStatus(status);
      return status;
    },
    enabled: !!AuthUser && suggestions.length > 0,
  });

  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!AuthUser) throw new Error("User not authenticated");
      await createFollow(AuthUser.uid, userId);
    },
    onSuccess: (data, variables) => {
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [variables]: {
          ...prevStatus[variables],
          iFollowThem: true,
        },
      }));
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!AuthUser) throw new Error("User not authenticated");
      await deleteFollow(AuthUser.uid, userId);
    },
    onSuccess: (data, variables) => {
      setFollowStatus((prevStatus) => ({
        ...prevStatus,
        [variables]: {
          ...prevStatus[variables],
          iFollowThem: false,
        },
      }));
    },
  });

  const getFollowButtonText = (userId: string) => {
    const status = followStatus[userId];
    if (!status) return "Follow";

    if (status.iFollowThem) return "Following";
    if (status.theyFollowMe) return "Follow back";
    return "Follow";
  };

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage]
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-background-content overflow-scroll mt-6 rounded-2xl">
      <div className="flex flex-col w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          suggestions.map((user, index) => (
            <article
              key={user.id}
              className="border-b border-zinc-200 dark:border-zinc-400/15 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              ref={index === suggestions.length - 1 ? lastElementRef : null}
            >
              <div className="p-4">
                <ActivityCard
                  actor={{
                    id: user.id,
                    avatar: user.profilePicture,
                    tagName: user.username,
                  }}
                  type="suggestion"
                  timestamp="Suggested for you"
                  suggestion={{
                    reason: getFollowButtonText(user.id),
                    mutualFollowers: 0,
                  }}
                  onFollow={() => followMutation.mutate(user.id)}
                  onUnfollow={() => unfollowMutation.mutate(user.id)}
                />
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
