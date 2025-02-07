"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { fetchUserById } from "@/lib/firebase/apis/user.server";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchPostsByUser } from "@/lib/firebase/apis/posts.server";
import { Label } from "@/components/ui/label";
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
          {/* Header section */}
          <div className="mb-8 flex items-start justify-between">
            {/* Left column: Info */}
            <div className="flex flex-col space-y-6">
              {/* Name & Username */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" /> {/* Name */}
                <Skeleton className="h-5 w-[150px]" /> {/* Username */}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-[400px]" />
                <Skeleton className="h-4 w-[350px]" />
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-[100px]" /> {/* Followers count */}
              </div>
            </div>

            {/* Right column: Avatar */}
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>

          {/* Follow button */}
          <Skeleton className="h-10 w-[150px] rounded-[10px]" />

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex gap-4 border-b border-secondary">
              <Skeleton className="h-10 w-[100px]" /> {/* Posts tab */}
              <Skeleton className="h-10 w-[100px]" /> {/* Reposts tab */}
            </div>

            {/* Posts content */}
            <div className="space-y-4">
              <Skeleton className="h-[150px] w-full rounded-lg" />
              <Skeleton className="h-[150px] w-full rounded-lg" />
              <Skeleton className="h-[150px] w-full rounded-lg" />
            </div>
          </div>
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
        <div className="mb-8 flex items-start justify-between">
          {/* Left column: Info */}
          <div className="flex flex-col space-y-6">
            {/* Name & Username section */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {user?.firstName + " " + (user?.lastName || "")}
              </h1>
              <p className="text-base text-muted-foreground">
                @{user?.username}
              </p>
            </div>

            {/* Bio section - only show if exists */}
            {user?.bio && (
              <div className="max-w-[500px]">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Stats section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-semibold">
                  {user?.followers || 0}
                </span>
                <span className="text-sm text-muted-foreground">followers</span>
              </div>
            </div>
          </div>

          {/* Right column: Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.profilePicture} alt="Profile picture" />
              <AvatarFallback className="[&_svg]:size-10">
                <UserIcon className="w-24 h-24" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Button
          className={`w-1/4 rounded-[10px] font-semibold cursor-pointer
            ${
              isFollowing
                ? "bg-transparent hover:bg-background border-[#999999] text-foreground"
                : "bg-black text-white hover:bg-black/90 dark:bg-foreground dark:text-background"
            }`}
          variant={isFollowing ? "outline" : "default"}
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>

        {/* Tabs Navigation */}
        <Tabs defaultValue="posts" className="mb-6 bg-card">
          <TabsList className="grid w-full h-fit gap-0 grid-cols-2 bg-card p-0 border-b-[1px] border-secondary rounded-none">
            <TabsTrigger
              value="posts"
              className="font-semibold py-2 border-b-[1px] border-transparent rounded-none data-[state=active]:bg-card data-[state=active]:border-primary"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="reposts"
              className="font-semibold py-2 border-b-[1px] border-transparent rounded-none data-[state=active]:bg-card data-[state=active]:border-primary"
            >
              Reposts
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="posts"
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
