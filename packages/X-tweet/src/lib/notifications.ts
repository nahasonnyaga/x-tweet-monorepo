// packages/X-tweet/src/lib/notifications.ts
import { getSupabase, MSResponse, success, fail } from './microservice-utils';
import { v4 as uuidv4 } from 'uuid';

export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();
  try {
    switch (action) {
      case 'ping': return success({ service: 'notifications' });

      case 'sendNotification': {
        const { to_user_id, type, payload } = params;
        if (!to_user_id || !type) return fail('to_user_id and type required');
        const id = uuidv4();
        const { data, error } = await supabase.from('notifications').insert([{ id, to_user_id, type, payload, read: false }]).select().single();
        if (error) return fail(error.message);
        // Optionally push to external push service here
        return success(data);
      }

      case 'listForUser': {
        const { user_id, limit = 50 } = params;
        const { data, error } = await supabase.from('notifications').select('*').eq('to_user_id', user_id).order('created_at', { ascending: false }).limit(limit);
        if (error) return fail(error.message);
        return success(data);
      }

      default: return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
