import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { metric } = req.query;

  try {
    // Example: Fetch metric data from Supabase
    const { data, error } = await supabase.from('analytics').select('*').eq('metric', metric);

    if (error) throw error;

    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
