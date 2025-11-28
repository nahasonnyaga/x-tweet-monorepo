/**
 * AI Meta Tag Generator for X-Tweet
 * Connects to x-tweet-ai to generate title, description, tags.
 */

import fetch from 'node-fetch';

export async function generateAIMetadata(url, content) {
  try {
    const res = await fetch("https://x-tweet-ai.vercel.app/api/seo-meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, content })
    });

    const data = await res.json();

    return {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
    };
  } catch (e) {
    console.error("AI Meta Error:", e);
    return {
      title: "X-Tweet",
      description: "Social platform powered by real-time engagement.",
      keywords: "x-tweet, social media"
    };
  }
}
