"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "firebase/auth";

const UserAvatar = ({ user }: { user: User | null }) => {
  if (!user) return null;

  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
      <AvatarFallback>
        {user.displayName
          ?.split(" ")
          .map((name) => name[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
