"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "@lib/firebase/app";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  Query,
  DocumentData,
} from "firebase/firestore";

// Tweet interface
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
}

// Tabs
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

// Callable input/output types
interface GetTweetsByTagRequest {
  tag: string;
}

interface GetTweetsByTagResponse {
  data: Tweet[];
}

export default function TopMenu({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState("Suggested");
  const [dataCache, setDataCache] = useState<{ [key: string]: Tweet[] }>({});
  const [loading, setLoading] = useState(false);
  const lastVisibleRef = useRef<{ [key: string]: any }>({});
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchTabData = useCallback(
    async (tab: string, fetchMore = false) => {
      if ((dataCache[tab] && !fetchMore) || loading) return;

      setLoading(!fetchMore);
      setIsFetchingMore(fetchMore);

      try {
        let data: Tweet[] = [];
        const functions = getFunctions();

        if (["Politics", "Sports", "Entertainment", "Technology"].includes(tab)) {
          const callable = httpsCallable<GetTweetsByTagRequest, GetTweetsByTagResponse>(
            functions,
            "getTweetsByTag"
          );
          const res = await callable({ tag: tab.toLowerCase() });
          data = res.data?.data || [];
        } else if (tab === "Suggested" || tab === "Your Content") {
          const colRef = collection(db, "tweets");
          let q: Query<DocumentData> = query(colRef, orderBy("createdAt", "desc"), limit(20));
          if (fetchMore && lastVisibleRef.current[tab])
            q = query(
              colRef,
              orderBy("createdAt", "desc"),
              startAfter(lastVisibleRef.current[tab]),
              limit(20)
            );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) lastVisibleRef.current[tab] = snapshot.docs[snapshot.docs.length - 1];
          data = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Tweet) }));
        } else if (tab === "Trending" || tab === "Hashtags") {
          const colRef = collection(db, "tweets");
          let q: Query<DocumentData> = query(colRef, orderBy("likes", "desc"), limit(20));
          if (fetchMore && lastVisibleRef.current[tab])
            q = query(
              colRef,
              orderBy("likes", "desc"),
              startAfter(lastVisibleRef.current[tab]),
              limit(20)
            );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) lastVisibleRef.current[tab] = snapshot.docs[snapshot.docs.length - 1];
          data = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Tweet) }));
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
    },
    [dataCache, loading]
  );

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

  const toggleLike = async (tweet: Tweet) => {
    if (!tweet.id) return;
    const tweetRef = doc(db, "tweets", tweet.id);
    const alreadyLiked = tweet.likedBy?.includes(userId);

    await updateDoc(tweetRef, {
      likedBy: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
      likes: alreadyLiked ? (tweet.likes || 1) - 1 : (tweet.likes || 0) + 1,
    });

    setDataCache((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((t) =>
        t.id === tweet.id
          ? {
              ...t,
              likedBy: alreadyLiked
                ? t.likedBy?.filter((u) => u !== userId)
                : [...(t.likedBy || []), userId],
              likes: alreadyLiked ? (t.likes || 1) - 1 : (t.likes || 0) + 1,
            }
          : t
      ),
    }));
  };

  const toggleRetweet = async (tweet: Tweet) => {
    if (!tweet.id) return;
    const tweetRef = doc(db, "tweets", tweet.id);
    const alreadyRetweeted = tweet.retweetedBy?.includes(userId);

    await updateDoc(tweetRef, {
      retweetedBy: alreadyRetweeted ? arrayRemove(userId) : arrayUnion(userId),
      retweets: alreadyRetweeted ? (tweet.retweets || 1) - 1 : (tweet.retweets || 0) + 1,
    });

    setDataCache((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((t) =>
        t.id === tweet.id
          ? {
              ...t,
              retweetedBy: alreadyRetweeted
                ? t.retweetedBy?.filter((u) => u !== userId)
                : [...(t.retweetedBy || []), userId],
              retweets: alreadyRetweeted ? (t.retweets || 1) - 1 : (t.retweets || 0) + 1,
            }
          : t
      ),
    }));
  };

  const renderItem = (item: Tweet) => (
    <div className="flex flex-col space-y-2 border-b border-gray-200 pb-3">
      {item.userAvatar && (
        <div className="flex items-center space-x-3">
          <img src={item.userAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex flex-col">
            <p className="font-semibold text-sm">{item.username || item.title}</p>
            <p className="text-gray-400 text-xs">@{item.username || item.title}</p>
          </div>
        </div>
      )}
      <p className="text-gray-700 text-sm">{item.text}</p>

      {item.images && item.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {item.images.map((img, idx) => (
            <img key={idx} src={img} alt="tweet" className="w-full h-24 object-cover rounded-lg" />
          ))}
        </div>
      )}

      {item.videos && item.videos.length > 0 && (
        <div className="grid grid-cols-1 gap-2 mt-2">
          {item.videos.map((vid, idx) => (
            <video key={idx} src={vid} controls className="w-full h-48 rounded-lg" />
          ))}
        </div>
      )}

      <div className="flex space-x-6 text-gray-400 text-sm mt-2">
        <button className="flex items-center space-x-1">
          <span>💬 {item.comments || 0}</span>
        </button>
        <button
          className={`flex items-center space-x-1 ${item.retweetedBy?.includes(userId) ? "text-green-500" : ""}`}
          onClick={() => toggleRetweet(item)}
        >
          <span>🔁 {item.retweets || 0}</span>
        </button>
        <button
          className={`flex items-center space-x-1 ${item.likedBy?.includes(userId) ? "text-red-500" : ""}`}
          onClick={() => toggleLike(item)}
        >
          <span>❤️ {item.likes || 0}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative sticky top-0 bg-white z-50 shadow-md h-full">
      <div className="relative flex overflow-x-auto no-scrollbar border-b border-gray-200">
        {tabs.map((tab) => (
          <div key={tab} className="relative flex-shrink-0">
            <button
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab ? "text-blue-500 font-semibold" : "text-gray-700 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full" />}
          </div>
        ))}
      </div>

      <div className="mt-4 px-2 overflow-y-auto max-h-[70vh]" onScroll={handleScroll}>
        {loading && (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="h-28 bg-gray-200 rounded w-full max-w-md"></div>
            ))}
          </div>
        )}

        {!loading && dataCache[activeTab] && (
          <ul className="space-y-4">
            {dataCache[activeTab].map((item, idx) => (
              <li key={item.id || idx}>{renderItem(item)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
   );
}
