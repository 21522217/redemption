"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { User } from "@/types/user";
import userData from "@/data/users-data.json";
import InfiniteScroll from "react-infinite-scroll-component";

export default function SearchPage() {
  // State for displayed users count and search query
  const [displayCount, setDisplayCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  // Load more data function
  const loadMore = () => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 500);
  };

  // Filter users based on search query
  const filteredUsers = userData.users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current users to display
  const currentUsers = filteredUsers.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4">
        {/* Search Header */}
        <div className="flex items-center justify-between py-3">
          <h1 className="text-xl font-semibold text-neutral-950">Search</h1>
          <button className="rounded-full p-2 hover:bg-neutral-100">
            <span className="text-2xl">⋯</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-neutral-200">
          {/* Search Input */}
          <div className="relative mb-6">
            <div className="relative rounded-2xl border border-neutral-300 bg-neutral-100">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 border-0 bg-transparent pl-10 pr-10 text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <SlidersHorizontal className="h-5 w-5 text-neutral-500" />
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-neutral-500">
              Suggested follows
            </div>

            {/* User List with Infinite Scroll */}
            <InfiniteScroll
              dataLength={currentUsers.length}
              next={loadMore}
              hasMore={currentUsers.length < filteredUsers.length}
              loader={
                <div className="text-center py-4 text-sm text-neutral-500">
                  Loading...
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              <div className="space-y-4">
                {currentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start justify-between border-b border-neutral-300 pb-4 last:border-0"
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback>
                          {user.displayName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-neutral-950">
                            {user.displayName}
                          </span>
                          {user.isVerified && (
                            <span className="text-xs font-medium text-blue-500">
                              verified
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-normal text-neutral-400">
                          @{user.username}
                        </span>
                        <span className="text-sm font-normal text-neutral-600">
                          {user.bio}
                        </span>
                        <span className="text-sm font-normal text-neutral-400">
                          {user.followers >= 1000
                            ? `${(user.followers / 1000).toFixed(1)}K`
                            : user.followers.toLocaleString()}{" "}
                          followers
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="h-8 rounded-full border-neutral-200 text-sm font-medium text-neutral-950 hover:bg-neutral-100"
                    >
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
