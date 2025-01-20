"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Media } from "@/types/media";

interface MediaGalleryProps {
  media: Media[];
  className?: string;
}

export function MediaGallery({ media, className }: MediaGalleryProps) {
  // Nếu không có media thì return null
  if (!media.length) return null;

  // Nếu chỉ có 1 media thì hiển thị full width
  if (media.length === 1) {
    const item = media[0];
    return (
      <div
        className={cn("relative mt-3 rounded-xl overflow-hidden", className)}
      >
        {item.type === "video" ? (
          <video
            src={item.url}
            poster={item.thumbnail}
            controls
            className="w-full h-auto"
            style={{ aspectRatio: item.aspectRatio }}
          />
        ) : (
          <Image
            src={item.url}
            alt={item.alt || ""}
            width={item.width}
            height={item.height}
            className="w-full h-auto"
          />
        )}
      </div>
    );
  }

  // Nếu có nhiều media thì hiển thị dạng scroll ngang
  return (
    <div className={cn("mt-3 relative", className)}>
      <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {media.map((item, index) => (
          <div
            key={index}
            className="flex-none w-[calc(100%-40px)] first:ml-0 ml-2 snap-center"
          >
            <div className="rounded-xl overflow-hidden aspect-[4/3]">
              {item.type === "video" ? (
                <video
                  src={item.url}
                  poster={item.thumbnail}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt || ""}
                  width={item.width}
                  height={item.height}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
