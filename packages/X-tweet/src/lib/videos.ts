// packages/X-tweet/src/lib/videos.ts
import { getSupabase, MSResponse, success, fail } from './microservice-utils';
import { v4 as uuidv4 } from 'uuid';

export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();
  try {
    switch (action) {
      case 'ping': return success({ service: 'videos' });
      case 'uploadVideoRecord': {
        const { user_id, url, metadata } = params;
        if (!user_id || !url) return fail('user_id and url required');
        const id = uuidv4();
        const { data, error } = await supabase.from('videos').insert([{ id, user_id, url, metadata }]).select().single();
        if (error) return fail(error.message);
        return success(data);
      }
      case 'getTrending': {
        // naive trending: most viewed in last 7 days
        const { data, error } = await supabase.from('videos').select('*').order('views', { ascending: false }).limit(50);
        if (error) return fail(error.message);
        return success(data);
      }
      default: return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
