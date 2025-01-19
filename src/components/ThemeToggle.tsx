"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    toggleTheme();
    document.documentElement.setAttribute("data-theme", value);
    localStorage.setItem("theme", value);
  };

  return (
    <div className="flex flex-row bg-transparent w-40">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium">Appearance</h2>
      </div>
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={handleThemeChange}
        className="grid w-full grid-cols-3 rounded-lg bg-muted p-1"
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
