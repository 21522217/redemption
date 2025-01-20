"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui-thread/avatar";
import { Button } from "@/components/ui-thread/button";
import { Card, CardContent, CardHeader } from "@/components/ui-thread/card";
import { Separator } from "@/components/ui-thread/separator";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import postsData from "@/data/posts-data.json";
import usersData from "@/data/users-data.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui-thread/dropdown-menu";

// Verified Badge component giống search page
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

export default function Page() {
  const [displayCount, setDisplayCount] = useState(5);
  const posts = postsData.posts;
  const currentPosts = posts.slice(0, displayCount);

  const loadMore = () => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl min-w-[680px] px-4">
        {/* Header giống search page */}
        <div className="relative flex items-center justify-center py-3">
          <h1 className="text-[28px] font-normal text-neutral-950">Home</h1>
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
              <DropdownMenuItem>Cài đặt bảng tin</DropdownMenuItem>
              <DropdownMenuItem>Lọc nội dung</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content Card */}
        <Card className="p-4">
          {/* Create post card - Chỉnh lại UI */}
          <CardHeader className="flex-row items-start space-y-0 p-0 pb-4">
            <div className="flex w-full gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/default-avt.jpg" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-start px-0 text-[15px] font-normal text-neutral-500 hover:bg-transparent"
                >
                  Có gì mới?
                </Button>
              </div>
              <Button
                variant="outline"
                className="h-9 px-8 rounded-xl border-neutral-200 text-sm font-medium text-neutral-950 hover:bg-neutral-100"
              >
                Đăng
              </Button>
            </div>
          </CardHeader>

          <Separator className="bg-neutral-200 mb-4" />

          {/* Posts feed */}
          <CardContent className="p-0">
            <InfiniteScroll
              dataLength={currentPosts.length}
              next={loadMore}
              hasMore={currentPosts.length < posts.length}
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
              <div className="space-y-0">
                {currentPosts.map((post, index) => {
                  const user = usersData.users.find(
                    (u) => u.id === post.userId
                  )!;
                  return (
                    <div key={post.id}>
                      <div className="py-4">
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
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-0.5">
                              <span className="font-bold text-neutral-950">
                                {user.displayName}
                              </span>
                              {user.isVerified && <VerifiedBadge />}
                            </div>
                            <p className="text-[15px] leading-normal mb-3">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-0 hover:text-red-500"
                              >
                                <Heart
                                  className={`h-[18px] w-[18px] ${
                                    post.isLiked
                                      ? "fill-red-500 text-red-500"
                                      : ""
                                  }`}
                                />
                                <span className="ml-1 text-sm">
                                  {post.stats.likes.toLocaleString()}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-0"
                              >
                                <MessageCircle className="h-[18px] w-[18px]" />
                                <span className="ml-1 text-sm">
                                  {post.stats.replies.toLocaleString()}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-0"
                              >
                                <Repeat2 className="h-[18px] w-[18px]" />
                                <span className="ml-1 text-sm">
                                  {post.stats.reposts.toLocaleString()}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-0"
                              >
                                <Share className="h-[18px] w-[18px]" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < currentPosts.length - 1 && (
                        <Separator className="bg-neutral-200" />
                      )}
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
