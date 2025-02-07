"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserReposts } from "@/lib/firebase/apis/repost.server";
import { convertTimestamp } from "@/lib/utils";
import { Post } from "@/types/post";
import { User } from "@/types/user";

// Repost here represent post but not the user's own post
const Reposts = ({ userId }: { userId: string }) => {
  const {
    data: reposts,
    error,
    isLoading,
  } = useQuery<Array<Post & { user: User }>>({
    queryKey: ["reposts", userId],
    queryFn: async () => await getUserReposts(userId),
  });

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error loading reposts</div>;

  return (
    <div className="reposts-container">
      {reposts?.map((repost) => (
        <div key={repost.id} className="repost-card">
          <p className="repost-content">
            {repost.content || "No content available"}
          </p>
          <div className="repost-meta">
            <span className="repost-author">
              Author: {repost.user?.username || "Unknown"}
            </span>
            <span className="repost-date">
              Posted on: {convertTimestamp(repost.createdAt)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reposts;
