// src/lib/testSupabase.ts
import { supabase } from './mediaUtils.ts';

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...');

    // 1️⃣ Fetch users
    const { data: users, error: usersError } = await supabase.from('users').select('*');
    if (usersError) throw usersError;
    console.log('Users in database:', users);

    // 2️⃣ Insert a new test tweet
    const { data: tweet, error: tweetError } = await supabase.from('tweets').insert([
      {
        id: 'tw_test',
        content: 'This is a test tweet!',
        author_id: users?.[0]?.id || 'u1',
      },
    ]).select();
    if (tweetError) throw tweetError;
    console.log('Inserted test tweet:', tweet);

    // 3️⃣ Fetch tweets
    const { data: allTweets, error: allTweetsError } = await supabase.from('tweets').select('*');
    if (allTweetsError) throw allTweetsError;
    console.log('All tweets:', allTweets);

    console.log('Supabase test completed successfully!');
  } catch (err) {
    console.error('Supabase test failed:', err);
  }
}

// Run the test
testSupabase();
