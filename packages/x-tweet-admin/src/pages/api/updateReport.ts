import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const { reportId, status } = req.body;
    const { error } = await supabase.from('reports').update({ status }).eq('id', reportId);
    if (error) throw error;
    res.status(200).json({ message: 'Report updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
