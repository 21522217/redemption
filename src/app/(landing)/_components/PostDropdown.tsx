"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, MoreHorizontal, Lock, AlertTriangle } from "lucide-react";
import { showReportModal } from "@/components/ReportModal";
import { Post } from "@/types/post";
import { toast } from "react-toastify";

const PostDropdown = ({ post }: { post: Post }) => {
  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/posts/${post.id}`;
    navigator.clipboard.writeText(postUrl).then(
      () => {
        toast.success("Link copied to clipboard");
      },
      () => {
        toast.error("Failed to copy link");
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full p-1.5 transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-col p-1.5 gap-1 w-[230px] rounded-xl border-[#999999] dark:border-[#999999]/40"
      >
        <DropdownMenuItem
          className="flex justify-between w-full px-4 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          onClick={() => showReportModal(post.id)}
        >
          <span className="text-[15px] font-medium text-red-500">Report</span>
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#999999] dark:bg-[#999999]/40" />
        <DropdownMenuItem
          className="flex justify-between w-full px-4 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          onClick={handleCopyLink}
        >
          <span className="text-[15px] font-medium">Copy Link</span>
          <Link className="w-4 h-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostDropdown;
