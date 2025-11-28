export default {
    name: 'x-tweet-search',
    ready: true,
    init: async () => console.log('[x-tweet-search] initialized.'),
    async search(query) {
        console.log('[x-tweet-search] Searching for:', query);
        return [];
    }
};
