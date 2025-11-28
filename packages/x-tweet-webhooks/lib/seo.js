import { createMeta } from '../../x-tweet-seo/ai-meta.js';
import { createOG } from '../../x-tweet-seo/og-generator.js';
import { addToSitemap } from '../../x-tweet-seo/generate-sitemaps.js';
import { updateKeywords } from '../../x-tweet-seo/trending.js';

export async function generateMetaTags(post) {
  return createMeta(post);
}

export async function generateOGImage(post) {
  return createOG(post); // assumes Cloudinary upload inside
}

export async function generateSitemap(post) {
  return addToSitemap(post);
}

export async function updateTrending(post) {
  return updateKeywords(post);
}
