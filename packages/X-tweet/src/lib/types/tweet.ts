import type { Timestamp, FirestoreDataConverter } from 'firebase/firestore';
import type { ImagesPreview } from './file';
import type { User } from './user';

// ✅ Main Tweet type definition
export type Tweet = {
  id: string;
  text: string | null;
  images: ImagesPreview | null;
  parent: { id: string; username: string } | null;
  userLikes: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  userReplies: number;
  userRetweets: string[];

  // ✅ Added hashtags support for tagging tweets
  hashtags?: string[];
};

// ✅ Tweet combined with its author data
export type TweetWithUser = Tweet & { user: User };

// ✅ Firestore converter (handles Tweet <-> Firestore document)
export const tweetConverter: FirestoreDataConverter<Tweet> = {
  toFirestore(tweet) {
    // Ensure hashtags are stored as an array
    const data = {
      ...tweet,
      hashtags: tweet.hashtags ?? [],
    };
    return data;
  },
  fromFirestore(snapshot, options) {
    const { id } = snapshot;
    const data = snapshot.data(options);

    // Ensure default values for optional fields
    return {
      id,
      ...data,
      hashtags: data.hashtags ?? [],
    } as Tweet;
  },
};
