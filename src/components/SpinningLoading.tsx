"use client";

import { Loader2 } from "lucide-react";

export default function SpinningLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-transparent min-h-[100vhd]">
      <Loader2 className="animate-spin" />
    </div>
  );
}
