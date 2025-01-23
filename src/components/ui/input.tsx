import * as React from "react";

import { cn } from "@/lib/utils";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [isShowPassword, setIsShowPassword] = React.useState<boolean>(false);

    return (
      <div className="relative">
        <input
          type={type === "password" && isShowPassword ? "text" : type}
          className={cn(
            "flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {type === "password" && (
          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setIsShowPassword(!isShowPassword)}
          >
            {isShowPassword ? (
              <AiFillEyeInvisible className="h-5 w-5" />
            ) : (
              <AiFillEye className="h-5 w-5" />
            )}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
