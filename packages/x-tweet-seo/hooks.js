/**
 * SEO Hooks for all X-Tweet Microservices
 * Can be called from any repo (profiles, videos, reactions, etc.)
 */

import { generateAIMetadata } from "./ai-meta.js";
import { generateOGImage } from "./og-generator.js";

export async function getSEOForContent({ type, id, text, url }) {
  const aiMeta = await generateAIMetadata(url, text);
  const ogImage = await generateOGImage(text);

  return {
    ...aiMeta,
    ogImage,
    canonical: url,
    type,
    id
  };
}
