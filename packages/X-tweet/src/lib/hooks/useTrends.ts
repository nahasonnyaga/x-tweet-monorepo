import { useEffect, useState } from "react";

interface Trend {
  name: string;
  url: string;
  tweet_volume?: number;
  type?: "hashtag" | "mention";
}

interface UseTrendsOptions {
  limit?: number;
  type?: "hashtag" | "mention";
}

/**
 * Custom React hook to fetch trending topics
 * from either your Firebase Function or local API route.
 */
export function useTrends(page = 1, limit = 10, options: UseTrendsOptions = {}) {
  const [data, setData] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrends() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: String(limit),
          type: options.type || "",
        });
        const res = await fetch(`/api/trends?${params.toString()}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setData(json.hashtags || json.trends || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTrends();
  }, [page, limit, options.type]);

  return { data, loading, error };
}
