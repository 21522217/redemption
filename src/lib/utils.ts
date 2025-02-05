import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeAgo = (
  date: Timestamp | number | Date | string | undefined
) => {
  if (!date) return "";

  let parsedDate: Date;

  if (date instanceof Timestamp) {
    parsedDate = date.toDate();
  } else if (typeof date === "number") {
    parsedDate = new Date(date);
  } else if (typeof date === "string") {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "";
    parsedDate = parsed;
  } else if (date instanceof Date) {
    parsedDate = date;
  } else {
    return "";
  }

  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - parsedDate.getTime()) / 60000
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  return `${Math.floor(diffInHours / 24)}d`;
};
export const formatNumber = (num: number) =>
  num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();
