// packages/X-tweet/src/lib/admin.ts
import { getSupabase, MSResponse, success, fail } from './microservice-utils';

export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();
  try {
    switch (action) {
      case 'ping': return success({ service: 'admin' });
      case 'moderatePost': {
        const { post_id, action: modAction, moderator_id } = params;
        if (!post_id || !modAction) return fail('post_id and action required');
        const { error } = await supabase.from('posts').update({ moderation_status: modAction, moderated_by: moderator_id }).eq('id', post_id);
        if (error) return fail(error.message);
        return success({ post_id, status: modAction });
      }
      case 'stats': {
        // Small set of useful stats
        const [{ count: usersCount }, { count: postsCount }] = await Promise.all([
          (await supabase.from('profiles').select('id', { count: 'exact' })).count ?? [{ count: 0 }],
          (await supabase.from('posts').select('id', { count: 'exact' })).count ?? [{ count: 0 }],
        ]).catch(() => [{ count: 0 }, { count: 0 }]);
        return success({ usersCount, postsCount });
      }
      default: return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
