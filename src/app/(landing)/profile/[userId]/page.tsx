"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Image, Pencil, UserIcon, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { User } from "@/types/user";
import { fetchUserById, fetchUserByUsername } from "@/lib/firebase/apis/user.server";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchPostsByUser } from "@/lib/firebase/apis/posts.server";
import { Post } from "@/types/post";
import { Label } from "@/components/ui/label";
import { ActivityCard } from "@/components/ActivityCard";
import { Separator } from "@/components/ui/separator";
import PostCard from "../../_components/PostCard";

export default function Profile() {
   const { userId } = useParams();
   const router = useRouter();
   const [user, setUser] = useState<User | null>(null);
   const [isFollowing, setIsFollowing] = useState(false);
   const [userPosts, setUserPosts] = useState<Post[] | null>(null);

   useEffect(() => {
      if (userId) {
         fetchUserById(userId as string)
            .then((data) => {
               if (!data) {
                  router.replace("/404"); // Redirect if user not found
               } else {
                  setUser(data);
                  fetchPostsByUser()
                     .then((posts) => {
                        setUserPosts(posts);
                        console.log("User Posts:", posts);
                     })
                     .catch((error) => {
                        console.error("Error fetching user posts:", error);
                        setUserPosts(null);
                     });
               }
            })
      }
   }, [userId, router]);

   return (
      <div className="h-full min-h-[90vh] min-w-[700px] rounded-3xl">
         <Card className="flex flex-col h-full bg-card px-8 py-6 rounded-3xl space-y-6">
            <div className="mb-6 flex items-start bg-card justify-between">
               <div className="flex flex-col h-full space-y-1">
                  <h1 className="text-xl font-semibold">
                     {user?.firstName + " " + (user?.lastName || "")}
                  </h1>
                  <p className="text-md font-semibold">{user?.username}</p>
                  <p className="text-sm text-accent-foreground">{user?.bio}</p>
                  <p className="text-sm mt-6 text-accent-foreground">
                     {user?.followers} followers
                  </p>
               </div>
               <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                     <AvatarImage
                        src={user?.profilePicture}
                        alt="Profile picture"
                     />
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

               <TabsContent value="stories"
                  className="w-full h-full max-h-[500px] bg-card overflow-y-auto "
               >
                  {userPosts === null || userPosts.length === 0 || user === null ? (
                     <div className="w-full h-full bg-card text-center content-center">
                        <Label className="text-md text-accent-foreground">No post yet</Label>
                     </div>
                  ) : (
                     userPosts.map((post) => (
                        <div key={post.id}>
                           <PostCard
                              user={user}
                              post={post}
                           />
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
