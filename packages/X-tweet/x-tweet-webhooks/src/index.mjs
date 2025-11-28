export default {
    name: 'x-tweet-webhooks',
    ready: true,
    init: async () => console.log('[x-tweet-webhooks] initialized.'),
    async trigger(event, payload) {
        console.log(`[x-tweet-webhooks] event: ${event}`, payload);
        return { success: true };
    }
};
