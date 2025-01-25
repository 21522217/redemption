"use client";
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "@/components/ui-thread/avatar";
import { Button } from "@/components/ui-thread/button";
import { Separator } from "@/components/ui-thread/separator";
import { useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import postsData from "@/data/posts-data.json";
import usersData from "@/data/users-data.json";
import { Card } from "@/components/ui/card";
import { ActivityCard } from "@/components/ActivityCard";


export default function Activity() {
   const [displayCount, setDisplayCount] = useState(5);
   const posts = postsData.posts;
   const currentPosts = posts.slice(0, displayCount);

   const loadMore = useCallback(() => {
      setTimeout(() => {
         setDisplayCount((prev) => prev + 5);
      }, 350);
   }, []);
   return (
      <div className=" w-1/2 min-w-[680] min-h-screen px-4">
         <Card className="p-4 shadow bg-card rounded-3xl">
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
                     <div key={post.id}>
                        <ActivityCard user={user} post={post} />
                        {index < currentPosts.length - 1 && (
                           <Separator className="bg-neutral-200" />
                        )}
                     </div>
                  );
               })}
            </InfiniteScroll>
         </Card>
      </div>
   );
}
