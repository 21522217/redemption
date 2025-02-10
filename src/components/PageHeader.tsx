"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const titleMatching = {
  "/": "home",
  "/profile": "profile",
  "/posts": "posts",
  "/search": "search",
  "/activity": "activity",
  "/notifications": "notifications",
  "/settings": "settings",
  "/help": "help",
  "/about": "about",
  "/contact": "contact",
  "/terms": "terms",
};

const PageHeader = () => {
  const pathname = usePathname();
  const [title, setTitle] = useState(() => {
    const matchedTitle =
      titleMatching[pathname as keyof typeof titleMatching] || "home";
    return matchedTitle;
  });

  useEffect(() => {
    const matchedTitle =
      titleMatching[pathname as keyof typeof titleMatching] || "home";
    setTitle(matchedTitle);
  }, [pathname]);

  return (
    <div className="sticky top-0 z-20 flex flex-row w-full bg-background">
      <h1 className="flex flex-col w-full items-center justify-center text-2xl font-bold h-14">
        {title.toUpperCase()}
      </h1>
    </div>
  );
};

export default PageHeader;
