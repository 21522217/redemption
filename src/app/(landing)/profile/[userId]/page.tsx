"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { fetchUserById } from "@/lib/firebase/apis/user.server";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchPostsByUserId } from "@/lib/firebase/apis/posts.server";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import PostCard from "../../_components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createFollow,
  deleteFollow,
  checkIfFollowing,
} from "@/lib/firebase/apis/follow.server";
import { Post } from "@/types/post";
import { useQueryClient } from "@tanstack/react-query";

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCheckingFollow, setIsCheckingFollow] = useState(true);
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId as string),
  });

  const { data: userPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchPostsByUserId(userId as string),
  });

  const followMutation = useMutation({
    mutationFn: isFollowing
      ? () => deleteFollow(currentUser?.uid as string, userId as string)
      : () => createFollow(currentUser?.uid as string, userId as string),
    onSuccess: () => {
      setIsFollowing(!isFollowing);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", userId] });
    },
  });

  useEffect(() => {
    if (currentUser && userId) {
      checkIfFollowing(currentUser.uid as string, userId as string).then(
        (isFollowing) => {
          setIsFollowing(isFollowing);
          setIsCheckingFollow(false);
        }
      );
    }
  }, [currentUser, userId]);

  if (isLoadingUser || isLoadingPosts || isCheckingFollow) {
    return (
      <div className="h-full min-h-[90vh] min-w-[700px] rounded-3xl">
        <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-5 w-[150px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[400px]" />
                <Skeleton className="h-4 w-[350px]" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-[100px]" />
              </div>
            </div>
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
          <Skeleton className="h-10 w-[150px] rounded-[10px]" />
          <div className="space-y-4">
            <div className="flex gap-4 border-b border-secondary">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
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

  return (
    <div className="h-[90vh] w-full rounded-3xl">
      <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex flex-col space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {user?.firstName + " " + (user?.lastName || "")}
              </h1>
              <p className="text-base text-muted-foreground">
                @{user?.username}
              </p>
            </div>
            {user?.bio && (
              <div className="flex flex-col w-full">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
                  {user.bio}
                </p>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-semibold">
                  {user?.followers || 0}
                </span>
                <span className="text-sm text-muted-foreground">followers</span>
              </div>
            </div>
          </div>
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
            ${isFollowing
              ? "dark:hover:bg-zinc-900 border-primary hover:"
              : "bg-primary text-primary-foreground"
            }`}
          variant={isFollowing ? "outline" : "default"}
          onClick={() => followMutation.mutate()}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Tabs defaultValue="posts" className="mb-6 bg-card overflow-y-scroll">
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
            className="flex flex-col bg-card overflow-y-scroll"
          >
            {!userPosts || userPosts.length === 0 || !user ? (
              <div className="w-full h-full bg-card text-center content-center">
                <Label className="text-md text-accent-foreground">
                  No post yet
                </Label>
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="flex flex-col space-y-2">
                  <PostCard user={user} post={post as Post} />
                  <Separator className="" />
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent
            value="reposts"
            className="flex flex-col bg-card overflow-y-scroll w-full"
          >

          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
