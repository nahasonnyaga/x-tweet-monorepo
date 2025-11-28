import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabase } from '@lib/supabaseClient';
import { extractHashtags } from '@lib/hashtagUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { tweetId, content } = req.body;
  if (!tweetId || !content) return res.status(400).json({ error: 'Missing tweetId or content' });

  const supabase = getSupabase(); // <-- use the getter

  const hashtags = extractHashtags(content);

  for (const tag of hashtags) {
    // Check if the hashtag exists
    const { data, error: selectError } = await supabase
      .from('hashtags')
      .select('tweet_ids')
      .eq('tag', tag)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error(`Error fetching hashtag ${tag}:`, selectError);
      continue;
    }

    if (!data) {
      // Insert new hashtag
      const { error: insertError } = await supabase
        .from('hashtags')
        .insert({ tag, tweet_ids: [tweetId] });
      if (insertError) console.error(`Error inserting hashtag ${tag}:`, insertError);
    } else {
      // Update existing hashtag array
      const tweetIds: string[] = data.tweet_ids || [];
      if (!tweetIds.includes(tweetId)) tweetIds.push(tweetId);

      const { error: updateError } = await supabase
        .from('hashtags')
        .update({ tweet_ids: tweetIds })
        .eq('tag', tag);
      if (updateError) console.error(`Error updating hashtag ${tag}:`, updateError);
    }
  }

  res.status(200).json({ success: true, hashtags });
}
