"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { User } from "@/types/user";
import userData from "@/data/users-data.json";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4">
        {/* Search Header */}
        <div className="flex items-center justify-between py-3">
          <h1 className="text-xl font-semibold text-neutral-950">Tìm kiếm</h1>
          <button className="rounded-full p-2 hover:bg-neutral-100">
            <span className="text-2xl">⋯</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="rounded-[2rem] bg-white p-4 shadow-[0_0_1px_rgba(0,0,0,0.3)]">
          {/* Search Input */}
          <div className="relative mb-6">
            <div className="relative rounded-full border border-neutral-200 bg-neutral-100">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <Search className="h-5 w-5 text-neutral-500" />
              </div>
              <Input
                type="text"
                placeholder="Tìm kiếm"
                className="border-0 bg-transparent pl-10 pr-10 text-neutral-950 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <SlidersHorizontal className="h-5 w-5 text-neutral-500" />
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-neutral-500">
              Gợi ý theo dõi
            </div>

            {/* User List */}
            <div className="space-y-4">
              {userData.users.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-start justify-between border-b border-neutral-200 pb-4 last:border-0"
                >
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback>
                        {user.displayName
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                      {/* Tên hiển thị và verified */}
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-neutral-950">
                          {user.displayName}
                        </span>
                        {user.isVerified && (
                          <span className="text-xs font-medium text-blue-500">
                            verified
                          </span>
                        )}
                      </div>
                      {/* Tên người dùng */}
                      <span className="text-sm text-neutral-500">
                        {user.username}
                      </span>
                      {/* Bio */}
                      <span className="text-sm text-neutral-500">
                        {user.bio}
                      </span>
                      {/* Số người theo dõi */}
                      <span className="text-sm text-neutral-500">
                        {user.followers >= 1000
                          ? `${(user.followers / 1000).toFixed(1)}K`
                          : user.followers.toLocaleString()}{" "}
                        người theo dõi
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="h-8 rounded-full border-neutral-200 text-sm font-medium text-neutral-950 hover:bg-neutral-100"
                  >
                    Theo dõi
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
