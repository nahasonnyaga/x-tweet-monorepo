import { supabase } from './mediaUtils';

const SQL = `
-- USERS
create table if not exists public.users (
    id text primary key,
    username text not null,
    email text not null unique,
    created_at timestamp with time zone not null default now()
);

-- TWEETS
create table if not exists public.tweets (
    id text primary key,
    content text not null,
    author_id text not null references public.users(id),
    created_at timestamp with time zone not null default now()
);

-- MEDIA
create table if not exists public.media (
    id text primary key,
    url text not null,
    type text not null,
    uploader_id text not null references public.users(id),
    tweet_id text null references public.tweets(id),
    created_at timestamp with time zone not null default now()
);

-- HASHTAGS
create table if not exists public.hashtags (
    id text primary key,
    tag text not null unique
);

create table if not exists public.tweet_hashtags (
    tweet_id text references public.tweets(id) on delete cascade,
    hashtag_id text references public.hashtags(id) on delete cascade,
    primary key (tweet_id, hashtag_id)
);

-- TRENDING WORDS
create table if not exists public.trending_words (
    id text primary key,
    word text not null unique,
    count integer not null default 0
);

-- LIKES
create table if not exists public.likes (
    user_id text references public.users(id) on delete cascade,
    tweet_id text references public.tweets(id) on delete cascade,
    created_at timestamp with time zone not null default now(),
    primary key (user_id, tweet_id)
);

-- RETWEETS
create table if not exists public.retweets (
    user_id text references public.users(id) on delete cascade,
    tweet_id text references public.tweets(id) on delete cascade,
    created_at timestamp with time zone not null default now(),
    primary key (user_id, tweet_id)
);

-- BOOKMARKS
create table if not exists public.bookmarks (
    user_id text references public.users(id) on delete cascade,
    tweet_id text references public.tweets(id) on delete cascade,
    created_at timestamp with time zone not null default now(),
    primary key (user_id, tweet_id)
);

-- COMMENTS
create table if not exists public.comments (
    id text primary key,
    tweet_id text references public.tweets(id) on delete cascade,
    author_id text references public.users(id),
    content text not null,
    created_at timestamp with time zone not null default now()
);

-- NOTIFICATIONS
create table if not exists public.notifications (
    id text primary key,
    user_id text references public.users(id),
    message text not null,
    read boolean not null default false,
    created_at timestamp with time zone not null default now()
);

-- SESSIONS (optional)
create table if not exists public.sessions (
    id text primary key,
    user_id text references public.users(id),
    token text not null,
    created_at timestamp with time zone not null default now(),
    expires_at timestamp with time zone not null
);
`;

async function setupDb() {
    try {
        const { data, error } = await supabase.rpc('sql', { query: SQL });
        if (error) {
            console.error('Failed to setup DB:', error);
        } else {
            console.log('Database setup completed!');
        }
    } catch (err) {
        console.error('Unexpected error while setting up DB:', err);
    }
}

setupDb();
