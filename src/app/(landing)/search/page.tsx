"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ActivityCard } from "@/components/ActivityCard";
import {
  searchUsers,
  getAllUserSuggestions,
} from "@/lib/firebase/apis/lam-user.server";
import { User } from "@/types/user";
import { Search, Loader2 } from "lucide-react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { createFollow, deleteFollow } from "@/lib/firebase/apis/follow.server";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

interface FollowState {
  theyFollowMe: boolean;
  iFollowThem: boolean;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [followStatus, setFollowStatus] = useState<Record<string, FollowState>>(
    {}
  );
  const { user: AuthUser } = useAuth();
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data: searchResults,
    isFetching: isFetchingSearch,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
  } = useInfiniteQuery({
    queryKey: ["users", "search", searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const searchedUsers = await searchUsers(pageParam, searchTerm);
      return {
        users: searchedUsers,
        nextPage: searchedUsers.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const {
    data: suggestionsData,
    isFetching: isFetchingSuggestions,
    fetchNextPage: fetchNextSuggestionsPage,
    hasNextPage: hasNextSuggestionsPage,
  } = useInfiniteQuery({
    queryKey: ["users", "suggestions"],
    queryFn: async ({ pageParam = 1 }) => {
      const allUserSuggestions = await getAllUserSuggestions(
        pageParam,
        AuthUser?.uid
      );
      return {
        users: allUserSuggestions,
        nextPage: allUserSuggestions.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const suggestions = useMemo(() => {
    if (!suggestionsData) return [];
    return suggestionsData.pages
      .flatMap((page) => page.users)
      .sort(() => 0.5 - Math.random());
  }, [suggestionsData]);

  useEffect(() => {
    const checkFollowStatus = async (users: User[]) => {
      const status: Record<string, FollowState> = {};
      users.forEach((user) => {
        status[user.id] = {
          theyFollowMe: false,
          iFollowThem: false,
        };
      });
      setFollowStatus(status);
    };

    const currentUsers = searchTerm
      ? searchResults?.pages.flatMap((page) => page.users)
      : suggestions;

    if (currentUsers) {
      checkFollowStatus(currentUsers);
    }
  }, [searchResults, suggestions, searchTerm]);

  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingSearch || isFetchingSuggestions) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (searchTerm.trim() && hasNextSearchPage) {
            fetchNextSearchPage();
          } else if (!searchTerm.trim() && hasNextSuggestionsPage) {
            fetchNextSuggestionsPage();
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingSearch, isFetchingSuggestions, hasNextSearchPage, hasNextSuggestionsPage, fetchNextSearchPage, fetchNextSuggestionsPage, searchTerm]
  );

  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!AuthUser) throw new Error("User not authenticated");
      await createFollow(AuthUser.uid, userId);
    },
    onSuccess: () => {
      toast.success("Followed user successfully");
    },
    onError: (error: any) => {
      console.error("Failed to follow user:", error);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!AuthUser) throw new Error("User not authenticated");
      await deleteFollow(AuthUser.uid, userId);
    },
    onSuccess: () => {
      toast.dismiss("Unfollowed user successfully");
    },
  });

  const handleFollow = (userId: string) => {
    setFollowStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: {
        ...prevStatus[userId],
        iFollowThem: true,
      },
    }));
    followMutation.mutate(userId);
  };

  const handleUnfollow = (userId: string) => {
    setFollowStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: {
        ...prevStatus[userId],
        iFollowThem: false,
      },
    }));
    unfollowMutation.mutate(userId);
  };

  const getFollowButtonText = (userId: string) => {
    const status = followStatus[userId];
    if (!status) return "Follow";
    if (status.iFollowThem) return "Following";
    if (status.theyFollowMe) return "Follow back";
    return "Follow";
  };

  const currentUsers = searchTerm.trim()
    ? searchResults?.pages.flatMap((page) => page.users) || []
    : suggestions || [];

  const isLoading = isFetchingSearch || isFetchingSuggestions;

  return (
    <div className="flex flex-col w-full h-screen bg-zinc-50 dark:bg-background-content overflow-scroll mt-6 rounded-2xl">
      <div className="sticky top-0 bg-zinc-50 dark:bg-background-content p-4 border-b border-zinc-200 dark:border-zinc-400/15">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {searchTerm.trim() ? (
              currentUsers.length ? (
                <div>
                  {currentUsers.map((user, index) => (
                    <div
                      key={user.id}
                      className="border-b border-zinc-200 dark:border-zinc-400/15 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      ref={index === currentUsers.length - 1 ? lastUserElementRef : null}
                    >
                      <div className="p-4">
                        <ActivityCard
                          actor={{
                            id: user.id,
                            displayName: user.firstName + " " + user.lastName,
                            avatar: user.profilePicture,
                            tagName: user.username,
                            bio: user.bio || "This is a test bio",
                          }}
                          type="suggestion"
                          timestamp="Search result"
                          suggestion={{
                            reason: getFollowButtonText(user.id),
                            mutualFollowers: 0,
                          }}
                          followers={user.followers}
                          onFollow={() => handleFollow(user.id)}
                          onUnfollow={() => handleUnfollow(user.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center py-8 text-gray-500">
                  No users found
                </div>
              )
            ) : (
              <div>
                <h3 className="px-4 py-2 text-sm font-medium text-gray-500">
                  Suggested for you
                </h3>
                {currentUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="border-b border-zinc-200 dark:border-zinc-400/15 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    ref={index === currentUsers.length - 1 ? lastUserElementRef : null}
                  >
                    <div className="p-4">
                      <ActivityCard
                        actor={{
                          id: user.id,
                          displayName: user.firstName + " " + user.lastName,
                          avatar: user.profilePicture,
                          tagName: user.username,
                          bio: user.bio || "This is a test bio",
                        }}
                        type="suggestion"
                        timestamp="Suggested for you"
                        suggestion={{
                          reason: getFollowButtonText(user.id),
                          mutualFollowers: 0,
                        }}
                        followers={user.followers}
                        onFollow={() => handleFollow(user.id)}
                        onUnfollow={() => handleUnfollow(user.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
