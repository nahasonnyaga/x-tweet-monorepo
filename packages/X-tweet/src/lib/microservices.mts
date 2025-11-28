export const microservices: Record<string, () => Promise<any>> = {
  'x-tweet': async () => (await import('../../x-tweet/src/index.mts')).default ?? {},
  'x-tweet-supabase': async () => (await import('../../x-tweet-supabase/src/index.mts')).default ?? {},
  'x-tweet-webhooks': async () => (await import('../../x-tweet-webhooks/src/index.mts')).default ?? {},
  'x-tweet-trending': async () => (await import('../../x-tweet-trending/src/index.mts')).default ?? {},
  'x-tweet-monorepo': async () => (await import('../../x-tweet-monorepo/src/index.mts')).default ?? {},
  'x-tweet-seo': async () => (await import('../../x-tweet-seo/src/index.mts')).default ?? {},
  'x-tweet-hashtags': async () => (await import('../../x-tweet-hashtags/src/index.mts')).default ?? {},
  'x-tweet-profiles': async () => (await import('../../x-tweet-profiles/src/index.mts')).default ?? {},
  'x-tweet-search': async () => (await import('../../x-tweet-search/src/index.mts')).default ?? {},
  'x-tweet-comments': async () => (await import('../../x-tweet-comments/src/index.mts')).default ?? {},
  'x-tweet-reactions': async () => (await import('../../x-tweet-reactions/src/index.mts')).default ?? {},
  'x-tweet-moderation': async () => (await import('../../x-tweet-moderation/src/index.mts')).default ?? {},
  'x-tweet-notifications-queue': async () => (await import('../../x-tweet-notifications-queue/src/index.mts')).default ?? {},
  'x-tweet-wallet': async () => (await import('../../x-tweet-wallet/src/index.mts')).default ?? {},
  'x-tweet-analytics': async () => (await import('../../x-tweet-analytics/src/index.mts')).default ?? {},
  'x-tweet-videos': async () => (await import('../../x-tweet-videos/src/index.mts')).default ?? {},
  'x-tweet-ai': async () => (await import('../../x-tweet-ai/src/index.mts')).default ?? {},
  'x-tweet-payments': async () => (await import('../../x-tweet-payments/src/index.mts')).default ?? {},
  'x-tweet-notifications': async () => (await import('../../x-tweet-notifications/src/index.mts')).default ?? {},
  'x-tweet-media': async () => (await import('../../x-tweet-media/src/index.mts')).default ?? {},
  'x-tweet-suggested': async () => (await import('../../x-tweet-suggested/src/index.mts')).default ?? {},
  'x-tweet-users': async () => (await import('../../x-tweet-users/src/index.mts')).default ?? {},
  'x-tweet-admin': async () => (await import('../../x-tweet-admin/src/index.mts')).default ?? {},
};

// helper function
export async function testAllServices() {
  console.log('Testing all microservices...\n');
  for (const [name, loader] of Object.entries(microservices)) {
    try {
      const instance = await loader();
      console.log(`${name} loaded:`, !!instance);
    } catch (err: any) {
      console.log(`${name} failed:`, err.message);
    }
  }
}
