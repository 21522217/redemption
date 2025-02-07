"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Image, Pencil, UserIcon, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { User } from "@/types/user";
import {
  fetchUserById,
  fetchUserByUsername,
} from "@/lib/firebase/apis/user.server";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchPostsByUser } from "@/lib/firebase/apis/posts.server";
import { Post } from "@/types/post";
import { Label } from "@/components/ui/label";
import { ActivityCard } from "@/components/ActivityCard";
import { Separator } from "@/components/ui/separator";
import PostCard from "../../_components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { userId } = useParams();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  // Query for user data
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId as string),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 3,
    enabled: !!userId,
  });

  // Query for user posts
  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: fetchPostsByUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 3,
    enabled: !!userId,
  });

  if (isLoadingUser || isLoadingPosts) {
    return (
      <div className="h-full min-h-[90vh] min-w-[700px] rounded-3xl">
        <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
          <div className="mb-6 flex items-start bg-card justify-between">
            <div className="flex flex-col h-full space-y-1">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[100px] mt-6" />
            </div>
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  if (userError) {
    router.replace("/404");
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-full min-h-[90vh] min-w-[700px] rounded-3xl">
      <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
        <div className="mb-6 flex items-start bg-card justify-between">
          <div className="flex flex-col h-full space-y-1">
            <h1 className="text-xl font-semibold">
              {user?.firstName + " " + (user?.lastName || "")}
            </h1>
            <p className="text-md font-semibold">{user?.username}</p>
            <p className="text-sm text-accent-foreground whitespace-pre-wrap break-words max-w-[500px]">
              {user?.bio}
            </p>
            <p className="text-sm mt-6 text-accent-foreground">
              {user?.followers} followers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePicture} alt="Profile picture" />
              <AvatarFallback className="[&_svg]:size-7">
                <UserIcon className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Button
          className={`w-1/4 rounded-lg font-semibold`}
          variant={isFollowing ? "outline" : "default"}
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>

        {/* Tabs Navigation */}
        <Tabs defaultValue="stories" className="mb-6 bg-card">
          <TabsList
            className=" grid w-full h-fit gap-0 grid-cols-2
                     bg-card p-0 border-b-[1px] border-secondary rounded-none "
          >
            <TabsTrigger
              value="stories"
              className="font-semibold py-2 border-b-[1px] border-transparent rounded-none data-[state=active]:bg-card data-[state=active]:border-primary"
            >
              Stories
            </TabsTrigger>

            <TabsTrigger
              value="reposts"
              className="font-semibold py-2 border-b-[1px] border-transparent rounded-none data-[state=active]:bg-card data-[state=active]:border-primary"
            >
              Reposts
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="stories"
            className="w-full h-full max-h-[500px] bg-card overflow-y-auto "
          >
            {!userPosts || userPosts.length === 0 || !user ? (
              <div className="w-full h-full bg-card text-center content-center">
                <Label className="text-md text-accent-foreground">
                  No post yet
                </Label>
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id}>
                  <PostCard user={user} post={post} />
                  <Separator />
                </div>
              ))
            )}
          </TabsContent>

          {/* Repost */}
          <TabsContent
            value="reposts"
            className="w-full h-full max-h-[500px] bg-card overflow-y-auto "
          ></TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
