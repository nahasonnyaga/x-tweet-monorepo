import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { tweetId, text } = req.body;

  const { error } = await supabase
    .from('search_index')
    .insert([{ tweet_id: tweetId, content: text }]);

  if (error) return res.status(500).json({ error });

  return res.json({ ok: true });
}
