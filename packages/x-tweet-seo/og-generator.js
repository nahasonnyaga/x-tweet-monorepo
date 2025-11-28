/**
 * OG Image Generator
 * Creates dynamic preview images for posts, profiles, hashtags, etc.
 */

import crypto from "crypto";
import fetch from "node-fetch";

export async function generateOGImage(text) {
  try {
    // Cloudinary dynamic OG URL
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    if (cloudName) {
      const url = `https://res.cloudinary.com/${cloudName}/image/upload/l_text:Arial_60_bold:${encodeURIComponent(
        text
      )},co_rgb:ffffff,c_fit,w_1200,h_630/v1/og-img-template.png`;

      return url;
    }

    // Fallback: Vercel OG
    const vercelURL = `https://og.x-tweet.vercel.app/api/image?text=${encodeURIComponent(
      text
    )}`;

    return vercelURL;
  } catch (err) {
    console.error("OG Image Error:", err);
    return "https://x-tweet.com/default-og.png";
  }
}
