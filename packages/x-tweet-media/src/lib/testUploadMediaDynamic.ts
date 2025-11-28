// src/lib/testUploadMediaDynamic.ts
import { uploadMedia } from './mediaUtils.ts'; // ✅ include .ts extension
import path from 'path';

// Get arguments from command line
const [,, filePath, mediaType, uploaderId, tweetId] = process.argv;

if (!filePath || !mediaType || !uploaderId) {
  console.error(
    'Usage: ts-node testUploadMediaDynamic.ts <filePath> <mediaType> <uploaderId> [tweetId]'
  );
  process.exit(1);
}

async function main() {
  try {
    console.log('Uploading media...');

    const absolutePath = path.resolve(filePath);

    // Upload media (image or video)
    const result = await uploadMedia({
      filePath: absolutePath,
      mediaType,
      uploaderId,
      tweetId,
    });

    console.log('Media uploaded successfully!');
    console.log('Cloudinary result:', result.cloudinary);
    console.log('Supabase result:', result.supabase);

  } catch (err) {
    console.error('Error uploading media:', err);
  }
}

main();
