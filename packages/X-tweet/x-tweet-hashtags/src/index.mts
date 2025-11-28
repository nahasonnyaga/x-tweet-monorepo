export default {
  name: 'x-tweet-hashtags',
  ready: true,
  init: async () => console.log('[x-tweet-hashtags] initialized.'),
  async extract(content: string) {
    const matches = content.match(/#\w+/g) ?? [];
    console.log('[x-tweet-hashtags] Extracted:', matches);
    return matches;
  }
};
