export default {
  name: 'x-tweet-notifications-queue',
  ready: true,
  init: async () => console.log('[x-tweet-notifications-queue] initialized.'),
  async enqueue(notification: any) {
    console.log('[x-tweet-notifications-queue] Queued notification:', notification);
  }
};
