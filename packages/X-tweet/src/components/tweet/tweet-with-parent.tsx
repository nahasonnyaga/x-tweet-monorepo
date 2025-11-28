'use client';

import { Tweet as TweetComponent } from './tweet';
import type { TweetWithUser } from '@lib/types/tweet';

// Define and export LoadedParents type
export type LoadedParents = {
  parentId: string;
  childId: string;
}[];

interface TweetWithParentProps {
  tweets: TweetWithUser[];
}

export function TweetWithParent({ tweets }: TweetWithParentProps) {
  return (
    <>
      {tweets.map((tweet) => (
        <div key={tweet.id}>
          <TweetComponent {...tweet} />
        </div>
      ))}
    </>
  );
}
