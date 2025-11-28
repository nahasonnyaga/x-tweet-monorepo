export default {
  name: 'x-tweet-admin',
  ready: true,
  init: async () => console.log('[x-tweet-admin] initialized.'),
  async getStats() {
    console.log('[x-tweet-admin] Fetching stats');
    return {};
  }
};
