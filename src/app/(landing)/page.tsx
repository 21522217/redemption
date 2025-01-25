"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui-thread/avatar";
import { Button } from "@/components/ui-thread/button";
import { Separator } from "@/components/ui-thread/separator";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import postsData from "@/data/posts-data.json";
import usersData from "@/data/users-data.json";
import { MediaGallery } from "@/components/ui-thread/media-gallery";
import { Card } from "@/components/ui/card";

export default function Page() {
  const [displayCount, setDisplayCount] = useState(5);
  const posts = postsData.posts;
  const currentPosts = posts.slice(0, displayCount);

  const loadMore = useCallback(() => {
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
    }, 350);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-2xl min-w-[680px] px-4">
        <Card className="p-4 shadow bg-card rounded-lg">
          <Card className="flex items-start gap-3 pb-4 border-none">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/default-avt.jpg" alt="User avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              className="flex-1 h-auto w-full justify-start"
            >
              Có gì mới?
            </Button>
            <Button
              variant="outline"
              className="h-9 px-8 rounded-xl border-neutral-200 text-sm font-medium"
            >
              Đăng
            </Button>
          </Card>

          <Separator className="bg-neutral-200 mb-4" />

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
            {currentPosts.map((post, index) => {
              const user = usersData.users.find((u) => u.id === post.userId)!;
              return (
                <div key={post.id} className="py-4">
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
                    <div className="flex-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="font-bold text-neutral-950">
                          {user.displayName}
                        </span>
                      </div>
                      <p className="text-[15px] leading-normal mb-3">
                        {post.content}
                      </p>

                      {post.media && post.media.length > 0 && (
                        <MediaGallery
                          media={post.media.map((m) => ({
                            ...m,
                            type: m.type as "image" | "video",
                          }))}
                        />
                      )}

                      <div className="flex items-center gap-6 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-0 hover:text-red-500"
                        >
                          <Heart
                            className={`h-[18px] w-[18px] ${post.isLiked ? "fill-red-500 text-red-500" : ""
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
                  {index < currentPosts.length - 1 && (
                    <Separator className="bg-neutral-200" />
                  )}
                </div>
              );
            })}
          </InfiniteScroll>
        </Card>
      </div>
    </div>
  );
}
