'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@lib/context/auth-context";
import dynamic from "next/dynamic";
import type { TweetWithUser } from "@lib/types/tweet";

// Dynamic import of Tweet component
const TweetComponent = dynamic(
  () => import("@components/tweet/tweet").then((mod) => mod.Tweet),
  { ssr: false }
);

interface HashtagTweet extends TweetWithUser {}

export default function HashtagPage() {
  const { user } = useAuth();
  const params = useParams();
  const tag = typeof params?.tag === "string" ? params.tag : "";

  const [tweets, setTweets] = useState<HashtagTweet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lastTweetRef = useRef<HashtagTweet | null>(null);

  // --- Fetch Tweets ---
  const fetchTweets = useCallback(
    async (fetchMore = false) => {
      if (!tag) return;

      try {
        fetchMore ? setIsFetchingMore(true) : setLoading(true);

        let url = `/api/hashtags/${encodeURIComponent(tag)}`;

        if (fetchMore && lastTweetRef.current?.createdAt) {
          // Convert Firestore Timestamp to ISO string
          const createdAt = lastTweetRef.current.createdAt;
          const isoDate = 'toDate' in createdAt
            ? createdAt.toDate().toISOString()
            : new Date(createdAt).toISOString();

          url += `?startAfter=${isoDate}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          const newTweets: HashtagTweet[] = data.tweets || [];
          if (fetchMore) setTweets((prev) => [...prev, ...newTweets]);
          else setTweets(newTweets);

          if (newTweets.length > 0) {
            lastTweetRef.current = newTweets[newTweets.length - 1];
          }
        } else {
          setError(data.error || "Failed to fetch tweets");
        }
      } catch (err: any) {
        console.error("Error fetching hashtag tweets:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    },
    [tag]
  );

  // --- Initial fetch ---
  useEffect(() => {
    lastTweetRef.current = null;
    fetchTweets();
  }, [tag, fetchTweets]);

  // --- Infinite scroll ---
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (
      target.scrollHeight - target.scrollTop - target.clientHeight < 50 &&
      !isFetchingMore
    ) {
      fetchTweets(true);
    }
  };

  if (!tag)
    return (
      <p className="text-center text-gray-500 mt-10">Invalid hashtag</p>
    );

  return (
    <div
      className="h-[80vh] overflow-y-auto p-0 bg-gray-50 rounded-xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      onScroll={handleScroll}
    >
      {/* Top Menu */}
      <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 bg-white rounded-b-xl shadow-md gap-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex-1 min-w-[100px] truncate">
          #{tag}
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-end min-w-[100px]">
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 transition">
            Follow
          </button>
          <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 text-sm sm:text-base rounded-lg hover:bg-gray-200 transition">
            Share
          </button>
        </div>
      </div>

      {/* Tweets List */}
      <div className="p-6 space-y-6">
        {loading && <p className="text-center text-gray-500">Loading tweets...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="flex flex-col gap-5">
          {tweets.length > 0 &&
            tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="bg-white shadow-md rounded-2xl hover:shadow-lg transition-shadow p-5"
              >
                <TweetComponent {...tweet} />
              </div>
            ))}
        </div>

        {isFetchingMore && (
          <p className="text-gray-500 mt-4 text-center">Loading more...</p>
        )}

        {!loading && tweets.length === 0 && (
          <p className="text-center text-gray-500 mt-10 text-lg">
            No tweets found for this hashtag.
          </p>
        )}
      </div>
    </div>
  );
}
