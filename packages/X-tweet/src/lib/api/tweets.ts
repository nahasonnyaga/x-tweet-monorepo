// src/lib/api/tweets.ts

export interface CreateTweetParams {
  text: string;
  file?: string[];          // Array of uploaded image URLs
  userId: string;           // ID of the user creating the tweet
  username: string;         // Username of the creator
  parent?: string;          // Optional parent tweet ID (if this is a reply)
}

export async function createTweetWithTags({
  text,
  file,
  userId,
  username,
  parent
}: CreateTweetParams) {
  // 1️⃣ Create the tweet locally
  const tweet = {
    id: crypto.randomUUID(),     // Unique local ID
    text,
    createdBy: userId,
    username,
    images: file ?? [],
    parent
  };

  // 2️⃣ Call both Vercel APIs in parallel
  try {
    await Promise.all([
      // Mirror tweet in Mongo & process hashtags/mentions
      fetch('/api/createTweetMongo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tweet),
      }),
      
      // Send notification email
      fetch('/api/notify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tweet),
      })
    ]);
  } catch (error) {
    console.error('Error processing tweet on server:', error);
    // Optionally handle failure: retry, queue, or notify admin
  }

  // 3️⃣ Return local tweet immediately
  return tweet;
}
