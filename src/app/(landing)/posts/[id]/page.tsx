"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import CommentList from "./_components/CommentList";

const PostDetail = () => {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();

  if (typeof id !== "string") {
    return <div>Error: Invalid post ID</div>;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <CommentList postId={id} userId={user?.uid || ""} />
    </div>
  );
};

export default PostDetail;
