export default {
    name: 'x-tweet-payments',
    ready: true,
    init: async () => console.log('[x-tweet-payments] initialized.'),
    async pay(userId, amount) {
        console.log(`[x-tweet-payments] ${userId} paid ${amount}`);
        return { success: true };
    }
};
