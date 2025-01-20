"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Media } from "@/types/media";
import { useState, useRef, MouseEvent, TouchEvent, useEffect } from "react";

interface MediaGalleryProps {
  media: Media[];
  className?: string;
}

export function MediaGallery({ media, className }: MediaGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [transform, setTransform] = useState(0);

  // Thêm event listeners cho window để handle mouse move và mouse up
  useEffect(() => {
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const now = Date.now();
        const timeElapsed = now - lastTime;
        const dx = e.pageX - lastX;

        if (timeElapsed > 0) {
          setSpeed(dx / timeElapsed);
        }

        setLastX(e.pageX);
        setLastTime(now);

        if (scrollRef.current) {
          handleElasticScroll(e.pageX);
          scrollRef.current.scrollLeft = scrollLeft - (e.pageX - startX);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging && scrollRef.current) {
        setTransform(0);
        const momentum = speed * 100;
        let currentSpeed = speed;
        const decelerate = () => {
          if (Math.abs(currentSpeed) > 0.1 && scrollRef.current) {
            scrollRef.current.scrollLeft -= currentSpeed * 16;
            currentSpeed *= 0.95;
            requestAnimationFrame(decelerate);
          }
        };
        decelerate();
        setIsDragging(false);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, lastTime, lastX, scrollLeft, speed, startX]);

  const handleElasticScroll = (currentX: number) => {
    if (!scrollRef.current) return;

    const maxScroll =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const currentScroll = scrollLeft - (currentX - startX);

    if (currentScroll < 0) {
      // Kéo quá về bên trái
      setTransform(Math.sqrt(Math.abs(currentScroll)) * 0.5); // Đổi dấu để sửa chiều bounce
    } else if (currentScroll > maxScroll) {
      // Kéo quá về bên phải
      setTransform(Math.sqrt(currentScroll - maxScroll) * -0.5); // Đổi dấu để sửa chiều bounce
    } else {
      setTransform(0);
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setLastX(e.pageX);
    setLastTime(Date.now());
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
    setSpeed(0);
    setTransform(0);
  };

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setLastX(e.touches[0].pageX);
    setLastTime(Date.now());
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
    setSpeed(0);
    setTransform(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;

    const now = Date.now();
    const timeElapsed = now - lastTime;
    const dx = e.touches[0].pageX - lastX;

    if (timeElapsed > 0) {
      setSpeed(dx / timeElapsed);
    }

    setLastX(e.touches[0].pageX);
    setLastTime(now);

    if (scrollRef.current) {
      handleElasticScroll(e.touches[0].pageX);
      scrollRef.current.scrollLeft = scrollLeft - (e.touches[0].pageX - startX);
    }
  };

  // Sắp xếp media để video lên đầu
  const sortedMedia = [...media].sort((a, b) => {
    if (a.type === "video" && b.type !== "video") return -1;
    if (a.type !== "video" && b.type === "video") return 1;
    return 0;
  });

  if (!media.length) return null;

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

  return (
    <div className={cn("mt-3 relative", className)} ref={containerRef}>
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto touch-pan-x cursor-grab scrollbar-none overscroll-x-contain",
          { "cursor-grabbing": isDragging }
        )}
        style={{
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          transform: `translateX(${transform}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
      >
        {sortedMedia.map((item, index) => (
          <div
            key={index}
            className="flex-none w-[calc(100%-40px)] first:ml-0 ml-2"
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
                  draggable={false}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
