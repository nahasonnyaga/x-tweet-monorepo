// src/lib/mediaUtils.ts

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// -------------------------
// Supabase setup
// -------------------------
const supabaseUrl = 'https://xadpyaiwqrrwzlqrlysz.supabase.co';
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
// Helpers
// -------------------------
export function generateFileName(extension: string) {
  return `${uuidv4()}.${extension}`;
}

export function isValidMediaType(type: string) {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
  return allowedTypes.includes(type);
}

// -------------------------
// Upload media
// -------------------------
export async function uploadMedia({
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
  if (!isValidMediaType(mediaType)) throw new Error('Invalid media type');
  if (!fs.existsSync(filePath)) throw new Error('File not found');

  const extension = mediaType.split('/')[1];
  const fileName = generateFileName(extension);

  try {
    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: mediaType.startsWith('video') ? 'video' : 'image',
      public_id: fileName.split('.')[0],
    });

    // Save metadata to Supabase
    const { data, error } = await supabase.from('media').insert([
      {
        id: fileName.split('.')[0],
        url: uploadResult.secure_url,
        type: mediaType,
        uploader_id: uploaderId,
        tweet_id: tweetId || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return { cloudinary: uploadResult, supabase: data };
  } catch (err) {
    console.error('Upload failed:', err);
    throw err;
  }
}
