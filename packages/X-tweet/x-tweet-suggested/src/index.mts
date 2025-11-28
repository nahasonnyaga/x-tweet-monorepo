export default {
  name: 'x-tweet-suggested',
  ready: true,
  init: async () => console.log('[x-tweet-suggested] initialized.'),
  async getSuggestions(userId: string) {
    console.log(`[x-tweet-suggested] Fetching suggestions for ${userId}`);
    return [];
  }
};
