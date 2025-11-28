// packages/X-tweet/src/lib/wallet.ts
import { getSupabase, MSResponse, success, fail } from './microservice-utils';
import { v4 as uuidv4 } from 'uuid';

type WalletRow = {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  updated_at?: string;
};

export async function handle(action: string, params: any = {}): Promise<MSResponse> {
  const supabase = getSupabase();

  try {
    switch (action) {
      case 'ping':
        return success({ service: 'wallet' });

      case 'getBalance': {
        const { user_id } = params;
        if (!user_id) return fail('user_id required');
        const { data, error } = await supabase.from<WalletRow>('wallets').select('*').eq('user_id', user_id).single();
        if (error) return fail(error.message);
        return success(data ?? { user_id, balance: 0, currency: 'USD' });
      }

      case 'deposit': {
        const { user_id, amount, metadata } = params;
        if (!user_id || !amount) return fail('user_id and amount required');
        // 1) upsert wallet
        const { data: wData, error: wErr } = await supabase
          .from('wallets')
          .upsert({ user_id, balance: 0 }, { onConflict: 'user_id' })
          .select()
          .single();
        if (wErr) return fail(wErr.message);
        // 2) add transaction
        const txId = uuidv4();
        const { error: txErr } = await supabase.from('wallet_transactions').insert([{
          id: txId, user_id, amount, type: 'deposit', metadata, status: 'completed'
        }]);
        if (txErr) return fail(txErr.message);
        // 3) update balance
        const { error: updErr } = await supabase.rpc('wallet_increment_balance', { p_user_id: user_id, p_amount: amount });
        // If you don't have a stored procedure, fallback to update:
        if (updErr) {
          const { data: cur, error: curErr } = await supabase.from('wallets').select('balance').eq('user_id', user_id).single();
          if (curErr) return fail(curErr.message);
          const newBal = (cur.balance ?? 0) + amount;
          const { error: u2 } = await supabase.from('wallets').update({ balance: newBal }).eq('user_id', user_id);
          if (u2) return fail(u2.message);
        }
        return success({ txId });
      }

      case 'withdraw': {
        const { user_id, amount } = params;
        if (!user_id || !amount) return fail('user_id and amount required');
        // Check balance
        const { data, error } = await supabase.from('wallets').select('balance').eq('user_id', user_id).single();
        if (error) return fail(error.message);
        const balance = data?.balance ?? 0;
        if (balance < amount) return fail('Insufficient funds');
        // create transaction
        const txId = uuidv4();
        const { error: txErr } = await supabase.from('wallet_transactions').insert([{ id: txId, user_id, amount, type: 'withdraw', status: 'pending' }]);
        if (txErr) return fail(txErr.message);
        // deduct (use rpc or update)
        const { data: cur, error: curErr } = await supabase.from('wallets').select('balance').eq('user_id', user_id).single();
        if (curErr) return fail(curErr.message);
        const newBal = (cur.balance ?? 0) - amount;
        const { error: u2 } = await supabase.from('wallets').update({ balance: newBal }).eq('user_id', user_id);
        if (u2) return fail(u2.message);
        // mark tx completed
        await supabase.from('wallet_transactions').update({ status: 'completed' }).eq('id', txId);
        return success({ txId, balance: newBal });
      }

      default:
        return fail('Unknown action: ' + action);
    }
  } catch (err: any) {
    return fail(err.message || String(err));
  }
}
