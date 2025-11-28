// packages/X-tweet/src/lib/payments.ts
import { getSupabase, MSResponse, success, fail } from './microservice-utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Minimal payments microservice
 * - createPaymentIntent (store record)
 * - handleWebhook (mark completed)
 *
 * Integrate with Stripe or your provider by adding provider-specific code.
 */
export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();
  try {
    switch (action) {
      case 'createPayment': {
        const { user_id, amount, currency = 'USD', provider = 'stripe', metadata } = params;
        if (!user_id || !amount) return fail('user_id and amount required');
        const id = uuidv4();
        const { data, error } = await supabase.from('payments').insert([{ id, user_id, amount, currency, provider, status: 'created', metadata }]).select().single();
        if (error) return fail(error.message);
        return success(data);
      }

      case 'markPaid': {
        const { payment_id, provider_tx_id } = params;
        if (!payment_id) return fail('payment_id required');
        const { error } = await supabase.from('payments').update({ status: 'paid', provider_tx_id }).eq('id', payment_id);
        if (error) return fail(error.message);
        // Optionally, credit wallet or create receipts
        return success({ payment_id });
      }

      default:
        return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
