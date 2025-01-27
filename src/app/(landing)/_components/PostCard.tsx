"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

const PostCard = () => {
  return (
    <div className="py-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="font-bold text-neutral-950">
              John Doe
            </span>
          </div>
          <p className="text-[15px] leading-normal mb-3">
            This is a hardcoded post content.
          </p>

          <div className="flex items-center gap-6 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-0 hover:text-red-500"
            >
              <Heart
                className="h-[18px] w-[18px] fill-red-500 text-red-500"
              />
              <span className="ml-1 text-sm">
                1,234
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-0">
              <MessageCircle className="h-[18px] w-[18px]" />
              <span className="ml-1 text-sm">
                567
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-0">
              <Repeat2 className="h-[18px] w-[18px]" />
              <span className="ml-1 text-sm">
                89
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-0">
              <Share className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </div>
      <Separator className="bg-neutral-200" />
    </div>
  );
};

export default PostCard;
