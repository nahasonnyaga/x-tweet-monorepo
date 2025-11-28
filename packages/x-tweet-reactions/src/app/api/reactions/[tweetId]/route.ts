import { supabase } from '@lib/supabase';

export async function GET(req: Request, { params }: { params: { tweetId: string } }) {
  const { data, error } = await supabase
    .from('reactions')
    .select('*')
    .eq('tweet_id', params.tweetId);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 200 });
}
