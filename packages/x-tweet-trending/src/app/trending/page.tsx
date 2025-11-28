// src/app/trending/page.tsx
"use client";

import { useEffect, useState } from "react";

interface TrendingTopic {
  name: string;
  tweets?: number;
}

export default function TrendingPage() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/trending");
        const data = await res.json();
        setTopics(data);
      } catch (err) {
        console.error("Failed to fetch trending topics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">🔥 Trending</h1>

      {loading && <p className="text-gray-500">Loading trending topics...</p>}

      {!loading && topics.length === 0 && (
        <p className="text-gray-400">No trending topics right now.</p>
      )}

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="p-4 bg-gray-900 rounded-xl hover:bg-gray-800 transition cursor-pointer"
          >
            <span className="text-sm text-gray-500">Trending</span>
            <h2 className="text-lg font-semibold mt-1">#{topic.name}</h2>
            {topic.tweets && (
              <p className="text-sm text-gray-400 mt-1">
                {topic.tweets.toLocaleString()} Tweets
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
