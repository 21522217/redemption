"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { ActivityCard } from "@/components/ActivityCard";
import {
  searchUsers,
  isFollowing,
  getUserSuggestions,
} from "@/lib/firebase/apis/lam-user.server";
import { User } from "@/types/user";
import { Search, Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@tanstack/react-query";
import { createFollow, deleteFollow } from "@/lib/firebase/apis/follow.server";
import { useDebounce } from "@/lib/utils";
// Hook useDebounce được đặt trong cùng file

interface FollowState {
  theyFollowMe: boolean; // Họ follow mình
  iFollowThem: boolean; // Mình follow họ
}

export default function SearchPage() {
  const { user: AuthUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [followStatus, setFollowStatus] = useState<Record<string, FollowState>>(
    {}
  );
  const [displayCount, setDisplayCount] = useState(5);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Query cho tìm kiếm users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["users", "search", debouncedSearchTerm],
    queryFn: () => searchUsers(debouncedSearchTerm, AuthUser?.uid),
  });

  // Query cho user suggestions
  const { data: suggestionsData, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ["users", "suggestions", AuthUser?.uid],
    queryFn: () => getUserSuggestions(AuthUser?.uid),
  });

  // Tách riêng phần random suggestions ra
  const suggestions = useMemo(() => {
    if (!suggestionsData) return [];
    return [...suggestionsData].sort(() => 0.5 - Math.random());
  }, [suggestionsData]);

  // Kiểm tra follow status chỉ khi có AuthUser
  useEffect(() => {
    const checkFollowStatus = async (users: User[]) => {
      if (!AuthUser) {
        // Nếu không có AuthUser, set tất cả status về false
        const status: Record<string, FollowState> = {};
        users.forEach((user) => {
          status[user.id] = {
            theyFollowMe: false,
            iFollowThem: false,
          };
        });
        setFollowStatus(status);
        return;
      }

      const status: Record<string, FollowState> = {};
      for (const user of users) {
        const theyFollowMe = await isFollowing(user.id, AuthUser.uid);
        const iFollowThem = await isFollowing(AuthUser.uid, user.id);

        status[user.id] = {
          theyFollowMe,
          iFollowThem,
        };
      }
      setFollowStatus(status);
    };

    const currentUsers = debouncedSearchTerm ? searchResults : suggestions;

    if (currentUsers) {
      checkFollowStatus(currentUsers);
    }
  }, [AuthUser, searchResults, suggestions, debouncedSearchTerm]);

  const loadMore = useCallback(() => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 350);
  }, []);

  const getFollowButtonText = (userId: string) => {
    if (!AuthUser) return "Sign in to follow"; // Thêm text cho user chưa đăng nhập

    const status = followStatus[userId];
    if (!status) return "Follow";
    if (status.iFollowThem) return "Following";
    if (status.theyFollowMe) return "Follow back";
    return "Follow";
  };

  const currentUsers = debouncedSearchTerm.trim()
    ? (searchResults || []).slice(0, displayCount)
    : (suggestions || []).slice(0, displayCount);

  const isLoading = isSearching || isLoadingSuggestions;

  return (
    <div className="flex flex-col w-full h-screen bg-zinc-50 dark:bg-background-content overflow-scroll mt-6 rounded-2xl">
      <div className="sticky top-0 z-10 bg-zinc-50 dark:bg-background-content p-4 border-b border-zinc-200 dark:border-zinc-400/15">
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
            {debouncedSearchTerm.trim() ? (
              searchResults?.length ? (
                <InfiniteScroll
                  dataLength={currentUsers.length}
                  next={loadMore}
                  hasMore={currentUsers.length < (searchResults?.length || 0)}
                  loader={
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                  }
                >
                  {currentUsers.map((user) => (
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
                            tagName: user.username,
                            bio: user.bio || "This is a test bio",
                          }}
                          type="suggestion"
                          timestamp="Search result"
                          suggestion={{
                            reason: getFollowButtonText(user.id),
                            mutualFollowers: 0,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              ) : (
                <div className="flex justify-center items-center py-8 text-gray-500">
                  No users found
                </div>
              )
            ) : (
              <InfiniteScroll
                dataLength={currentUsers.length}
                next={loadMore}
                hasMore={currentUsers.length < (suggestions?.length || 0)}
                loader={
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                }
              >
                <h3 className="px-4 py-2 text-sm font-medium text-gray-500">
                  Suggested for you
                </h3>
                {currentUsers.map((user) => (
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
                          tagName: user.username,
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
