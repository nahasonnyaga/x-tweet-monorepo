/**
 * sitemap-index.js
 * Builds sitemap files and a sitemap index from an input list of sitemap blocks.
 * Example usage: node sitemap-index.js
 */

import { writeFileSync } from 'fs';
import { buildSitemap } from './src/lib/sitemap.js'; // uses earlier sitemap builder

// Example sitemaps array (replace with dynamic fetch from Supabase/Firebase)
const sitemaps = {
  '/sitemap-pages.xml': [
    { loc: 'https://x-tweet.app/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
    { loc: 'https://x-tweet.app/about', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.3 }
  ],
  '/sitemap-profiles.xml': [
    // Add profile URLs programatically
  ],
  '/sitemap-posts.xml': [
    // Add posts programatically
  ]
};

// write each sitemap
Object.entries(sitemaps).forEach(([path, urls]) => {
  const xml = buildSitemap(urls);
  const outPath = '.' + path; // writes to repo root; adapt to write to public/ or bucket
  writeFileSync(outPath, xml, 'utf8');
  console.log('Wrote', outPath);
});

// build sitemap index
const header = '<?xml version="1.0" encoding="UTF-8"?>\\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\\n';
const body = Object.keys(sitemaps).map(p => {
  const loc = `https://x-tweet.app${p}`;
  const lastmod = new Date().toISOString();
  return `  <sitemap>\\n    <loc>${loc}</loc>\\n    <lastmod>${lastmod}</lastmod>\\n  </sitemap>`;
}).join('\\n');
const footer = '\\n</sitemapindex>';
writeFileSync('./sitemap-index.xml', header + body + footer, 'utf8');
console.log('Wrote sitemap-index.xml');
