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


export default function SettingButton() {
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
                  <DropdownMenuItem className="bg-popover px-2 py-3 text-md rounded-xl">
                     Appearance
                  </DropdownMenuItem>
               </DropdownMenuTrigger>
               <DropdownMenuContent>
                  <DropdownMenuItem className="focus:bg-popover">
                     <ThemeSwitcher />
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuItem className="bg-popover px-2 py-3 text-md rounded-xl">
               Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="bg-popover px-2 py-3 text-md rounded-xl">
               Report a problem
            </DropdownMenuItem>
            <DropdownMenuItem className="bg-popover px-2 py-3 text-md rounded-xl text-red-600 focus:text-red-600 ">
               Log out
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
