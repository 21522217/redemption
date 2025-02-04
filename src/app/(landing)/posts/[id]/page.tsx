"use client";

import React from "react";
import { useParams } from "next/navigation";
import CommentList from "./_components/CommentList";

const PostDetail = () => {
  const params = useParams();
  const { id } = params;

  if (typeof id !== "string") {
    return <div>Error: Invalid post ID</div>;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <span>{id}</span>
      <CommentList postId={id} />
    </div>
  );
};

export default PostDetail;
