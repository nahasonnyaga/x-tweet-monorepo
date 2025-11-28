import 'dotenv/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client using env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Track an event in Supabase analytics table
 */
export async function trackEvent(
  eventType: string,
  userId: string,
  metadata: Record<string, any> = {}
) {
  const { data, error } = await supabase.from('analytics').insert([
    { event_type: eventType, user_id: userId, metadata, created_at: new Date() }
  ]);
  if (error) console.error('Error tracking event:', error);
  return data;
}

/**
 * Retrieve events for a user
 */
export async function getUserEvents(userId: string) {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) console.error('Error fetching user events:', error);
  return data;
}

/**
 * Quick test function to verify connection
 */
async function testAnalytics() {
  console.log('🚀 Testing Supabase connection...');
  const result = await trackEvent('test_event', 'user_123', { info: 'test' });
  console.log('✅ Test insert result:', result);
}

testAnalytics();
