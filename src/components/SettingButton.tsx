"use client";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from "./ui/dropdown-menu";
import ThemeSwitcher from "./ThemeToggle";
import useLogout from "@/lib/firebase/logout";
import { useAuth } from "@/contexts/AuthContext";
import { showAuthModal } from "./auth/AuthModal";

export default function SettingButton() {
  const { logout } = useLogout();
  const { isLogin } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
          variant="ghost"
        >
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit py-4 px-4 rounded-xl font-medium">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <DropdownMenuItem className="bg-popover px-2 py-3 text-md rounded-xl cursor-pointer hover:bg-accent/50">
              Appearance
            </DropdownMenuItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="focus:bg-popover">
              <ThemeSwitcher />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isLogin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="bg-popover px-2 py-3 text-md rounded-xl text-red-600 hover:text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/50"
            >
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => showAuthModal()}
            className="bg-popover px-2 py-3 text-md rounded-xl text-blue-500 hover:text-blue-600 focus:text-blue-600 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50"
          >
            Sign in
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
