export default {
  name: 'x-tweet-media',
  ready: true,
  init: async () => console.log('[x-tweet-media] initialized.'),
  async upload(userId: string, file: any) {
    console.log(`[x-tweet-media] ${userId} uploaded media`, file);
    return { success: true };
  }
};
