// src/lib/setupFullDbWithDefaults.ts
import { supabase } from './mediaUtils.ts'; // ✅ include the .ts extension

async function setupDb() {
  try {
    console.log('Setting up default data...');

    // ------------------------
    // USERS
    // ------------------------
    await supabase.from('users').upsert([
      { id: 'u1', username: 'alice', email: 'alice@example.com' },
      { id: 'u2', username: 'bob', email: 'bob@example.com' },
    ]);

    // ------------------------
    // HASHTAGS
    // ------------------------
    await supabase.from('hashtags').upsert([
      { id: 'h1', tag: '#NextJS' },
      { id: 'h2', tag: '#Supabase' },
      { id: 'h3', tag: '#XTweet' },
    ]);

    // ------------------------
    // TRENDING WORDS
    // ------------------------
    await supabase.from('trending_words').upsert([
      { id: 't1', word: 'NextJS', count: 5 },
      { id: 't2', word: 'Supabase', count: 3 },
    ]);

    // ------------------------
    // TWEETS
    // ------------------------
    await supabase.from('tweets').upsert([
      { id: 'tw1', content: 'Hello World! This is a sample tweet with media.', author_id: 'u1' },
    ]);

    // ------------------------
    // MEDIA
    // ------------------------
    await supabase.from('media').upsert([
      {
        id: 'm1',
        url: 'https://res.cloudinary.com/demo/image/upload/sample.png',
        type: 'image',
        uploader_id: 'u1',
        tweet_id: 'tw1',
      },
    ]);

    // ------------------------
    // TWEET HASHTAGS
    // ------------------------
    await supabase.from('tweet_hashtags').upsert([
      { tweet_id: 'tw1', hashtag_id: 'h1' },
      { tweet_id: 'tw1', hashtag_id: 'h2' },
    ]);

    console.log('Database setup complete with default tables and data!');
  } catch (err) {
    console.error('Unexpected error while setting up DB:', err);
  }
}

setupDb();
