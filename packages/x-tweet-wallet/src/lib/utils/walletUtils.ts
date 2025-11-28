export function generateWalletId(userId: string) {
  return `wallet_${userId}_${Date.now()}`;
}

export function formatBalance(amount: number) {
  return (amount / 100).toFixed(2);
}
