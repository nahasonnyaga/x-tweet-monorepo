// packages/X-tweet/src/lib/supabase.ts
import { getSupabase, MSResponse, success, fail } from './microservice-utils';

export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();

  try {
    switch (action) {
      case 'ping':
        return success({ now: new Date().toISOString() });

      case 'getProfileById': {
        const { id } = params;
        if (!id) return fail('id required');
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (error) return fail(error.message);
        return success(data);
      }

      case 'insertPost': {
        const { user_id, content, media = null } = params;
        if (!user_id || !content) return fail('user_id and content required');
        const { data, error } = await supabase.from('posts').insert([{ user_id, content, media }]).select().single();
        if (error) return fail(error.message);
        return success(data);
      }

      // Add other supabase CRUD actions you need
      default:
        return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
