import { supabase } from '@lib/supabaseClient';

export default async function MentionsPage({ params }: { params: { username: string } }) {
  const { data: mentions } = await supabase
    .from('mentions')
    .select('*')
    .eq('mentionedUser', params.username);

  return (
    <div>
      <h1>Mentions for @{params.username}</h1>
      <ul>
        {mentions?.map((m) => (
          <li key={m.tweetId}>{m.content}</li>
        ))}
      </ul>
    </div>
  );
}
