"use client";

import { BarChart2, Edit, Pencil, Plus, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  return (
    <div className="h-full rounded-3xl">
      <div className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
        <div className="mb-6 flex items-start bg-card justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Khiem Tran</h1>
            <p className="text-sm text-zinc-400">hanzo_hekim</p>
            <p className="text-sm text-zinc-400">0 followers</p>
          </div>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FXQJ5FQ4Nv8SXIfqqeoDv2kbCYimji.png"
                alt="Profile picture"
              />
              <AvatarFallback>KT</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="icon" className="rounded-full">
              <BarChart2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Edit Profile Button */}
        <Button
          variant="outline"
          className="mb-6 w-full rounded-xl font-semibold"
        >
          Edit profile
        </Button>

        {/* Tabs Navigation */}
        <Tabs defaultValue="threads" className="mb-6">
          <TabsList className="w-full h-fit grid grid-cols-3 gap-4">
            <TabsTrigger value="threads" className="font-semibold py-2">
              Threads
            </TabsTrigger>
            <TabsTrigger value="replies" className="font-semibold py-2">
              Replies
            </TabsTrigger>
            <TabsTrigger value="reposts" className="font-semibold py-2">
              Reposts
            </TabsTrigger>
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
                  placeholder="What's new?"
                  className="border-0 bg-card text-white placeholder:text-zinc-400 focus-visible:ring-0"
                />
              </div>
              <Button variant="outline" className="rounded-xl font-semibold">
                Post
              </Button>
            </div>

            {/* Profile Completion Section */}
            <div className="space-y-4 rounded-xl p-4 bg-card">
              <div className="flex items-center justify-between bg-card">
                <h2 className="text-lg font-semibold">Finish your profile</h2>
                <span className="text-sm text-zinc-400">3 left</span>
              </div>

              <div className="grid gap-4 grid-cols-3 bg-card">
                <div className="rounded-xl">
                  <div className="flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary">
                    <div className="rounded-full bg-accent p-4">
                      <Edit className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Create thread</h3>
                    <p className="text-sm text-zinc-400">
                      Say what&apos;s on your mind or share a recent highlight.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      Create
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl">
                  <div className="flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary">
                    <div className="rounded-full bg-accent p-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Follow 10 profiles</h3>
                    <p className="text-sm text-zinc-400">
                      Fill your feed with threads that interest you.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      See profiles
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl">
                  <div className="flex flex-col rounded-xl items-center gap-4 p-6 text-center bg-secondary">
                    <div className="rounded-full bg-accent p-4">
                      <Pencil className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Add bio</h3>
                    <p className="text-sm text-zinc-400">
                      Introduce yourself and tell people what you&apos;re into.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 w-full rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="replies">
            <div className="text-center text-zinc-400">No replies yet</div>
          </TabsContent>

          <TabsContent value="reposts">
            <div className="text-center text-zinc-400">No reposts yet</div>
          </TabsContent>
        </Tabs>

        {/* New Post Button (Mobile) */}
        <Button
          variant="outline"
          className="fixed bottom-4 right-4 px-8 py-12 rounded-3xl shadow-lg [&_svg]:size-10"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}
