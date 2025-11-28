// packages/X-tweet/src/lib/microservice-utils.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type MSResponse<T = any> = {
  ok: boolean;
  error?: string;
  data?: T;
};

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabaseClient) return supabaseClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  supabaseClient = createClient(url, key, { auth: { persistSession: false } });
  return supabaseClient;
}

export function success<T = any>(data?: T): MSResponse<T> { return { ok: true, data }; }
export function fail(err: string): MSResponse { return { ok: false, error: err }; }
