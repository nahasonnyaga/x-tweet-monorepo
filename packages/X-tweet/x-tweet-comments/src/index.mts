export default {
  name: 'x-tweet-comments',
  ready: true,
  init: async () => console.log('[x-tweet-comments] initialized.'),
  async addComment(tweetId: string, userId: string, comment: string) {
    console.log(`[x-tweet-comments] ${userId} commented on ${tweetId}:`, comment);
    return { success: true };
  }
};
