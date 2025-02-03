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

const PostDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-col p-2 gap-2 w-[230px]"
      >
        <DropdownMenuItem className="flex justify-between w-full hover:cursor-pointer">
          <span className="text-xl text-red-500">Block</span>
          <Lock className="w-5 h-5 text-red-500" />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between w-full hover:cursor-pointer">
          <span className="text-xl text-red-500">Report</span>
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between w-full hover:cursor-pointer">
          <span className="text-xl">Copy Link</span>
          <Link className="w-5 h-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostDropdown;
