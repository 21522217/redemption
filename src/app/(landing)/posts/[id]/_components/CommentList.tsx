"use client";

import React, { useEffect, useState } from "react";
import { getPostUserById } from "@/lib/firebase/apis/posts.server";

import { Post } from "@/types/post";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";
interface CommentListProps {
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [post, setPost] = useState<(Post & { user: User }) | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedPost = await getPostUserById(postId);
      setPost(fetchedPost);
    };

    fetchComments();
  }, [postId]);

  return <div></div>;
};

export default CommentList;
