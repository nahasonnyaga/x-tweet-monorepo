import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@lib/supabase';

const MediaPage = () => {
  const router = useRouter();
  const { mediaId } = router.query;
  const [media, setMedia] = useState<any>(null);

  useEffect(() => {
    if (!mediaId) return;
    supabase
      .from('media')
      .select('*')
      .eq('id', mediaId)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setMedia(data);
      });
  }, [mediaId]);

  if (!media) return <div>Loading...</div>;

  return (
    <div>
      <h1>Media ID: {mediaId}</h1>
      <video src={media.url} controls width="600" />
      <p>{media.description}</p>
    </div>
  );
};

export default MediaPage;
