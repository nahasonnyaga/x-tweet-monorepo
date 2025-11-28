export default {
  name: 'x-tweet-payments',
  ready: true,
  init: async () => console.log('[x-tweet-payments] initialized.'),
  async pay(userId: string, amount: number) {
    console.log(`[x-tweet-payments] ${userId} paid ${amount}`);
    return { success: true };
  }
};
