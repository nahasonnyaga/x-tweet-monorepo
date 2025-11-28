/**
 * auto-tag.js
 * Lightweight auto-tagging: extracts candidate tags from post text and returns normalized tags.
 */

import { extractKeywords } from './trending.js';

export function autogenerateTags(text, maxTags = 8) {
  const freqs = extractKeywords(text);
  const sorted = Object.entries(freqs).sort((a,b) => b[1]-a[1]).map(s => s[0]);
  // prefer multi-word phrases by simple split (not perfect but ok)
  const tags = [];
  for (const t of sorted) {
    const tag = t.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase();
    if (tag.length < 2) continue;
    if (!tags.includes(tag)) tags.push(tag);
    if (tags.length >= maxTags) break;
  }
  return tags.map(t => (t.startsWith('#') ? t : `#${t}`));
}

// quick demo run
if (process.argv[1] && process.argv[1].endsWith('auto-tag.js')) {
  const sample = "Announcing the new X-Tweet video pipeline with Cloudinary and BunnyNet CDN for faster media delivery.";
  console.log('Tags:', autogenerateTags(sample, 6));
}
