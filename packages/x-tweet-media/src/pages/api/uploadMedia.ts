import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const { fileName, fileType, description } = req.body;

    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, Buffer.from(req.body.file, 'base64'), {
        contentType: fileType,
      });

    if (error) throw error;

    const { publicURL } = supabase.storage.from('media').getPublicUrl(data.path);

    // Save metadata in Supabase table
    const { error: dbError } = await supabase.from('media').insert([
      { id: fileName, url: publicURL, description },
    ]);

    if (dbError) throw dbError;

    res.status(200).json({ url: publicURL });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

