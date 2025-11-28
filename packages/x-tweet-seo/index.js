import { generateAIMetadata } from "./ai-meta.js";
import { generateOGImage } from "./og-generator.js";
import { discoverRSS } from "./rss-scanner.js";
import { getSEOForContent } from "./hooks.js";
import * as structured from "./structured-data.js";
import { topKeywordsFromTexts, extractKeywords } from "./trending.js";
import { autogenerateTags } from "./auto-tag.js";

export {
  generateAIMetadata,
  generateOGImage,
  discoverRSS,
  getSEOForContent,
  structured,
  topKeywordsFromTexts,
  extractKeywords,
  autogenerateTags
};

console.log("X-Tweet SEO Engine Loaded with extended modules.");
