"use client";

import React from "react";
import { useRouter } from "next/router";
import { MoreHorizontal } from "lucide-react";

interface HeaderProps {
  title: string;
  rightMost: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, rightMost }) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center p-4">
      <button onClick={() => router.back()} className="text-blue-500">
        Back
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center">
        {rightMost}
        <MoreHorizontal className="ml-2" />
      </div>
    </div>
  );
};

export default Header;
