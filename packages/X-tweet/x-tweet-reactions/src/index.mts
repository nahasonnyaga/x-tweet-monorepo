export default {
  name: 'x-tweet-reactions',
  ready: true,
  init: async () => console.log('[x-tweet-reactions] initialized.'),
  async like(tweetId: string, userId: string) {
    console.log(`[x-tweet-reactions] ${userId} liked tweet ${tweetId}`);
    return { success: true };
  },
  async retweet(tweetId: string, userId: string) {
    console.log(`[x-tweet-reactions] ${userId} retweeted ${tweetId}`);
    return { success: true };
  }
};
