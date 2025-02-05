"use client";

import { useState, useCallback, useEffect } from "react";
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

// Hook useDebounce được đặt trong cùng file
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface FollowState {
  theyFollowMe: boolean; // Họ follow mình
  iFollowThem: boolean; // Mình follow họ
}

export default function SearchPage() {
  const { user: AuthUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [randomUsers, setRandomUsers] = useState<User[]>([]);
  const [followStatus, setFollowStatus] = useState<Record<string, FollowState>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Load random users khi component mount
  useEffect(() => {
    const loadRandomUsers = async () => {
      if (!AuthUser) return;
      const suggestions = await getUserSuggestions(AuthUser.uid);
      const shuffled = suggestions.sort(() => 0.5 - Math.random());
      setRandomUsers(shuffled);
      setDisplayCount(5);
    };

    loadRandomUsers();
  }, [AuthUser]);

  const loadMore = useCallback(() => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 350);
  }, []);

  // Helper function để xác định text hiển thị
  const getFollowButtonText = (userId: string) => {
    const status = followStatus[userId];
    if (!status) return "Follow";

    if (status.iFollowThem) return "Following";
    if (status.theyFollowMe) return "Follow back";
    return "Follow";
  };

  const performSearch = useCallback(async () => {
    if (!AuthUser) return;

    // Reset users nếu search term trống
    if (!debouncedSearchTerm.trim()) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchUsers(
        debouncedSearchTerm,
        AuthUser.uid
      );
      setUsers(searchResults);
      setDisplayCount(5); // Reset display count khi search mới

      // Kiểm tra trạng thái follow cho mỗi user
      const status: Record<string, FollowState> = {};
      for (const user of searchResults) {
        const theyFollowMe = await isFollowing(user.id, AuthUser.uid);
        const iFollowThem = await isFollowing(AuthUser.uid, user.id);

        status[user.id] = {
          theyFollowMe,
          iFollowThem,
        };
      }
      setFollowStatus(status);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, AuthUser]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const currentUsers = debouncedSearchTerm.trim()
    ? users.slice(0, displayCount)
    : randomUsers.slice(0, displayCount);

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
              users.length > 0 ? (
                <InfiniteScroll
                  dataLength={currentUsers.length}
                  next={loadMore}
                  hasMore={currentUsers.length < users.length}
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
                hasMore={currentUsers.length < randomUsers.length}
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
