import { v2 as cloudinary } from 'cloudinary';
import { env } from '../env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File | string) {
  try {
    const uploadResult = await cloudinary.uploader.upload(file as string, {
      folder: 'x-tweet',
      resource_type: 'auto',
    });
    return uploadResult;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw err;
  }
}
