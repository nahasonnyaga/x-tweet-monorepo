import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2022-11-15" });

export async function chargeCard(amount: number, currency: string, source: string) {
  return stripe.paymentIntents.create({
    amount,
    currency,
    payment_method: source,
    confirm: true,
  });
}
