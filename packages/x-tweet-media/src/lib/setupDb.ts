import { supabase } from './mediaUtils';

/**
 * Universal database setup script for X-Tweet Media
 * This will create tables if they do not exist, without dropping existing data.
 */
const SQL = `
-- Media table
create table if not exists public.media (
    id text primary key,
    url text not null,
    type text not null,
    uploader_id text not null,
    tweet_id text null,
    created_at timestamp with time zone not null default now()
);

-- Tweets table
create table if not exists public.tweets (
    id text primary key,
    content text not null,
    author_id text not null,
    created_at timestamp with time zone not null default now()
);

-- Users table (optional, for reference)
create table if not exists public.users (
    id text primary key,
    username text not null,
    email text not null,
    created_at timestamp with time zone not null default now()
);
`;

async function setupDb() {
    try {
        // Use Supabase RPC for raw SQL
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
