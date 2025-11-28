import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { tweetId, mentionedUser, content } = req.body;

    const { data, error } = await supabase
      .from('mentions')
      .insert([{ tweetId, mentionedUser, content }]);

    if (error) return res.status(500).json({ error });

    return res.status(200).json({ data });
  }
  res.status(405).json({ message: 'Method not allowed' });
}
