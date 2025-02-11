"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Image, Pencil, UserIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { showCreatePostModal } from "@/components/CreatePostModal";
import { fetchCurrentUser } from "@/lib/firebase/apis/user.server";
import { User } from "@/types/user";
import ChangeProfileModal from "@/components/ChangeProfileModal";
import Reposts from "@/components/Reposts";
import { Skeleton } from "@/components/ui/skeleton";
import UserAvatar from "@/components/UserAvatar";
import { getProfileCompletion } from "@/lib/firebase/apis/lam-user.server";
import { useRouter } from "next/navigation";
import { fetchPostsByUserId } from "@/lib/firebase/apis/posts.server";
import PostCard from "../_components/PostCard";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Post } from "@/types/post";
import Followers from "@/components/Followers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Profile() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showRepostTab, setShowRepostTab] = useState(true);

  const {
    data: currentUser,
    isLoading,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => await fetchCurrentUser(),
  });

  const { data: profileCompletion, error: profileCompletionError } = useQuery({
    queryKey: ["profileCompletion", currentUser?.id],
    queryFn: () => getProfileCompletion(currentUser?.id || ""),
    enabled: !!currentUser?.id,
  });

  const { data: userPosts, isLoading: userPostsLoading } = useQuery({
    queryKey: ["userPosts", currentUser?.id],
    queryFn: () => fetchPostsByUserId(currentUser?.id || ""),
    enabled: !!currentUser?.id,
  });

  const visibleTabsCount = useMemo(
    () => 1 + (showRepostTab ? 1 : 0),
    [showRepostTab]
  );

  const tabsListClassName = useMemo(() => {
    return visibleTabsCount === 1
      ? "grid w-full h-fit gap-4 grid-cols-1"
      : "grid w-full h-fit gap-4 grid-cols-3";
  }, [visibleTabsCount]);

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="h-full min-h-[90vh] min-w-[700px] rounded-3xl">
        <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
          <LoadingSkeleton />
        </Card>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-full min-h-[90vh] min-w-[700px] rounded-3xl">
      <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
        <div className="mb-8 flex items-start justify-between">
          <div className="flex flex-col space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {currentUser.firstName + " " + (currentUser.lastName || "")}
              </h1>
              <p className="text-base text-muted-foreground">
                @{currentUser.username}
              </p>
            </div>
            {currentUser.bio && (
              <div className="max-w-[500px]">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
                  {currentUser.bio}
                </p>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-semibold">
                  {currentUser.followers || 0}
                </span>
                <span className="text-sm text-muted-foreground">followers</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={currentUser?.profilePicture}
                alt="Profile picture"
              />
              <AvatarFallback className="[&_svg]:size-7">
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          variant="default"
          className="mb-6 w-full rounded-xl font-semibold"
        >
          Edit profile
        </Button>
        <ChangeProfileModal
          isOpen={isModalOpen}
          onChange={setModalOpen}
          currentUser={currentUser}
          showRepostTab={showRepostTab}
          setShowRepostTab={setShowRepostTab}
          onProfileUpdate={refetchUser}
        />
        <Tabs defaultValue="posts" className="mb-6 bg-card">
          <TabsList
            className={`${tabsListClassName} bg-card gap-0 p-0 border-b-[1px] border-secondary rounded-none`}
          >
            <TabsTrigger
              value="posts"
              className="font-semibold py-2 border-b-[1px] border-transparent rounded-none data-[state=active]:bg-card data-[state=active]:border-primary"
            >
              Posts
            </TabsTrigger>
            {showRepostTab && (
              <TabsTrigger
                value="reposts"
                className="font-semibold py-2 border-b-[1px] border-transparent rounded-none data-[state=active]:bg-card data-[state=active]:border-primary"
              >
                Reposts
              </TabsTrigger>
            )}
            <TabsTrigger
              value="followers"
              className="font-semibold py-2 border-b-[1px] border-transparent rounded-none data-[state=active]:bg-card data-[state=active]:border-primary"
            >
              Followers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="space-y-4 bg-card">
            <div className="flex items-center py-6 bg-card border-b border-zinc-800 pb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={currentUser.profilePicture}
                  alt="Profile picture"
                />
                <AvatarFallback>KT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  readOnly
                  onClick={showCreatePostModal}
                  placeholder="What's new?"
                  className="border-0 bg-card text-white placeholder:text-zinc-400 focus-visible:ring-0 cursor-pointer"
                />
              </div>
              <Button
                onClick={showCreatePostModal}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
              >
                Post
              </Button>
            </div>
            {profileCompletionError ? (
              <div className="text-center text-red-500">
                Error loading profile completion. Please try again later.
              </div>
            ) : (
              profileCompletion &&
              (profileCompletion.completedTasks <
                profileCompletion.totalTasks ? (
                <div className="flex flex-col space-y-4 rounded-xl p-4 bg-card">
                  <div className="flex items-center justify-between bg-card">
                    <h2 className="text-lg font-semibold">
                      Finish your profile
                    </h2>
                    <span className="text-sm text-zinc-400">
                      {profileCompletion.completedTasks}/
                      {profileCompletion.totalTasks}
                    </span>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <div className="flex flex-row space-x-4 rounded-xl">
                      {!profileCompletion.hasPost && (
                        <div className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0">
                          <div className="rounded-full bg-accent p-4">
                            <Edit className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium">
                            Create your first post
                          </h3>
                          <p className="text-sm text-zinc-400">
                            Share what&apos;s on your mind with others.
                          </p>
                          <Button
                            onClick={showCreatePostModal}
                            className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          >
                            Create post
                          </Button>
                        </div>
                      )}
                      {!profileCompletion.hasEnoughFollowing && (
                        <div className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0">
                          <div className="rounded-full bg-accent p-4">
                            <Users className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium">
                            Follow {10 - profileCompletion.followingCount} more
                            people
                          </h3>
                          <p className="text-sm text-zinc-400">
                            Connect with people that interest you.
                          </p>
                          <Button
                            onClick={() => router.push("/search")}
                            className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          >
                            Find people
                          </Button>
                        </div>
                      )}
                      {!profileCompletion.hasBio && (
                        <div className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0">
                          <div className="rounded-full bg-accent p-4">
                            <Pencil className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium">Add bio</h3>
                          <p className="text-sm text-zinc-400">
                            Tell others about yourself.
                          </p>
                          <Button
                            onClick={() => setModalOpen(true)}
                            className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          >
                            Add bio
                          </Button>
                        </div>
                      )}
                      {!profileCompletion.hasAvatar && (
                        <div className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0">
                          <div className="rounded-full bg-accent p-4">
                            <Image className="h-6 w-6" />
                          </div>
                          <h3 className="font-medium">Add profile picture</h3>
                          <p className="text-sm text-zinc-400">
                            Choose a picture that represents you.
                          </p>
                          <Button
                            onClick={() => setModalOpen(true)}
                            className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          >
                            Upload picture
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {!userPosts || userPosts.length === 0 || !currentUser ? (
                    <div className="w-full h-full bg-card text-center content-center">
                      <Label className="text-md text-accent-foreground">
                        No post yet
                      </Label>
                    </div>
                  ) : (
                    userPosts.map((post) => (
                      <div key={post.id} className="flex flex-col space-y-2">
                        <PostCard user={currentUser} post={post as Post} />
                        <Separator className="" />
                      </div>
                    ))
                  )}
                </>
              ))
            )}
          </TabsContent>
          {showRepostTab && (
            <TabsContent
              value="reposts"
              className="w-full h-full max-h-[500px] bg-card overflow-y-auto"
            >
              <Reposts userId={currentUser.id} />
            </TabsContent>
          )}
          <TabsContent value="followers">
            <Followers userId={currentUser.id} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
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
      <Skeleton className="h-10 w-full rounded-[10px]" />
      <div className="flex flex-col space-y-4 rounded-xl p-4 bg-card">
        <div className="flex items-center justify-between bg-card">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[50px]" />
        </div>
        <div className="w-full overflow-x-auto">
          <div className="flex flex-row space-x-4 rounded-xl">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0"
              >
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-4 w-[160px]" />
                <Skeleton className="h-9 w-full rounded-[10px] mt-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4 border-b border-secondary">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="flex items-center gap-4 py-6 border-b border-zinc-800">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-[100px] rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
      </div>
    </>
  );
}
