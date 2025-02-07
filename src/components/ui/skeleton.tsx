import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

// Tạo thêm component cho post skeleton
function PostSkeleton() {
  return (
    <div className="border-b border-zinc-400/15 p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-24" /> {/* Username */}
            <Skeleton className="h-4 w-4 rounded-full" /> {/* Badge */}
            <Skeleton className="h-4 w-16" /> {/* Time */}
          </div>
          <Skeleton className="h-20 w-full mb-4" /> {/* Content */}
          <div className="flex justify-between max-w-md">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-8 w-8 rounded-full"
              /> /* Action buttons */
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tạo component cho comment skeleton
function CommentSkeleton() {
  return (
    <div className="border-b border-zinc-400/15 p-4">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-20" /> {/* Username */}
            <Skeleton className="h-4 w-4 rounded-full" /> {/* Badge */}
            <Skeleton className="h-4 w-16" /> {/* Time */}
          </div>
          <Skeleton className="h-12 w-full" /> {/* Comment content */}
        </div>
      </div>
    </div>
  );
}

export { Skeleton, PostSkeleton, CommentSkeleton };
