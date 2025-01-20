"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/dropdown-menu";

// Thêm component Verified Badge
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

  // Load more function với delay
  const loadMore = () => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-2xl min-w-[680px] px-4">
        {/* Header - Centered with dots */}
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

        {/* Create post card - Chỉnh lại padding và border */}
        <Card className="mb-4 border-neutral-100">
          <CardHeader className="flex-row gap-4 space-y-0 p-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/default-avt.jpg" alt="User avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              className="h-9 w-full justify-start px-4 text-muted-foreground border-neutral-200 hover:bg-neutral-50"
            >
              What&apos;s on your mind?
            </Button>
          </CardHeader>
        </Card>

        {/* Posts feed with infinite scroll */}
        <InfiniteScroll
          dataLength={currentPosts.length}
          next={loadMore}
          hasMore={currentPosts.length < posts.length}
          loader={
            // Loading skeleton - 5 items khi scroll
            <div className="space-y-4 py-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-neutral-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-5 w-44 bg-neutral-200 rounded" />
                          <div className="h-4 w-32 bg-neutral-200 rounded" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="h-20 w-full bg-neutral-200 rounded" />
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-4">
                        <div className="h-8 w-20 bg-neutral-200 rounded" />
                        <div className="h-8 w-20 bg-neutral-200 rounded" />
                        <div className="h-8 w-20 bg-neutral-200 rounded" />
                        <div className="h-8 w-8 bg-neutral-200 rounded" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          }
        >
          <div className="space-y-3">
            {currentPosts.map((post) => {
              const user = usersData.users.find((u) => u.id === post.userId)!;
              return (
                <Card key={post.id} className="border-neutral-100">
                  <CardHeader className="p-4 pb-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback>
                          {user.displayName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-[15px]">
                            {user.displayName}
                          </span>
                          {user.isVerified && <VerifiedBadge />}
                        </div>
                        <p className="text-[15px] text-neutral-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 pb-3">
                    <p className="text-[15px] leading-normal">{post.content}</p>
                  </CardContent>

                  <CardFooter className="px-4 pb-3">
                    <div className="flex w-full items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-0 hover:text-red-500"
                      >
                        <Heart
                          className={`h-[18px] w-[18px] ${
                            post.isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        <span className="ml-1 text-sm">
                          {post.stats.likes.toLocaleString()}
                        </span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 px-0">
                        <MessageCircle className="h-[18px] w-[18px]" />
                        <span className="ml-1 text-sm">
                          {post.stats.replies.toLocaleString()}
                        </span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 px-0">
                        <Repeat2 className="h-[18px] w-[18px]" />
                        <span className="ml-1 text-sm">
                          {post.stats.reposts.toLocaleString()}
                        </span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 px-0">
                        <Share className="h-[18px] w-[18px]" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
