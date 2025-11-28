/**
 * trending.js
 * Simple trending/keyword extractor based on token frequency & noun extraction.
 * Exports a function that takes an array of texts and returns top N keywords.
 */

import nlp from 'compromise';

// small stopword list
const STOP = new Set([
  'the','is','and','in','to','a','of','for','on','with','that','this','it','as','are','was','be','by','an','or'
]);

export function extractKeywords(text) {
  const doc = nlp(text);
  // get nouns and topics
  const nouns = doc.nouns().out('array');
  const terms = nouns.length ? nouns : text.split(/\\W+/);
  const freqs = {};
  for (const t of terms) {
    if (!t) continue;
    const token = t.toLowerCase();
    if (STOP.has(token) || token.length < 2) continue;
    freqs[token] = (freqs[token] || 0) + 1;
  }
  return freqs;
}

export function topKeywordsFromTexts(texts, top = 20) {
  const global = {};
  for (const t of texts) {
    const map = extractKeywords(t);
    for (const [k,v] of Object.entries(map)) global[k] = (global[k]||0)+v;
  }
  return Object.entries(global)
    .sort((a,b) => b[1]-a[1])
    .slice(0, top)
    .map(([k,v]) => ({ keyword: k, score: v }));
}

// quick demo when run directly
if (process.argv[1] && process.argv[1].endsWith('trending.js')) {
  const sample = [
    "Breaking: new video feature launched on X-Tweet",
    "User onboarding for wallets: guide and tutorial",
    "How to secure your X-Tweet wallet and prevent theft",
    "Trending: #javascript #react #x-tweet"
  ];
  console.log('Top keywords:', topKeywordsFromTexts(sample, 10));
}
