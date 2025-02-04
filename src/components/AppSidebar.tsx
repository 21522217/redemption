"use client";

import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import DynamicImage from "./custom/SquareImage";
import { Heart, Home, Plus, Search, User } from "lucide-react";
import SettingButton from "./SettingButton";
import { showCreatePostModal } from "./CreatePostModal";
import { showAuthModal } from "./auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLogin } = useAuth();

  const handleAuthClick = (route: string) => {
    if (!isLogin) {
      showAuthModal();
    } else {
      router.push(route);
    }
  };

  return (
    <div>
      <SidebarProvider
        style={{
          width: "fit-content",
        }}
      >
        <Sidebar className="w-fit h-full px-1 border-none">
          <SidebarHeader className="flex items-center justify-center">
            <div className="w-12 h-12 p-2 flex items-center justify-center">
              <Image
                src="/redemption-logo.svg"
                alt="Redemption Logo"
                width={48}
                height={48}
                priority
              />
            </div>
          </SidebarHeader>
          <SidebarContent className="flex flex-col place-content-center">
            <SidebarMenu className="items-center gap-4">
              <SidebarMenuItem>
                <Button
                  onClick={() => router.push("/")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Home className={pathname === "/" ? "fill-foreground" : ""} />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  onClick={() => router.push("/search")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Search
                    className={pathname === "/search" ? "fill-foreground" : ""}
                  />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  onClick={() => {
                    if (!isLogin) {
                      showAuthModal();
                    } else {
                      showCreatePostModal();
                    }
                  }}
                  className="w-fit h-full bg-accent py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Plus />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  onClick={() => handleAuthClick("/activity")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Heart
                    className={
                      pathname === "/activity" ? "fill-foreground" : ""
                    }
                  />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  onClick={() => handleAuthClick("/profile")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <User
                    className={pathname === "/profile" ? "fill-foreground" : ""}
                  />
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu className="items-center">
              <SidebarMenuItem>
                <SettingButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};

export default AppSidebar;
