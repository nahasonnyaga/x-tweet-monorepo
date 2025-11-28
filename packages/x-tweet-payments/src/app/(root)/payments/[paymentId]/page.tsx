'use client';

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface PaymentPageProps {
  params: { paymentId: string };
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '');

const PaymentPage = ({ params }: PaymentPageProps) => {
  const { paymentId } = params;

  const handleCheckout = async () => {
    const res = await fetch('/api/createStripeSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 1000, // in cents
        currency: 'usd',
        successUrl: window.location.href,
        cancelUrl: window.location.href,
      }),
    });

    const data = await res.json();
    const stripe = await stripePromise;
    if (stripe && data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <p>Processing payment ID: {paymentId}</p>
      <button onClick={handleCheckout} className="btn-primary">
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
