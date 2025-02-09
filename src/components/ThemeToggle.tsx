"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Moon, Sun } from "lucide-react";
import { Label } from "./ui/label";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    toggleTheme();
    document.documentElement.setAttribute("data-theme", value);
    localStorage.setItem("theme", value);
  };

  return (
    <div className="flex flex-col items-center w-40">
      <Label className="text-lg font-medium">Appearance</Label>
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={handleThemeChange}
        className="grid w-full grid-cols-2 rounded-lg bg-muted p-1"
      >
        <ToggleGroupItem
          value="light"
          aria-label="Light mode"
          className="rounded-md px-3 py-2"
        >
          <Sun className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="dark"
          aria-label="Dark mode"
          className="rounded-md px-3 py-2"
        >
          <Moon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
