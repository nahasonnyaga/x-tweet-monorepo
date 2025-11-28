'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "@lib/firebase/app";
import {
  doc,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  Query
} from "firebase/firestore";
import { HeroIcon } from "@components/ui/hero-icon";

// --- TYPES ---
interface Tweet {
  id: string;
  text?: string;
  images?: string[];
  videos?: string[];
  title?: string;
  createdBy?: string;
  userAvatar?: string;
  username?: string;
  retweets?: number;
  likes?: number;
  comments?: number;
  likedBy?: string[];
  retweetedBy?: string[];
  tags?: string[];
  replies?: Tweet[];
}

// --- TABS ---
const tabs = [
  "Suggested",
  "Trending",
  "Your Content",
  "News",
  "Hashtags",
  "Politics",
  "Sports",
  "Entertainment",
  "Technology",
];

// --- FIREBASE TYPES ---
interface GetTweetsByTagInput { tag: string; }
interface GetTweetsByTagResponse { data: Tweet[]; }

// --- COMPONENT ---
export interface TopMenuProps {
  userId?: string; // now optional
}

export function TopMenu({ userId }: TopMenuProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Suggested");
  const [dataCache, setDataCache] = useState<{ [key: string]: Tweet[] }>({});
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const lastVisibleRef = useRef<{ [key: string]: any }>({});
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    const container = tabContainerRef.current;
    const activeTabEl = container?.querySelector<HTMLElement>(".active-tab");
    if (container && activeTabEl) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTabEl.getBoundingClientRect();
      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        container.scrollBy({ left: tabRect.left - containerRect.left - 16, behavior: "smooth" });
      }
    }
  }, [activeTab]);

  // Fetch tab data
  const fetchTabData = useCallback(async (tab: string, fetchMore = false) => {
    if ((dataCache[tab] && !fetchMore) || loading) return;
    setLoading(!fetchMore);
    setIsFetchingMore(fetchMore);

    try {
      let data: Tweet[] = [];
      const functions = getFunctions();

      if (["Politics", "Sports", "Entertainment", "Technology"].includes(tab)) {
        const callable = httpsCallable<GetTweetsByTagInput, GetTweetsByTagResponse>(functions, "getTweetsByTag");
        const res = await callable({ tag: tab.toLowerCase() });
        data = res.data?.data || [];
      } else if (tab === "Suggested" || tab === "Your Content") {
        const colRef = collection(db, "tweets");
        let q: Query<DocumentData> = query(colRef, orderBy("createdAt", "desc"), limit(20));
        if (fetchMore && lastVisibleRef.current[tab]) {
          q = query(colRef, orderBy("createdAt", "desc"), startAfter(lastVisibleRef.current[tab]), limit(20));
        }
        const snapshot = await getDocs(q);
        if (!snapshot.empty) lastVisibleRef.current[tab] = snapshot.docs[snapshot.docs.length - 1];
        data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Tweet, "id">) }));
      } else if (tab === "Trending" || tab === "Hashtags") {
        const colRef = collection(db, "tweets");
        let q: Query<DocumentData> = query(colRef, orderBy("likes", "desc"), limit(20));
        if (fetchMore && lastVisibleRef.current[tab]) {
          q = query(colRef, orderBy("likes", "desc"), startAfter(lastVisibleRef.current[tab]), limit(20));
        }
        const snapshot = await getDocs(q);
        if (!snapshot.empty) lastVisibleRef.current[tab] = snapshot.docs[snapshot.docs.length - 1];
        data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Tweet, "id">) }));
      } else if (tab === "News") {
        data = [{ id: "news-placeholder", title: "News tab under construction" }];
      }

      setDataCache((prev) => ({
        ...prev,
        [tab]: fetchMore ? [...(prev[tab] || []), ...data] : data,
      }));
    } catch (err) {
      console.error(`Error fetching ${tab}:`, err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [dataCache, loading]);

  useEffect(() => {
    fetchTabData(activeTab);
    lastVisibleRef.current[activeTab] = null;
  }, [activeTab, fetchTabData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 50 && !isFetchingMore) {
      fetchTabData(activeTab, true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  // --- Render ---
  return (
    <div className="relative sticky top-0 bg-gray-50 z-50 shadow-md h-full">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 p-3 border-b border-gray-200 bg-white">
        <HeroIcon iconName="MagnifyingGlassIcon" className="h-5 w-5 text-gray-500" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts, hashtags, or users..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </form>

      {/* Tabs */}
      <div ref={tabContainerRef} className="flex overflow-x-auto no-scrollbar border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-shrink-0 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab
                ? "text-blue-500 font-semibold active-tab border-b-2 border-blue-500 scale-105"
                : "text-gray-700 hover:text-blue-500 hover:scale-105"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className="mt-4 px-3 overflow-y-auto max-h-[75vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        onScroll={handleScroll}
      >
        {loading && (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-28 bg-gray-200 rounded-2xl w-full max-w-md"></div>
            ))}
          </div>
        )}
        {!loading && dataCache[activeTab] && (
          <ul className="space-y-4">
            {dataCache[activeTab].map((item, idx) => (
              <li key={item.id || idx}>{/* renderItem(item) */}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
