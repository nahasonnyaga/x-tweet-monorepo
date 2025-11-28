import { NextRequest, NextResponse } from 'next/server';
import { connectToMongo } from '@lib/mongo';
import { db } from '@lib/firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import type { TweetWithUser } from '@lib/types/tweet';
import type { User } from '@lib/types/user';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag')?.toLowerCase();
  if (!tag) return NextResponse.json({ tweets: [] });

  try {
    // --- Fetch hashtag from MongoDB ---
    const mongo = await connectToMongo(); // Returns a Db instance
    const hashtagsCol = mongo.collection('hashtags');
    const hashtagDoc = await hashtagsCol.findOne({ tag });

    if (!hashtagDoc || !hashtagDoc.tweetIds?.length) {
      return NextResponse.json({ tweets: [] });
    }

    const tweetIds: string[] = hashtagDoc.tweetIds;
    const tweets: TweetWithUser[] = [];

    for (const id of tweetIds) {
      const tweetSnap = await getDoc(doc(db, 'tweets', id));
      if (!tweetSnap.exists()) continue;

      const tweetData = tweetSnap.data() as Omit<TweetWithUser, 'user'>;

      // --- Fetch user from Firestore ---
      const userSnap = await getDoc(doc(db, 'users', tweetData.createdBy || ''));
      const u = userSnap.exists() ? userSnap.data() : {};

      // --- Construct fully typed User object ---
      const user: User = {
        id: tweetData.createdBy || 'unknown',
        name: u.name ?? 'Unknown',
        username: u.username ?? 'unknown',
        bio: u.bio ?? null,
        theme: u.theme ?? null,
        accent: u.accent ?? null,
        website: u.website ?? null,
        location: u.location ?? null,
        photoURL: u.photoURL ?? '/assets/twitter-avatar.jpg',
        verified: u.verified ?? false,
        following: Array.isArray(u.following) ? u.following : [],
        followers: Array.isArray(u.followers) ? u.followers : [],
        createdAt: u.createdAt ?? (new Date() as any),
        updatedAt: u.updatedAt ?? null,
        totalTweets: u.totalTweets ?? 0,
        totalPhotos: u.totalPhotos ?? 0,
        pinnedTweet: u.pinnedTweet ?? null,
        coverPhotoURL: u.coverPhotoURL ?? null,
      };

      tweets.push({ ...tweetData, id, user });
    }

    return NextResponse.json({ tweets });
  } catch (err) {
    console.error('Error fetching hashtag tweets:', err);
    return NextResponse.json({ tweets: [], error: 'Failed to fetch tweets' }, { status: 500 });
  }
}
