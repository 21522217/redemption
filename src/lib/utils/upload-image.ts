export interface ImgurUploadResponse {
  status: number;
  success: boolean;
  data: {
    id: string;
    deletehash: string;
    account_id?: number;
    account_url?: string;
    ad_type?: number | null;
    ad_url?: string | null;
    title?: string | null;
    description?: string | null;
    name?: string;
    type: string;
    width: number;
    height: number;
    size: number;
    views: number;
    section?: string | null;
    vote?: string | null;
    bandwidth: number;
    animated: boolean;
    favorite: boolean;
    in_gallery: boolean;
    in_most_viral: boolean;
    has_sound: boolean;
    is_ad: boolean;
    nsfw?: boolean | null;
    link: string;
    tags: string[];
    datetime: number;
    mp4?: string;
    hls?: string;
  };
}
