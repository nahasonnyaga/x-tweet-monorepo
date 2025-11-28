// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabase) {
    const supabaseUrl = 'https://xadpyaiwqrrwzlqrlysz.supabase.co';
    const supabaseKey = process.env.SUPABASE_KEY; // Keep your key in env variable

    if (!supabaseKey) {
      throw new Error('Supabase key is missing. Set SUPABASE_KEY in your environment variables.');
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
}
