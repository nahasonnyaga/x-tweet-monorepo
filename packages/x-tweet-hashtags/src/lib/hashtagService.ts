import { supabase } from './supabaseClient';
import { extractHashtags } from './hashtagUtils';

export async function saveHashtags(tweetId: string, content: string) {
  const hashtags = extractHashtags(content);

  if (!hashtags.length) return;

  for (const tag of hashtags) {
    const { error } = await supabase.from('hashtags').upsert({
      tweet_id: tweetId,
      tag: tag,
    });

    if (error) {
      console.error(`Error saving hashtag ${tag} for tweet ${tweetId}:`, error);
    }
  }

  console.log(`Saved hashtags for tweet ${tweetId}:`, hashtags);
}
