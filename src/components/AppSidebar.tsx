"use client";

import { Button } from "./ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from "./ui/dropdown-menu";

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

const AppSidebar = () => {
  const router = useRouter();

  return (
    <div className="">
      <SidebarProvider>
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
                  //onClick={() => router.push("/")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Home />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  //onClick={() => router.push("/")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Search />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  //onClick={() => router.push("/")}
                  className="w-fit h-full bg-accent py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Plus />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  //onClick={() => router.push("/")}
                  className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                  variant="ghost"
                >
                  <Heart />
                </Button>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button
                  //onClick={() => router.push("/")}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      //onClick={() => router.push("/")}
                      className="w-fit h-full py-3 px-5 [&_svg]:size-7 rounded-xl"
                      variant="ghost"
                    >
                      <Menu />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        Appearance
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <ThemeSwitcher />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      Report a problem
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>

    </div>
  );
};

export default AppSidebar;
