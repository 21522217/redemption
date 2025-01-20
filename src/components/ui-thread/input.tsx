import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:border-neutral-800 dark:bg-black dark:placeholder:text-neutral-400 dark:focus:ring-neutral-700",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
