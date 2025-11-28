'use client';
import { useState, useEffect, useRef } from 'react';
import type { Tweet as TweetType } from '@lib/types/tweet';
import type { User } from '@lib/types/user';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import HorizontalMenu from '@components/horizontal-menu';

// ✅ Dynamic import of Tweet component for SSR issues
const TweetComponent = dynamic(
  () => import('@components/tweet/tweet').then((mod) => mod.Tweet),
  { ssr: false }
);

interface FeedProps {
  tweets: TweetType[];
  user: User;
}

export default function Feed({ tweets, user }: FeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(-1);

  // Indices after which horizontal menu appears
  const menuIndices = [2, 5, 7, 10];

  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;

      const tweetElements = Array.from(feedRef.current.children) as HTMLDivElement[];
      let currentMenu = -1;

      for (let i = 0; i < menuIndices.length; i++) {
        const idx = menuIndices[i];
        const tweetEl = tweetElements[idx];
        if (!tweetEl) continue;

        const rect = tweetEl.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) {
          currentMenu = i;
        }
      }

      setActiveMenuIndex(currentMenu);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialize

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={feedRef} className="flex flex-col gap-4">
      {tweets.map((tweet, index) => (
        <div key={tweet.id} className="relative">
          <TweetComponent {...tweet} user={user} />

          {menuIndices.includes(index) && activeMenuIndex === menuIndices.indexOf(index) && (
            <div className="sticky top-14 z-50">
              <HorizontalMenu activeIndex={activeMenuIndex} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
