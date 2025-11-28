import { supabase } from '../../x-tweet-supabase/src/supabase';

console.log('x-tweet-comments loaded');

export interface Comment {
  id: string;
  tweet_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Tweet {
  id: string;
  content: string;
  created_at: string;
}

/**
 * Fetch comments for a given tweet
 */
export async function getComments(tweetId: string): Promise<Comment[]> {
  if (!tweetId) return [];

  try {
    const { data, error } = await supabase
      .from('comments') // ❌ No generics here
      .select('*')
      .eq('tweet_id', tweetId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return (data ?? []) as Comment[];
  } catch (err) {
    console.error('Unexpected error fetching comments:', err);
    return [];
  }
}

/**
 * Fetch latest tweet ID
 */
export async function getLatestTweetId(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('tweets') // ❌ No generics here
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest tweet ID:', error);
      return null;
    }

    return (data as Tweet)?.id ?? null;
  } catch (err) {
    console.error('Unexpected error fetching latest tweet ID:', err);
    return null;
  }
}

// Test
async function test() {
  const latestTweetId = await getLatestTweetId();
  if (!latestTweetId) return;

  const comments = await getComments(latestTweetId);
  console.log(`Comments for tweet ${latestTweetId}:`, comments);
}

test();
