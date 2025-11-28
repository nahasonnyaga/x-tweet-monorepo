// packages/X-tweet/src/lib/users.ts
import { getSupabase, MSResponse, success, fail } from "./microservice-utils";
import { v4 as uuidv4 } from 'uuid';

export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();
  try {
    switch (action) {
      case 'ping': return success({ service: 'users' });
      case 'createProfile': {
        const { id, username, display_name, avatar_url } = params;
        if (!id || !username) return fail('id and username required');
        const { data, error } = await supabase.from('profiles').insert([{ id, username, display_name, avatar_url }]).select().single();
        if (error) return fail(error.message);
        return success(data);
      }
      case 'getByUsername': {
        const { username } = params;
        if (!username) return fail('username required');
        const { data, error } = await supabase.from('profiles').select('*').eq('username', username).single();
        if (error) return fail(error.message);
        return success(data);
      }
      default:
        return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
