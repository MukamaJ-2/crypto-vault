import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  TrendingUp, 
  CreditCard, 
  AlertCircle
} from 'lucide-react';
import { useSavingsStore } from '../store/savingsStore';
import SavingsOverview from '../components/dashboard/SavingsOverview';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const Dashboard: React.FC = () => {
  const { plans, addTransaction, getCurrentPlan } = useSavingsStore();
  const currentPlan = getCurrentPlan();
  
  // Mock automatic weekly deposit for demonstration purposes
  useEffect(() => {
    // Only add a transaction if there's an active plan
    if (currentPlan && currentPlan.transactions.length < 3) {
      // Add initial transaction to demonstrate functionality
      const delay = 1000; // 1 second delay
      
      const addDemoTransaction = () => {
        addTransaction({
          planId: currentPlan.id,
          amount: currentPlan.weeklyContribution,
          cryptoAmount: currentPlan.preferredCrypto === 'btc' 
            ? currentPlan.weeklyContribution / 50000  // Mock BTC price
            : currentPlan.weeklyContribution / 100,   // Mock Solana price
          cryptoType: currentPlan.preferredCrypto,
          type: 'deposit',
        });
      };
      
      const timer = setTimeout(addDemoTransaction, delay);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlan]);

  return (
    <div>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-dark-100">Dashboard</h1>
        <p className="text-dark-400 mt-1">
          Track your savings progress and manage your plans
        </p>
      </motion.div>
      
      {plans.length === 0 ? (
        <motion.div
          className="glass-card text-center py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle size={48} className="mx-auto text-dark-500 mb-4" />
          <h2 className="text-2xl font-semibold text-dark-200 mb-2">Welcome to CryptoVault</h2>
          <p className="text-dark-400 max-w-md mx-auto mb-6">
            Start your crypto savings journey by creating your first savings plan. 
            Weekly contributions, 6-month lock period, secure your future.
          </p>
          <a href="/savings-plans" className="btn-primary inline-flex items-center">
            <PlusCircle size={18} className="mr-2" />
            Create Your First Plan
          </a>
        </motion.div>
      ) : (
        <>
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Active Plans</p>
                  <p className="text-3xl font-bold text-dark-100 mt-1">
                    {plans.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <PlusCircle size={20} className="text-primary-500" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Total Weekly Savings</p>
                  <p className="text-3xl font-bold text-dark-100 mt-1">
                    ${plans
                      .filter(p => p.status === 'active')
                      .reduce((sum, p) => sum + p.weeklyContribution, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-success-500/20 flex items-center justify-center">
                  <TrendingUp size={20} className="text-success-500" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm">Total Transactions</p>
                  <p className="text-3xl font-bold text-dark-100 mt-1">
                    {plans.reduce((sum, p) => sum + p.transactions.length, 0)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                  <CreditCard size={20} className="text-accent-500" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main content */}
          <SavingsOverview />
          <RecentTransactions />
        </>
      )}
    </div>
  );
};

export default Dashboard;