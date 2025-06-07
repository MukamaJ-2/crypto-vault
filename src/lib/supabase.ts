import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  users: {
    id: string;
    email: string;
    name: string;
    btc_wallet_address?: string;
    solana_wallet_address?: string;
    created_at: string;
  };
  savings_plans: {
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    weekly_contribution: number;
    preferred_crypto: 'btc' | 'solana';
    maturity_date: string;
    status: 'active' | 'completed' | 'withdrawn';
    created_at: string;
  };
  transactions: {
    id: string;
    plan_id: string;
    amount: number;
    crypto_amount: number;
    crypto_type: 'btc' | 'solana';
    status: 'pending' | 'completed' | 'failed';
    type: 'deposit' | 'withdrawal';
    tx_hash?: string;
    created_at: string;
  };
};