// packages/X-tweet/src/lib/reactions.ts
import { MSResponse, getSupabase, success, fail } from './microservice-utils';
export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();
  try {
    switch (action) {
      case 'ping': return success({ service: 'reactions' });
      case 'add': {
        const { user_id, post_id, type } = params;
        if (!user_id || !post_id || !type) return fail('user_id, post_id, type required');
        const { error } = await supabase.from('reactions').insert([{ user_id, post_id, type }]);
        if (error) return fail(error.message);
        return success({ added: true });
      }
      default: return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
