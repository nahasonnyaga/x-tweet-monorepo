import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { HeroIcon } from "@components/ui/hero-icon";
import { CustomIcon } from "@components/ui/custom-icon";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof router.query.q === "string") {
      setQuery(router.query.q);
    }
  }, [router.query.q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLoading(true);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`).finally(() =>
        setLoading(false)
      );
    }
  };

  return (
    <section className="flex flex-col items-center justify-start w-full min-h-screen p-4 bg-main-background text-light-primary dark:text-dark-primary">
      {/* 🔍 Unified Search Bar */}
      <div className="w-full max-w-xl flex items-center gap-2 bg-light-line-reply dark:bg-dark-line-reply rounded-full px-3 py-2 mt-4 shadow-sm">
        <HeroIcon iconName="MagnifyingGlassIcon" className="h-5 w-5 text-gray-500" />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, hashtags, or users..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-8 text-light-secondary dark:text-dark-secondary">
          <CustomIcon iconName="ArrowPathIcon" className="animate-spin h-6 w-6" />
          <p>Searching...</p>
        </div>
      )}

      {/* Hashtag Results Section */}
      {!loading && query && (
        <div className="mt-6 w-full max-w-xl">
          <h2 className="text-lg font-bold mb-3">Trending Hashtags</h2>
          <div className="flex flex-col gap-2">
            <button
              className="hover:bg-light-primary/10 dark:hover:bg-dark-primary/10 rounded-md p-2 text-left transition"
              onClick={() => router.push(`/hashtag/${query.replace('#', '')}`)}
            >
              #{query.replace("#", "")}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !query && (
        <p className="mt-10 text-light-secondary dark:text-dark-secondary text-sm">
          Start typing to search for posts, hashtags, or users.
        </p>
      )}
    </section>
  );
}
