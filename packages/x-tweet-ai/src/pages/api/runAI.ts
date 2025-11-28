import type { NextApiRequest, NextApiResponse } from 'next';
import { runAI } from '@lib/openai';
import { supabase } from '@lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const { feature } = req.body;
    if (!feature) return res.status(400).json({ error: 'Feature is required' });

    const result = await runAI(feature);

    await supabase.from('ai_results').insert([{ feature, result }]);

    res.status(200).json({ result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
