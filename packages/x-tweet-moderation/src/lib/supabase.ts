import 'dotenv/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl) console.error('❌ ERROR: Missing NEXT_PUBLIC_SUPABASE_URL in .env');
if (!supabaseKey) console.error('❌ ERROR: Missing SUPABASE_SERVICE_ROLE_KEY in .env');

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
