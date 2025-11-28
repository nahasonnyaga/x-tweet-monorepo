'use client';

import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import { db } from '@lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { SEO } from '@components/common/seo';
import type { TweetWithUser, Tweet } from '@lib/types/tweet';
import type { User } from '@lib/types/user';
import dynamic from 'next/dynamic';

// Dynamic import for Tweet to avoid SSR issues
const TweetComponent = dynamic(
  () => import('@components/tweet/tweet').then(mod => mod.Tweet),
  { ssr: false }
);

const TWEETS_PER_PAGE = 10;

export default function TrendsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tweets, setTweets] = useState<TweetWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const tweetsRef = useRef<Map<string, TweetWithUser>>(new Map());

  // --- Fetch tweets with pagination ---
  const loadTweets = useCallback(
    async (isLoadMore = false) => {
      if (!id || (!hasMore && isLoadMore)) return;

      try {
        isLoadMore ? setLoadingMore(true) : setLoading(true);

        let q = query(
          collection(db, 'tweets'),
          where('hashtags', 'array-contains', id),
          orderBy('createdAt', 'desc'),
          limit(TWEETS_PER_PAGE)
        );

        if (isLoadMore && lastDoc) {
          q = query(
            collection(db, 'tweets'),
            where('hashtags', 'array-contains', id),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(TWEETS_PER_PAGE)
          );
        }

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setHasMore(false);
          return;
        }

        const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
        setLastDoc(newLastDoc);

        // Collect user IDs for fetching author data
        const userIdsSet = new Set<string>();
        snapshot.docs.forEach(docSnap => {
          const data = docSnap.data() as Partial<Tweet> & { createdBy: string };
          if (data.createdBy) userIdsSet.add(data.createdBy);
        });

        // Fetch users
        const usersMap: Record<string, User> = {};
        if (userIdsSet.size > 0) {
          const usersRef = collection(db, 'profiles');
          const userSnapshots = await getDocs(
            query(usersRef, where('id', 'in', Array.from(userIdsSet)))
          );
          userSnapshots.docs.forEach(userSnap => {
            usersMap[userSnap.id] = userSnap.data() as User;
          });
        }

        // Map tweets to TweetWithUser
        const mappedTweets: TweetWithUser[] = snapshot.docs.map(docSnap => {
          const docData = docSnap.data() as Partial<Tweet> & { createdBy: string };
          const userId = docData.createdBy;

          return {
            id: docSnap.id,
            text: docData.text ?? null,
            images: docData.images ?? null,
            parent: docData.parent ?? null,
            userLikes: docData.userLikes ?? [],
            userReplies: docData.userReplies ?? 0,
            userRetweets: docData.userRetweets ?? [],
            createdBy: userId,
            createdAt: docData.createdAt instanceof Timestamp ? docData.createdAt : Timestamp.now(),
            updatedAt: docData.updatedAt instanceof Timestamp ? docData.updatedAt : null,
            hashtags: docData.hashtags ?? [],
            user: usersMap[userId] ?? {
              id: userId,
              name: 'Unknown',
              username: 'unknown',
              verified: false,
              photoURL: '',
              bio: '',
              following: [],
              followers: [],
              coverPhotoURL: '',
            },
          };
        });

        // Update ref map & state
        mappedTweets.forEach(t => tweetsRef.current.set(t.id, t));
        setTweets(
          Array.from(tweetsRef.current.values()).sort(
            (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
          )
        );
      } catch (err) {
        console.error('Error fetching tweets:', err);
        setError('Failed to load tweets.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [id, lastDoc, hasMore]
  );

  // --- Real-time updates ---
  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, 'tweets'),
      where('hashtags', 'array-contains', id),
      orderBy('createdAt', 'desc'),
      limit(TWEETS_PER_PAGE)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const newTweets: TweetWithUser[] = [];
      const userIdsSet = new Set<string>();

      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const docData = change.doc.data() as Partial<Tweet> & { createdBy: string };
          const userId = docData.createdBy;
          userIdsSet.add(userId);

          if (!tweetsRef.current.has(change.doc.id)) {
            newTweets.push({
              id: change.doc.id,
              text: docData.text ?? null,
              images: docData.images ?? null,
              parent: docData.parent ?? null,
              userLikes: docData.userLikes ?? [],
              userReplies: docData.userReplies ?? 0,
              userRetweets: docData.userRetweets ?? [],
              createdBy: userId,
              createdAt: docData.createdAt instanceof Timestamp ? docData.createdAt : Timestamp.now(),
              updatedAt: docData.updatedAt instanceof Timestamp ? docData.updatedAt : null,
              hashtags: docData.hashtags ?? [],
              user: {} as User, // placeholder, will fill after fetching
            });
          }
        }
      });

      if (newTweets.length === 0) return;

      (async () => {
        const usersMap: Record<string, User> = {};
        if (userIdsSet.size > 0) {
          const usersRef = collection(db, 'profiles');
          const userSnapshots = await getDocs(
            query(usersRef, where('id', 'in', Array.from(userIdsSet)))
          );
          userSnapshots.docs.forEach(userSnap => {
            usersMap[userSnap.id] = userSnap.data() as User;
          });
        }

        newTweets.forEach(tweet => {
          tweet.user = usersMap[tweet.createdBy] ?? {
            id: tweet.createdBy,
            name: 'Unknown',
            username: 'unknown',
            verified: false,
            photoURL: '',
            bio: '',
            following: [],
            followers: [],
            coverPhotoURL: '',
          };
          tweetsRef.current.set(tweet.id, tweet);
        });

        setTweets(
          Array.from(tweetsRef.current.values()).sort(
            (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
          )
        );
      })();
    });

    return () => unsubscribe();
  }, [id]);

  // --- Infinite scroll observer ---
  const observer = useRef<IntersectionObserver>();
  const lastTweetRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadTweets(true);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  // Reset tweets on hashtag change
  useEffect(() => {
    tweetsRef.current.clear();
    setTweets([]);
    setLastDoc(null);
    setHasMore(true);
    loadTweets(false);
  }, [id]);

  return (
    <section className="flex flex-col items-center justify-start w-full min-h-screen p-4 bg-main-background text-light-primary dark:text-dark-primary">
      <SEO title={id ? `#${id} - Twitter Clone` : 'Hashtag'} />
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4">{id ? `#${id}` : 'Hashtag'}</h1>
        <p className="text-sm text-light-secondary dark:text-dark-secondary mb-6">
          Trending posts and discussions about <strong>#{id}</strong>
        </p>

        {loading && tweets.length === 0 && (
          <p className="text-center text-light-secondary dark:text-dark-secondary">
            Loading tweets...
          </p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {tweets.length === 0 && !loading && !error && (
          <div className="border border-light-line-reply dark:border-dark-line-reply rounded-xl p-4">
            <p className="text-center text-light-secondary dark:text-dark-secondary">
              No posts found for this trend yet.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {tweets.map((tweet, idx) => {
            if (idx === tweets.length - 1) {
              return (
                <div ref={lastTweetRef} key={tweet.id}>
                  <TweetComponent {...tweet} />
                </div>
              );
            }
            return <TweetComponent key={tweet.id} {...tweet} />;
          })}
        </div>

        {loadingMore && (
          <p className="text-center text-light-secondary dark:text-dark-secondary mt-4">
            Loading more tweets...
          </p>
        )}

        <Link
          href="/search"
          className="mt-6 inline-block text-sm text-accent hover:underline"
        >
          ← Back to Search
        </Link>
      </div>
    </section>
  );
}
