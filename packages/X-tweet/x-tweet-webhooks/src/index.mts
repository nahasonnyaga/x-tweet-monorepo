export default {
  name: 'x-tweet-webhooks',
  ready: true,
  init: async () => console.log('[x-tweet-webhooks] initialized.'),
  async trigger(event: string, payload: any) {
    console.log(`[x-tweet-webhooks] event: ${event}`, payload);
    return { success: true };
  }
};
