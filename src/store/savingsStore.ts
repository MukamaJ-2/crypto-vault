import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addWeeks, isBefore } from 'date-fns';
import { supabase } from '../lib/supabase';
import type { Tables } from '../lib/supabase';

export type SavingsPlan = Tables['savings_plans'];
export type Transaction = Tables['transactions'];

interface SavingsState {
  plans: SavingsPlan[];
  isLoading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  createPlan: (plan: Omit<SavingsPlan, 'id' | 'user_id' | 'created_at' | 'status'>) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'status'>) => Promise<void>;
  withdrawFunds: (planId: string) => Promise<boolean>;
  getCurrentPlan: () => SavingsPlan | null;
  getTotalSaved: () => number;
  canWithdraw: (planId: string) => boolean;
}

// Helper to convert USD to crypto (mock values)
const convertToCrypto = (amount: number, type: 'btc' | 'solana'): number => {
  if (type === 'btc') {
    // Mock conversion at $50,000 per BTC
    return amount / 50000;
  } else {
    // Mock conversion at $100 per SOL
    return amount / 100;
  }
};

export const useSavingsStore = create<SavingsState>()(
  persist(
    (set, get) => ({
      plans: [],
      isLoading: false,
      error: null,
      
      fetchPlans: async () => {
        set({ isLoading: true });
        try {
          const { data: plans, error } = await supabase
            .from('savings_plans')
            .select(`
              *,
              transactions (*)
            `)
            .order('created_at', { ascending: false });

          if (error) throw error;

          set({ plans: plans || [], isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch plans',
            isLoading: false 
          });
        }
      },
      
      createPlan: async (planData) => {
        set({ isLoading: true });
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Not authenticated');

          const maturityDate = addWeeks(new Date(), 26); // 6 months (26 weeks)
          
          const { data: plan, error } = await supabase
            .from('savings_plans')
            .insert([{
              user_id: user.id,
              ...planData,
              maturity_date: maturityDate.toISOString(),
              status: 'active',
            }])
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            plans: [plan, ...state.plans],
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create plan',
            isLoading: false 
          });
        }
      },
      
      addTransaction: async (transactionData) => {
        set({ isLoading: true });
        try {
          const { data: transaction, error } = await supabase
            .from('transactions')
            .insert([{
              ...transactionData,
              status: 'completed',
            }])
            .select()
            .single();

          if (error) throw error;

          await get().fetchPlans(); // Refresh plans to get updated data
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add transaction',
            isLoading: false 
          });
        }
      },
      
      withdrawFunds: async (planId) => {
        if (!get().canWithdraw(planId)) {
          return false;
        }

        try {
          const plan = get().plans.find((p) => p.id === planId);
          if (!plan) return false;

          // Calculate total saved
          const totalSaved = get().plans
            .find((p) => p.id === planId)
            ?.transactions
            .filter((t) => t.type === 'deposit' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0) || 0;

          // Create withdrawal transaction
          await supabase.from('transactions').insert([{
            plan_id: planId,
            amount: totalSaved,
            crypto_amount: convertToCrypto(totalSaved, plan.preferred_crypto),
            crypto_type: plan.preferred_crypto,
            status: 'completed',
            type: 'withdrawal',
          }]);

          // Update plan status
          await supabase
            .from('savings_plans')
            .update({ status: 'withdrawn' })
            .eq('id', planId);

          await get().fetchPlans(); // Refresh plans
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to withdraw funds'
          });
          return false;
        }
      },
      
      getCurrentPlan: () => {
        const activePlans = get().plans.filter((p) => p.status === 'active');
        return activePlans.length > 0 ? activePlans[0] : null;
      },
      
      getTotalSaved: () => {
        return get().plans.reduce((total, plan) => {
          const planTotal = plan.transactions
            .filter((t) => t.type === 'deposit' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);
          return total + planTotal;
        }, 0);
      },
      
      canWithdraw: (planId) => {
        const plan = get().plans.find((p) => p.id === planId);
        if (!plan) return false;
        
        const maturityDate = new Date(plan.maturity_date);
        const now = new Date();
        
        return !isBefore(now, maturityDate) && plan.status === 'active';
      },
    }),
    {
      name: 'savings-storage',
    }
  )
);