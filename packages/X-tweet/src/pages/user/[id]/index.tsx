'use client';

import { doc, query, where, Timestamp } from 'firebase/firestore';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useUser } from '@lib/context/user-context';
import { useCollection } from '@lib/hooks/useCollection';
import { useDocument } from '@lib/hooks/useDocument';
import { tweetsCollection } from '@lib/firebase/collections';
import { mergeData } from '@lib/merge';
import { UserLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { UserDataLayout } from '@components/layout/user-data-layout';
import { UserHomeLayout } from '@components/layout/user-home-layout';
import { StatsEmpty } from '@components/tweet/stats-empty';
import { Loading } from '@components/ui/loading';
import type { ReactElement, ReactNode } from 'react';
import type { Tweet as TweetType } from '@lib/types/tweet';
import type { User } from '@lib/types/user';
import type { ImagesPreview } from '@lib/types/file';

// Dynamic import for Tweet component
const TweetComponent = dynamic(
  () => import('@components/tweet/tweet').then(mod => mod.Tweet),
  { ssr: false }
);

export default function UserTweets(): JSX.Element {
  const { user } = useUser();
  const { id, username, pinnedTweet } = user ?? {};

  // Pinned tweet
  const { data: pinnedDataRaw } = useDocument(
    doc(tweetsCollection, pinnedTweet ?? 'null'),
    { disabled: !pinnedTweet, allowNull: true, includeUser: true }
  );

  // Keep Timestamps as-is for type safety
  const pinnedData: TweetType | null = pinnedDataRaw
    ? {
        ...pinnedDataRaw,
        createdAt: pinnedDataRaw.createdAt ?? Timestamp.now(),
        updatedAt: pinnedDataRaw.updatedAt ?? Timestamp.now(),
      }
    : null;

  // User's own tweets
  const { data: ownerTweetsRaw, loading: ownerLoading } = useCollection(
    query(tweetsCollection, where('createdBy', '==', id), where('parent', '==', null)),
    { includeUser: true, allowNull: true }
  );

  // Tweets the user retweeted
  const { data: peopleTweetsRaw, loading: peopleLoading } = useCollection(
    query(
      tweetsCollection,
      where('createdBy', '!=', id),
      where('userRetweets', 'array-contains', id)
    ),
    { includeUser: true, allowNull: true }
  );

  // Convert timestamps while returning null instead of undefined
  const convertTimestamps = (tweets: TweetType[] | null | undefined): TweetType[] | null =>
    tweets?.map(tweet => ({
      ...tweet,
      createdAt: tweet.createdAt ?? Timestamp.now(),
      updatedAt: tweet.updatedAt ?? Timestamp.now(),
    })) || null;

  const mergedTweets = mergeData(
    true,
    convertTimestamps(ownerTweetsRaw),
    convertTimestamps(peopleTweetsRaw)
  );

  return (
    <section>
      {ownerLoading || peopleLoading ? (
        <Loading className="mt-5" />
      ) : !mergedTweets || mergedTweets.length === 0 ? (
        <StatsEmpty
          title={`@${username as string} hasn't tweeted`}
          description="When they do, their Tweets will show up here."
        />
      ) : (
        <AnimatePresence mode="popLayout">
          {pinnedData && (
            <TweetComponent
              pinned
              {...pinnedData}
              user={user as User} // ✅ pinned tweet needs user
              key={`pinned-${pinnedData.id}`}
            />
          )}
          {mergedTweets.map(tweet => (
            <TweetComponent
              {...tweet}
              profile={user as User}
              user={user as User} // ✅ regular tweets now have user prop
              key={tweet.id}
            />
          ))}
        </AnimatePresence>
      )}
    </section>
  );
}

// Layout wrappers
UserTweets.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <UserLayout>
        <UserDataLayout>
          <UserHomeLayout>{page}</UserHomeLayout>
        </UserDataLayout>
      </UserLayout>
    </MainLayout>
  </ProtectedLayout>
);
