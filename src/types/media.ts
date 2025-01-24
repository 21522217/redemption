export interface Media {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  aspectRatio: number;
  width: number;
  height: number;
  alt?: string;
  duration?: number;
}
