"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUserBaseInfo } from "@/lib/firebase/apis/user.server";
import { useRouter } from "next/navigation";

const UserAvatar = ({ userId }: { userId: string | null }) => {
  const [userBaseInfo, setUserBaseInfo] = useState<{
    profilePicture: string;
    isVerified: boolean;
    firstName: string;
  }>({ profilePicture: "", isVerified: false, firstName: "" });

  useEffect(() => {
    if (userId) {
      fetchUserBaseInfo(userId).then((info) => setUserBaseInfo(info));
    }
  }, [userId]);

  if (!userId) {
    return (
      <Avatar className="h-10 w-10">
        <AvatarImage src="" alt="" />
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  const router = useRouter();
  return (
    <Avatar
      onClick={() => {
        //console.log("Clicked on user avatar");
        router.push(`/profile`);
      }}
      className="h-10 w-10"
    >
      <AvatarImage src={userBaseInfo.profilePicture || ""} alt={userBaseInfo.firstName || ""} />
      <AvatarFallback>
        {userBaseInfo.firstName
          ?.split(" ")
          .map((name) => name[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
