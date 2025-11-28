export default {
  name: 'x-tweet-videos',
  ready: true,
  init: async () => console.log('[x-tweet-videos] initialized.'),
  async uploadVideo(userId: string, file: any) {
    console.log(`[x-tweet-videos] ${userId} uploaded video`, file);
    return { success: true };
  }
};
