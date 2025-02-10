"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserReposts } from "@/lib/firebase/apis/repost.server";
import { convertTimestamp } from "@/lib/utils";
import { Post } from "@/types/post";
import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Reposts = ({ userId }: { userId: string }) => {
  const {
    data: reposts,
    error,
    isLoading,
  } = useQuery<Array<Post & { user: User }>>({
    queryKey: ["reposts", userId],
    queryFn: async () => await getUserReposts(userId),
  });

  const router = useRouter();

  if (isLoading)
    return (
      <div className="loading">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  if (error) return <div className="error">Error loading reposts</div>;

  return (
    <div className="reposts-container">
      {reposts?.map((repost) => (
        <article key={repost.id} className="border-b border-zinc-400/15 p-4">
          <div className="flex items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap flex-row">
                <Avatar
                  onClick={() => router.push(`/profile/${repost.user.id}`)}
                  className="w-10 h-10"
                >
                  <AvatarImage
                    src={repost.user.profilePicture}
                    alt={repost.user.username}
                  />
                  <AvatarFallback>
                    {repost.user.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span
                  onClick={() => router.push(`/profile/${repost.user.id}`)}
                  className="font-bold hover:underline"
                >
                  {repost.user.username}
                </span>
                {repost.user.isVerified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                )}
                <span className="text-zinc-500">·</span>
                <span className="text-zinc-500">
                  {convertTimestamp(repost.createdAt)}
                </span>
              </div>
              <p className="mt-1 break-words whitespace-pre-wrap">
                {repost.content || "No content available"}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Reposts;
