"use client";

import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from "./ui/dropdown-menu";
import ThemeSwitcher from "./ThemeToggle";
import DynamicImage from "./custom/SquareImage";
import {
  FaHeart,
  FaHome,
  FaPlus,
  FaSearch,
  FaUser,
  FaPinterest,
  FaList,
  FaChevronRight,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { showAuthModal } from "./auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { isLogin } = useAuth();

  /**
   * Handle button clicks with authentication checks.
   * @param path The path to navigate to.
   */
  const handleButtonClick = (path: string): void => {
    if (!isLogin) {
      console.log("User not logged in. Showing Auth Modal.");
      showAuthModal();
    } else {
      router.push(path);
    }
  };

  return (
    <div className="fixed flex flex-col min-h-screen w-[50px] gap-6 p-2 justify-between items-center">
      {/* Logo */}
      <DynamicImage src="/redemption.png" alt="X" className="object-cover" />

      {/* Navigation Buttons */}
      <div className="flex flex-col">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground flex items-center justify-center"
          onClick={() => router.push("/")}
        >
          <FaHome size={45} />
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/search")}
        >
          <FaSearch size={45} />
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <FaPlus size={45} />
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <FaHeart size={45} />
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => handleButtonClick("/profile")}
        >
          <FaUser size={45} />
        </Button>
      </div>

      {/* Dropdown Menu */}
      <div className="relative">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
        >
          <FaPinterest size={45} />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <FaList className="text-primary-foreground cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50 outline-none border-none absolute z-100 w-56 rounded-md bottom-[100%]">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row w-full items-center justify-between p-2 bg-transparent">
                Appearance
                <FaChevronRight className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-51">
                <DropdownMenuItem>
                  {/* Theme Switcher */}
                  <ThemeSwitcher />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-row w-full items-center justify-between p-2 bg-transparent">
              Report a problem
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
