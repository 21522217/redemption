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
} from "@/components/ui/sidebar"

import ThemeSwitcher from "./ThemeToggle";
import DynamicImage from "./custom/SquareImage";

import { useRouter } from "next/navigation";
import { Heart, Home, Menu, Pin, Plus, Search, User } from "lucide-react";
import SettingButton from "./SettingButton";

const AppSidebar = () => {
  const router = useRouter();

  return (
    <div>
      <SidebarProvider
        style={{
          width: "fit-content",
        }}
      >
        <Sidebar className="w-fit h-full px-1 border-none">
          <SidebarHeader>
            <DynamicImage
              src="/public/redemption.png"
              alt="logo"
              className="w-8 h-8"
            />
          </SidebarHeader>
          <SidebarContent className="flex flex-col place-content-center">
            <SidebarMenu className="items-center gap-4">
              <SidebarMenuItem>
                <Button
                  onClick={() => router.push("/")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Home />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  onClick={() => router.push("/search")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Search />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button

                  className="w-fit h-full bg-accent py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Plus />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  onClick={() => router.push("/activity")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Heart />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  onClick={() => router.push("/profile")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <User />
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu className="items-center gap-4">
              <SidebarMenuItem>
                <Button
                  //onClick={() => router.push("/")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Pin />
                </Button>
              </SidebarMenuItem>
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
