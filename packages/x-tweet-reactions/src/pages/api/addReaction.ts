import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { tweetId, userId, type } = req.body;

  const { error } = await supabase.from('reactions').insert([{ tweet_id: tweetId, user_id: userId, type }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ success: true });
}
