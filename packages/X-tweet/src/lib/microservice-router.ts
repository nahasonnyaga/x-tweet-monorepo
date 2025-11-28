// packages/X-tweet/src/lib/microservice-router.ts
import * as x_tweet_supabase from './supabase';
import * as x_tweet_webhooks from './webhooks';
import * as x_tweet_trending from './trending';
import * as x_tweet_seo from './seo';
import * as x_tweet_hashtags from './hashtags';
import * as x_tweet_profiles from './profiles';
import * as x_tweet_search from './search';
import * as x_tweet_comments from './comments';
import * as x_tweet_reactions from './reactions';
import * as x_tweet_moderation from './moderation';
import * as x_tweet_notifications_queue from './notifications-queue';
import * as x_tweet_wallet from './wallet';
import * as x_tweet_analytics from './analytics';
import * as x_tweet_videos from './videos';
import * as x_tweet_ai from './ai';
import * as x_tweet_payments from './payments';
import * as x_tweet_notifications from './notifications';
import * as x_tweet_media from './media';
import * as x_tweet_suggested from './suggested';
import * as x_tweet_users from './users';
import * as x_tweet_admin from './admin';

// MAIN ROUTER OBJECT
export const microservices = {
  'x-tweet-supabase': x_tweet_supabase,
  'x-tweet-webhooks': x_tweet_webhooks,
  'x-tweet-trending': x_tweet_trending,
  'x-tweet-seo': x_tweet_seo,
  'x-tweet-hashtags': x_tweet_hashtags,
  'x-tweet-profiles': x_tweet_profiles,
  'x-tweet-search': x_tweet_search,
  'x-tweet-comments': x_tweet_comments,
  'x-tweet-reactions': x_tweet_reactions,
  'x-tweet-moderation': x_tweet_moderation,
  'x-tweet-notifications-queue': x_tweet_notifications_queue,
  'x-tweet-wallet': x_tweet_wallet,
  'x-tweet-analytics': x_tweet_analytics,
  'x-tweet-videos': x_tweet_videos,
  'x-tweet-ai': x_tweet_ai,
  'x-tweet-payments': x_tweet_payments,
  'x-tweet-notifications': x_tweet_notifications,
  'x-tweet-media': x_tweet_media,
  'x-tweet-suggested': x_tweet_suggested,
  'x-tweet-users': x_tweet_users,
  'x-tweet-admin': x_tweet_admin,
};
