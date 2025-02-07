"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Image, Pencil, Users } from "lucide-react";
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

export default function Profile() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showRepostTab, setShowRepostTab] = useState(true);

  const {
    data: currentUser,
    isLoading,
    error,
    refetch: refetchUser,
  } = useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 3,
  });

  const { data: profileCompletion } = useQuery({
    queryKey: ["profileCompletion", currentUser?.id],
    queryFn: () => getProfileCompletion(currentUser?.id || ""),
    enabled: !!currentUser?.id,
  });

  const visibleTabsCount = useMemo(() => {
    return 1 + (showRepostTab ? 1 : 0);
  }, [showRepostTab]);

  const handleProfileUpdate = () => {
    refetchUser();
  };

  const tabsListClassName = useMemo(() => {
    switch (visibleTabsCount) {
      case 1:
        return "grid w-full h-fit gap-4 grid-cols-1";
      default:
        return "grid w-full h-fit gap-4 grid-cols-2";
    }
  }, [visibleTabsCount]);

  const router = useRouter();

  if (isLoading) {
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

  if (error) {
    return (
      <div className="h-full min-h-[90vh] min-w-[700px] rounded-3xl">
        <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
          <div className="text-center text-red-500">
            Error loading profile. Please try again later.
          </div>
          <Button onClick={() => refetchUser()} className="mx-auto">
            Retry
          </Button>
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
          {/* Left column: Info */}
          <div className="flex flex-col space-y-6">
            {/* Name & Username section */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {currentUser?.firstName + " " + (currentUser?.lastName || "")}
              </h1>
              <p className="text-base text-muted-foreground">
                @{currentUser?.username}
              </p>
            </div>

            {/* Bio section - only show if exists */}
            {currentUser?.bio && (
              <div className="max-w-[500px]">
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
                  {currentUser.bio}
                </p>
              </div>
            )}

            {/* Stats section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-baseline space-x-1">
                <span className="text-base font-semibold">
                  {currentUser?.followers || 0}
                </span>
                <span className="text-sm text-muted-foreground">followers</span>
              </div>
            </div>
          </div>

          {/* Right column: Avatar */}
          <div className="flex-shrink-0">
            <UserAvatar
              userId={currentUser?.id || null}
              className="h-24 w-24" // Larger avatar
            />
          </div>
        </div>

        {/* Edit Profile Button */}
        <Button
          onClick={() => setModalOpen(true)}
          variant="outline"
          className="mb-6 w-full rounded-xl font-semibold"
        >
          Edit profile
        </Button>
        <ChangeProfileModal
          isOpen={isModalOpen}
          onChange={setModalOpen}
          currentUser={currentUser ?? null}
          showRepostTab={showRepostTab}
          setShowRepostTab={setShowRepostTab}
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Tabs Navigation */}
        <Tabs defaultValue="posts" className="mb-6 bg-card">
          <TabsList
            className={`${tabsListClassName} 
          bg-card gap-0 p-0 border-b-[1px] border-secondary rounded-none`}
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
          </TabsList>

          <TabsContent value="posts" className="space-y-4 bg-card">
            {/* Post Composer */}
            <div className="flex items-center py-6 bg-card border-b border-zinc-800 pb-4">
              <UserAvatar userId={currentUser?.id || null} />
              <div className="flex-1">
                <Input
                  readOnly
                  onClick={() => {
                    showCreatePostModal();
                  }}
                  placeholder="What's new?"
                  className="border-0 bg-card text-white placeholder:text-zinc-400 focus-visible:ring-0 cursor-pointer"
                />
              </div>
              <Button
                onClick={() => {
                  showCreatePostModal();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
              >
                Post
              </Button>
            </div>

            {/* Profile Completion Section */}
            {profileCompletion &&
              profileCompletion.completedTasks <
                profileCompletion.totalTasks && (
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

                  {/* Wrapping div to handle horizontal scrolling */}
                  <div className="w-full overflow-x-auto">
                    <div className="flex flex-row space-x-4 rounded-xl">
                      {/* Create post card */}
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
                            onClick={() => showCreatePostModal()}
                            className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                          >
                            Create post
                          </Button>
                        </div>
                      )}

                      {/* Follow profiles card */}
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

                      {/* Add bio card */}
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

                      {/* Upload avatar card */}
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
              )}
          </TabsContent>

          {/* Repost */}
          <TabsContent
            value="reposts"
            className="w-full h-full max-h-[500px] bg-card overflow-y-auto "
          >
            <Reposts userId={currentUser?.id ?? ""} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
