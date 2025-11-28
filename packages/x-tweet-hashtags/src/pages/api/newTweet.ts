// src/pages/api/newTweet.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tweetId, content } = req.body;
  if (!tweetId || !content) return res.status(400).json({ error: 'Missing tweetId or content' });

  // Call the hashtag repo API
  try {
    const response = await fetch('https://your-hashtag-repo.com/api/syncHashtags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweetId, content })
    });
    const data = await response.json();
    res.status(200).json({ success: true, synced: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to sync hashtags' });
  }
}
