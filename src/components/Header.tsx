"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-row">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost">{pathname || "Home"}</Button>
        </div>
        <Button
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </Button>
      </div>
    </div>
  );
};

export default Header;
