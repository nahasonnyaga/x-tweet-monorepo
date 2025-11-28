// src/lib/testUpload.ts
import 'dotenv/config'; // loads .env automatically
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// -------------------------
// Supabase setup
// -------------------------
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
function generateFileName(extension: string) {
  return `${uuidv4()}.${extension}`;
}

function isValidMediaType(type: string) {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
  return allowedTypes.includes(type);
}

// -------------------------
// Upload media
// -------------------------
async function uploadMedia({
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

  // Upload to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    resource_type: mediaType.startsWith('video') ? 'video' : 'image',
    public_id: fileName.split('.')[0],
  });

  // Store metadata in Supabase
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
}

// -------------------------
// Test upload
// -------------------------
(async () => {
  try {
    const filePath = path.resolve(process.cwd(), 'src/lib/example.png'); // absolute path to your test file
    const result = await uploadMedia({
      filePath,
      mediaType: 'image/png',
      uploaderId: 'user-123',
      tweetId: 'tweet-456',
    });
    console.log('Upload result:', result);
  } catch (err) {
    console.error('Error uploading media:', err);
  }
})();
