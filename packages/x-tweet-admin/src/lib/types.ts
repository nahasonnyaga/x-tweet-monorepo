// src/lib/types.ts

export type MediaType = 'image/jpeg' | 'image/png' | 'video/mp4' | 'video/webm';

export interface UploadMediaParams {
  filePath: string;
  mediaType: MediaType;
  uploaderId: string;
  tweetId?: string;
}

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: 'image' | 'video';
  width: number;
  height: number;
  bytes: number;
  duration?: number;
  audio?: {
    codec: string;
    bit_rate: string;
    frequency: number;
    channels: number;
    channel_layout: string;
  };
  video?: {
    codec: string;
    pix_format: string;
    level: number;
    profile: string;
    bit_rate: number;
    dar: string;
    time_base: string;
  };
}
