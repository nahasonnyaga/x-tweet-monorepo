export async function sendMomo(number: string, amount: number, currency = "KES") {
  console.log(`Sending ${amount} ${currency} to ${number} via M-Pesa`);
  return { status: "success", reference: "MPESA123" };
}

export async function receiveMomo() {
  return { status: "success", balance: 0 };
}
