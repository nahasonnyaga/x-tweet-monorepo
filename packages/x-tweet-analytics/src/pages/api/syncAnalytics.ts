import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { tweetId, userId, metrics } = req.body;

    if (!tweetId || !userId || !metrics) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase.from('analytics').insert([
      {
        tweet_id: tweetId,
        user_id: userId,
        likes: metrics.likes || 0,
        retweets: metrics.retweets || 0,
        replies: metrics.replies || 0,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    res.status(200).json({ message: 'Analytics synced successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
