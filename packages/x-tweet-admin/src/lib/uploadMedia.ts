// src/lib/uploadMedia.ts

import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// -------------------------
// Supabase setup
// -------------------------
const supabaseUrl = "https://xadpyaiwqrrwzlqrlysz.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// -------------------------
// Cloudinary setup
// -------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------------
// Types (ensure TS never breaks)
// -------------------------
export interface MediaRow {
  id: string;
  url: string;
  type: string;
  uploader_id: string;
  tweet_id: string | null;
  created_at: string;
}

// -------------------------
// Helpers
// -------------------------
export function generateFileName(mediaType: string) {
  const id = uuidv4();
  const ext = mediaType.split("/")[1];
  return { id, fileName: `${id}.${ext}` };
}

export function isValidMediaType(type: string) {
  return ["image/jpeg", "image/png", "video/mp4", "video/webm"].includes(type);
}

// -------------------------
// MAIN FUNCTION
// Cloudinary Upload + Supabase Insert
// -------------------------
export async function uploadAndInsertMedia({
  filePath,
  mediaType,
  uploaderId,
  tweetId,
}: {
  filePath: string;
  mediaType: string;
  uploaderId: string;
  tweetId?: string;
}) {
  if (!isValidMediaType(mediaType)) {
    throw new Error("Invalid media type");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }

  const { id } = generateFileName(mediaType);
  const resourceType = mediaType.startsWith("video") ? "video" : "image";

  try {
    // -------------------------
    // 1. Upload to Cloudinary
    // -------------------------
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,
      public_id: id,
    });

    // -------------------------
    // 2. Insert into Supabase
    // -------------------------
    const { data, error } = await supabase
      .from("media")
      .insert<MediaRow>({
        id,
        url: uploadResult.secure_url,
        type: resourceType,
        uploader_id: uploaderId,
        tweet_id: tweetId ?? null,
        created_at: new Date().toISOString(),
      })
      .select(); // <-- ensures TS infers correct type = MediaRow[]

    if (error) throw error;

    return {
      cloudinary: uploadResult,
      supabase: data ?? [], // always array
    };
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
}
