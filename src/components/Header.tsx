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
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold text-gray-800">
            {pathname?.replace("/", "") || "Home"}
          </div>
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
