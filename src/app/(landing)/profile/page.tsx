"use client";

import { useState, useMemo, useEffect } from "react";
import { BarChart2, Edit, Image, Pencil, Plus, UserIcon, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { showCreatePostModal } from "@/components/CreatePostModal";
import { showChangeProfileModal } from "@/components/ChangeProfileModal";

import { fetchCurrentUser } from "@/lib/firebase/apis/user.server";
import { User } from "@/types/user";

export default function Profile() {

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showReplyTab, setShowReplyTab] = useState(true);
  const [showRepostTab, setShowRepostTab] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => {
        setCurrentUser(user);
        console.log("User:", user);
      })
      .catch((error) => {
        console.error("Error:", error);
        setCurrentUser(null); // Handle cases where user is not found
      });
  }, []);

  const visibleTabsCount = useMemo(() => {
    return 1 + (showReplyTab ? 1 : 0) + (showRepostTab ? 1 : 0)
  }, [showReplyTab, showRepostTab])

  const tabsListClassName = useMemo(() => {
    switch (visibleTabsCount) {
      case 1:
        return "grid w-full h-fit gap-4 grid-cols-1"
      case 2:
        return "grid w-full h-fit gap-4 grid-cols-2"
      default:
        return "grid w-full h-fit gap-4 grid-cols-3"
    }
  }, [visibleTabsCount])

  return (
    <div className="h-full min-h-[90vh] min-w-[700px] rounded-3xl">
      <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
        <div className="mb-6 flex items-start bg-card justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">{currentUser?.firstName + " " + (currentUser?.lastName || "")}</h1>
            <p className="text-sm text-zinc-400">{currentUser?.username}</p>
            <p className="text-sm text-zinc-400">{currentUser?.followers} followers</p>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={currentUser?.profilePicture}
                alt="Profile picture"
              />
              <AvatarFallback className="[&_svg]:size-7">
                <UserIcon className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Edit Profile Button */}
        <Button
          onClick={() => {
            showChangeProfileModal(
              showReplyTab,
              setShowReplyTab,
              showRepostTab,
              setShowRepostTab,
              currentUser,
            );
          }}
          variant="outline"
          className="mb-6 w-full rounded-xl font-semibold"
        >
          Edit profile
        </Button>

        {/* Tabs Navigation */}
        <Tabs defaultValue="threads" className="mb-6">
          <TabsList className={tabsListClassName}>
            <TabsTrigger value="threads" className="font-semibold py-2">
              Threads
            </TabsTrigger>
            {showReplyTab && (
              <TabsTrigger value="replies" className="font-semibold py-2">
                Replies
              </TabsTrigger>
            )}
            {showRepostTab && (
              <TabsTrigger value="reposts" className="font-semibold py-2">
                Reposts
              </TabsTrigger>)}
          </TabsList>

          <TabsContent value="threads" className="space-y-4 bg-card">
            {/* Post Composer */}
            <div className="flex items-center py-6 bg-card border-b border-zinc-800 pb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FXQJ5FQ4Nv8SXIfqqeoDv2kbCYimji.png"
                  alt="Profile picture"
                />
                <AvatarFallback>KT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  readOnly
                  onClick={() => {
                    showCreatePostModal();
                  }}
                  placeholder="What's new?"
                  className="border-0 bg-card text-white placeholder:text-zinc-400 focus-visible:ring-0"
                />
              </div>
              <Button
                onClick={() => {
                  showCreatePostModal();
                }}
                variant="outline"
                className="rounded-xl font-semibold"
              >
                Post
              </Button>
            </div>

            {/* Profile Completion Section */}
            <div className="flex flex-col space-y-4 rounded-xl p-4 bg-card">
              <div className="flex items-center justify-between bg-card">
                <h2 className="text-lg font-semibold">Finish your profile</h2>
                <span className="text-sm text-zinc-400">3 left</span>
              </div>

              {/* Wrapping div to handle horizontal scrolling */}
              <div className="w-full overflow-x-auto">
                <div className="flex flex-row space-x-4 rounded-xl">

                  <div className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0">
                    <div className="rounded-full bg-accent p-4">
                      <Edit className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Create thread</h3>
                    <p className="text-sm text-zinc-400">
                      Say what&apos;s on your mind or share a recent highlight.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      Create
                    </Button>
                  </div>

                  <div className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0">
                    <div className="rounded-full bg-accent p-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Follow 10 profiles</h3>
                    <p className="text-sm text-zinc-400">
                      Fill your feed with threads that interest you.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      See profiles
                    </Button>
                  </div>

                  <div className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0">
                    <div className="rounded-full bg-accent p-4">
                      <Pencil className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Add bio</h3>
                    <p className="text-sm text-zinc-400">
                      Introduce yourself and tell people what you&apos;re into.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      Add
                    </Button>
                  </div>

                  <div className="w-[200px] flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary shrink-0">
                    <div className="rounded-full bg-accent p-4">
                      <Image className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Upload your avatar</h3>
                    <p className="text-sm text-zinc-400">
                      Add a profile picture to help others recognize you.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-auto w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      Upload
                    </Button>
                  </div>

                </div>
              </div>
            </div>

          </TabsContent>

          <TabsContent value="replies" className="w-full h-full">
            <div className="text-center text-zinc-400">No replies yet</div>
          </TabsContent>

          <TabsContent value="reposts">
            <div className="text-center text-zinc-400">No reposts yet</div>
          </TabsContent>
        </Tabs>

      </Card>
    </div >
  );
}
