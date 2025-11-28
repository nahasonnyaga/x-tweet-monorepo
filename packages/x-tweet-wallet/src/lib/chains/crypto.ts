export async function sendCrypto(currency: string, to: string, amount: number) {
  console.log(`Sending ${amount} ${currency} to ${to}`);
  return { status: "success", txId: "TX12345" };
}

export async function receiveCrypto(currency: string) {
  return { status: "success", balance: 0 };
}
