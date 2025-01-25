"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import firebase_app from "@/lib/firebase/config";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLogin } = useAuth();
  const auth = getAuth(firebase_app);

  const handleAuthAction = () => {
    if (isLogin) {
      signOut(auth).then(() => {
        router.push("/login");
      });
    } else {
      router.push("/login");
    }
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="w-full flex items-center justify-between px-4 py-3">
        <div className="w-full text-center gap-4 text-xl font-semibold">
          {pathname?.replace("/", "") || "Home"}
        </div>
        <div className="flex items-center space-x-4">
          {isLogin && (
            <div className="text-sm text-gray-600">
              {user?.email || "Welcome"}
            </div>
          )}
          <Button
            onClick={handleAuthAction}
            variant={isLogin ? "destructive" : "default"}
          >
            {isLogin ? "Log out" : "Log in"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
