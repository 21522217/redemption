"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { showCreatePostModal } from "@/components/CreatePostModal";

const PostCond = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-row w-full items-center space-x-2">
      <Avatar user={user} />
      <span
        className="text-muted-foreground cursor-pointer flex w-full"
        onClick={showCreatePostModal}
      >
        What&apos;s new?
      </span>
      <Button variant="default" className="rounded-lg h-10">
        Post
      </Button>
    </div>
  );
};

export default PostCond;
