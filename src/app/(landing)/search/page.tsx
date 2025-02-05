"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { ActivityCard } from "@/components/ActivityCard";
import { searchUsers, isFollowing } from "@/lib/firebase/apis/lam-user.server";
import { User } from "@/types/user";
import { Search } from "lucide-react";

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
  const [followStatus, setFollowStatus] = useState<Record<string, FollowState>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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
          <div className="space-y-4 p-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="animate-pulse flex gap-4 pb-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-neutral-200/20" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-200 dark:bg-neutral-200/20 rounded w-3/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-neutral-200/20 rounded w-1/2" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          users.map((user) => (
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
          ))
        )}
      </div>
    </div>
  );
}
