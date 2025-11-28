'use client';

import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWindow } from '@lib/context/window-context';
import { HomeLayout, ProtectedLayout } from '@components/layout/common-layout';
import { MainLayout } from '@components/layout/main-layout';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container';
import { Input } from '@components/input/input';
import { UpdateUsername } from '@components/home/update-username';
import { MainHeader } from '@components/home/main-header';
import dynamic from 'next/dynamic';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import type { ReactElement, ReactNode } from 'react';
import { supabase } from '@lib/supabase';

const TweetComponent = dynamic(
  () => import('@components/tweet/tweet').then((mod) => mod.Tweet),
  { ssr: false }
);

export default function Home(): JSX.Element {
  const { isMobile } = useWindow();
  const [tweets, setTweets] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTweets = async () => {
    try {
      const { data, error } = await supabase
        .from('tweets')
        .select(`
          id,
          content,
          author_id,
          created_at,
          media:media(url, type, public_id)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTweets(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load tweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <MainContainer>
      <SEO title="Home / Twitter" />
      <MainHeader useMobileSidebar title="Home" className="flex items-center justify-between">
        <UpdateUsername />
      </MainHeader>

      {!isMobile && <Input />}

      <section className="mt-0.5 xs:mt-0">
        {loading ? (
          <Loading className="mt-5" />
        ) : error ? (
          <Error message={error} />
        ) : tweets && tweets.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {tweets.map((tweet) => (
              <TweetComponent {...tweet} key={tweet.id} />
            ))}
          </AnimatePresence>
        ) : (
          <Error message="No tweets available" />
        )}
      </section>
    </MainContainer>
  );
}

Home.getLayout = (page: ReactElement): ReactNode => (
  <ProtectedLayout>
    <MainLayout>
      <HomeLayout>{page}</HomeLayout>
    </MainLayout>
  </ProtectedLayout>
);
