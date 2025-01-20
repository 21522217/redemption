"use client";

import { BarChart2, Edit, Pencil, Plus, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-2xl p-4">
        {/* Profile Header */}
        <div className="mb-6 flex items-start justify-between">
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
          className="mb-6 w-full border-zinc-800 text-white hover:bg-zinc-800"
        >
          Edit profile
        </Button>

        {/* Tabs Navigation */}
        <Tabs defaultValue="threads" className="mb-6">
          <TabsList className="w-full justify-start border-b border-zinc-800 bg-transparent">
            <TabsTrigger
              value="threads"
              className="rounded-none border-b-2 border-transparent px-0 pb-4 pt-2 text-zinc-400 data-[state=active]:border-white data-[state=active]:text-white"
            >
              Threads
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="rounded-none border-b-2 border-transparent px-6 pb-4 pt-2 text-zinc-400 data-[state=active]:border-white data-[state=active]:text-white"
            >
              Replies
            </TabsTrigger>
            <TabsTrigger
              value="reposts"
              className="rounded-none border-b-2 border-transparent px-0 pb-4 pt-2 text-zinc-400 data-[state=active]:border-white data-[state=active]:text-white"
            >
              Reposts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="threads" className="space-y-4">
            {/* Post Composer */}
            <div className="flex items-start gap-2 border-b border-zinc-800 pb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FXQJ5FQ4Nv8SXIfqqeoDv2kbCYimji.png"
                  alt="Profile picture"
                />
                <AvatarFallback>KT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  placeholder="What's new?"
                  className="border-0 bg-transparent text-white placeholder:text-zinc-400 focus-visible:ring-0"
                />
              </div>
              <Button size="sm" className="rounded-full">
                Post
              </Button>
            </div>

            {/* Profile Completion Section */}
            <div className="space-y-4 rounded-xl bg-zinc-900 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Finish your profile</h2>
                <span className="text-sm text-zinc-400">3 left</span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-zinc-800 bg-zinc-950">
                  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    <div className="rounded-full bg-zinc-900 p-4">
                      <Edit className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Create thread</h3>
                    <p className="text-sm text-zinc-400">
                      Say what&apos;s on your mind or share a recent highlight.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 w-full border-zinc-800 hover:bg-zinc-800"
                    >
                      Create
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-950">
                  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    <div className="rounded-full bg-zinc-900 p-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Follow 10 profiles</h3>
                    <p className="text-sm text-zinc-400">
                      Fill your feed with threads that interest you.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 w-full border-zinc-800 hover:bg-zinc-800"
                    >
                      See profiles
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-zinc-800 bg-zinc-950">
                  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    <div className="rounded-full bg-zinc-900 p-4">
                      <Pencil className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium">Add bio</h3>
                    <p className="text-sm text-zinc-400">
                      Introduce yourself and tell people what you&apos;re into.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2 w-full border-zinc-800 hover:bg-zinc-800"
                    >
                      Add
                    </Button>
                  </CardContent>
                </Card>
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
          size="icon"
          className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg md:hidden"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
