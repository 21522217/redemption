"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui-thread/avatar";
import { Button } from "@/components/ui-thread/button";
import { Input } from "@/components/ui-thread/input";
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import userData from "@/data/users-data.json";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui-thread/dropdown-menu";
import { Card, CardHeader, CardContent } from "@/components/ui-thread/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui-thread/sheet";
import { Separator } from "@/components/ui-thread/separator";

// Thêm component Verified Badge - giống như trang chủ
const VerifiedBadge = () => (
  <svg
    aria-label="Verified"
    className="h-4 w-4 text-blue-500"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12.01 1.49c-5.8 0-10.5 4.7-10.5 10.5s4.7 10.5 10.5 10.5 10.5-4.7 10.5-10.5-4.7-10.5-10.5-10.5zm-1.73 15.2L6.8 13.2l1.4-1.4 2.07 2.08 5.52-5.52 1.4 1.4-6.9 6.92z" />
  </svg>
);

export default function SearchPage() {
  // States for search functionality
  const [displayCount, setDisplayCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(userData.users);

  // Debounce search query
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Giảm từ 500ms xuống 300ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter users when debounced query changes
  useEffect(() => {
    const filterUsers = () => {
      const filtered = userData.users.filter(
        (user) =>
          user.displayName
            .toLowerCase()
            .includes(debouncedQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          user.bio.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
      setIsSearching(false);
    };

    // Giảm delay API từ 300ms xuống 200ms
    setTimeout(filterUsers, 200);
  }, [debouncedQuery]);

  // Load more function với delay
  const loadMore = () => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 350); // Thêm delay 200ms khi load more
  };

  // Get current users to display
  const currentUsers = filteredUsers.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl min-w-[680px] px-4">
        {/* Search Header - Centered with dots */}
        <div className="relative flex items-center justify-center py-3">
          <h1 className="text-[28px] font-normal text-neutral-950">Search</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="absolute right-0 rounded-full p-2 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-neutral-200"
              >
                <svg
                  width="20"
                  height="4"
                  viewBox="0 0 20 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="3" cy="2" r="2" fill="black" />
                  <circle cx="10" cy="2" r="2" fill="black" />
                  <circle cx="17" cy="2" r="2" fill="black" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Cài đặt tìm kiếm</DropdownMenuItem>
              <DropdownMenuItem>Lịch sử tìm kiếm</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content Card */}
        <Card className="p-4">
          <CardHeader className="p-0">
            {/* Search Input */}
            <div className="relative mb-6">
              <div className="relative rounded-2xl border border-neutral-200 bg-neutral-50">
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
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute inset-y-0 right-3"
                    >
                      <SlidersHorizontal className="h-5 w-5 text-neutral-500" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                      <SheetDescription>
                        Tùy chỉnh kết quả tìm kiếm
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Search Results */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-neutral-500">
                {isSearching
                  ? "Searching..."
                  : searchQuery
                  ? ""
                  : "Suggested follows"}
              </div>

              {isSearching ? (
                // Loading skeleton - 10 items khi search
                Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse flex items-start justify-between border-b border-neutral-300 pb-4 last:border-0"
                    >
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-neutral-200" />
                        <div className="flex flex-col gap-1.5">
                          <div className="h-5 w-44 bg-neutral-200 rounded" />
                          <div className="h-4 w-32 bg-neutral-200 rounded" />
                          <div className="h-4 w-[360px] bg-neutral-200 rounded" />
                          <div className="h-4 w-28 bg-neutral-200 rounded" />
                        </div>
                      </div>
                      <div className="h-9 w-[104px] bg-neutral-200 rounded-xl" />
                    </div>
                  ))
              ) : (
                // Actual user list
                <InfiniteScroll
                  dataLength={currentUsers.length}
                  next={loadMore}
                  hasMore={currentUsers.length < filteredUsers.length}
                  loader={
                    // Loading skeleton - 5 items khi scroll
                    <div className="space-y-4 py-4">
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="animate-pulse flex items-start justify-between border-b border-neutral-300 pb-4 last:border-0"
                          >
                            <div className="flex gap-3">
                              <div className="h-10 w-10 rounded-full bg-neutral-200" />
                              <div className="flex flex-col gap-1.5">
                                <div className="h-5 w-44 bg-neutral-200 rounded" />
                                <div className="h-4 w-32 bg-neutral-200 rounded" />
                                <div className="h-4 w-[360px] bg-neutral-200 rounded" />
                                <div className="h-4 w-28 bg-neutral-200 rounded" />
                              </div>
                            </div>
                            <div className="h-9 w-[104px] bg-neutral-200 rounded-xl" />
                          </div>
                        ))}
                    </div>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  <div className="space-y-0">
                    {currentUsers.map((user, index) => (
                      <div key={user.id}>
                        <div className="flex items-start justify-between py-4">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={user.avatar}
                                alt={user.displayName}
                              />
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
                                {user.isVerified && <VerifiedBadge />}
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
                            className="h-9 px-8 rounded-xl border-neutral-200 text-sm font-medium text-neutral-950 hover:bg-neutral-100"
                          >
                            Follow
                          </Button>
                        </div>
                        {index < currentUsers.length - 1 && (
                          <Separator className="bg-neutral-200" />
                        )}
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
