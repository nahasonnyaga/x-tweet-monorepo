import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import { stripe } from '@lib/stripe';
import { supabase } from '@lib/supabase';

export const config = {
  api: { bodyParser: false },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as any;

      // Save payment info in Supabase
      await supabase.from('payments').insert([
        {
          user_id: session.client_reference_id,
          amount: session.amount_total,
          currency: session.currency,
          stripe_session_id: session.id,
          status: 'completed',
        },
      ]);

      console.log(`Payment for ${session.client_reference_id} succeeded.`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
