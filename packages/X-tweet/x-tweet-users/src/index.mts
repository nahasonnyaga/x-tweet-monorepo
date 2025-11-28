export default {
  name: 'x-tweet-users',
  ready: true,
  init: async () => console.log('[x-tweet-users] initialized.'),
  async getUser(userId: string) {
    console.log(`[x-tweet-users] Fetching user ${userId}`);
    return { userId, name: 'User' };
  }
};
