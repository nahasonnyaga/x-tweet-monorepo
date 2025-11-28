// src/index.ts
import 'dotenv/config';
import { supabase } from './lib/supabase';

console.log('🚀 x-tweet-moderation started');

// ------------------------------
// TEST CONNECTION FUNCTION
// ------------------------------
async function testConnection() {
  console.log('🔌 Testing Supabase connection...');

  try {
    const { data, error } = await supabase
      .from('test_table') // make sure this table exists in your DB
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Supabase query error:', error.message);
      return;
    }

    console.log('✅ Supabase test data:', data);
  } catch (err) {
    console.error('🔥 Unexpected error:', err);
  }
}

// ------------------------------
// MAIN APP LOOP OR INIT
// ------------------------------
async function main() {
  await testConnection();

  console.log('🟩 Moderation service running...');
  // Later you will add:
  // - Listen to new posts
  // - Filter text for hate/NSFW/spam
  // - Save moderation metadata to Supabase
}

main();
