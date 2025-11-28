export default {
  name: 'x-tweet-seo',
  ready: true,
  init: async () => console.log('[x-tweet-seo] initialized.'),
  async generateMeta(url: string) {
    console.log('[x-tweet-seo] Generating meta for:', url);
    return { title: 'Example', description: 'Example description' };
  }
};
