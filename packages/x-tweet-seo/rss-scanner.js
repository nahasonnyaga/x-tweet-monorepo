/**
 * RSS Feed Discovery System
 * Scans and extracts feeds from URLs (blog posts, user links, etc.)
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function discoverRSS(url) {
  try {
    const html = await fetch(url).then(res => res.text());
    const $ = cheerio.load(html);

    const feeds = [];

    $("link[type='application/rss+xml'], link[type='application/atom+xml']")
      .each((i, el) => {
        feeds.push({
          title: $(el).attr("title") || "RSS",
          href: new URL($(el).attr("href"), url).href
        });
      });

    return feeds;
  } catch (e) {
    console.error("RSS Scan Error:", e);
    return [];
  }
}
