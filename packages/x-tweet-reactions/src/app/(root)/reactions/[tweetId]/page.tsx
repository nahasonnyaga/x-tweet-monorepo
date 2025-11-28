'use client';
import { useEffect, useState } from 'react';

export default function ReactionsPage({ params }: { params: { tweetId: string } }) {
  const [reactions, setReactions] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/reactions/${params.tweetId}`)
      .then(res => res.json())
      .then(data => setReactions(data));
  }, [params.tweetId]);

  return (
    <div>
      <h1>Reactions</h1>
      <ul>
        {reactions.map((r) => (
          <li key={r.id}>{r.type} by {r.user_id}</li>
        ))}
      </ul>
    </div>
  );
}
