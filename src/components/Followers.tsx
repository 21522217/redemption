"use client";

import React, { useEffect, useState } from "react";
import { getFollowers } from "@/lib/firebase/apis/follow.server";
import { User } from "@/types/user";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";

interface FollowersProps {
  userId: string;
}

const Followers = ({ userId }: FollowersProps) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followersData = await getFollowers(userId);
        setFollowers(followersData as User[]);
      } catch (error) {
        console.error("Error fetching followers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (followers.length === 0) {
    return <div className="text-center text-gray-500">No followers yet.</div>;
  }

  return (
    <div className="space-y-4">
      {followers.map((follower) => (
        <div key={follower.id} className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={follower.profilePicture} alt={follower.username} />
            <AvatarFallback>
              <UserIcon className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">
              {follower.firstName} {follower.lastName}
            </div>
            <div className="text-sm text-gray-500">@{follower.username}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Followers;
