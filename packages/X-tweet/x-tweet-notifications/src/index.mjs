export default {
    name: 'x-tweet-notifications',
    ready: true,
    init: async () => console.log('[x-tweet-notifications] initialized.'),
    async send(userId, message) {
        console.log(`[x-tweet-notifications] Sent to ${userId}:`, message);
    }
};
