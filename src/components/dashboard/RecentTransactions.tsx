import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  XCircle, 
  Clock
} from 'lucide-react';
import { useSavingsStore, Transaction } from '../../store/savingsStore';

const RecentTransactions: React.FC = () => {
  const { plans } = useSavingsStore();
  
  // Get all transactions and sort by date (newest first)
  const allTransactions = plans
    .flatMap(plan => plan.transactions.map(tx => ({
      ...tx,
      planName: plan.name,
    })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Get only the 5 most recent

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success-500" />;
      case 'failed':
        return <XCircle size={16} className="text-error-500" />;
      case 'pending':
        return <Clock size={16} className="text-warning-500" />;
      default:
        return null;
    }
  };

  if (allTransactions.length === 0) {
    return (
      <motion.div
        className="glass-card mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-xl font-semibold text-dark-100 mb-4">Recent Transactions</h2>
        <div className="text-center py-6">
          <p className="text-dark-300">No transactions yet.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-dark-100">Recent Transactions</h2>
        <a 
          href="/transactions" 
          className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
        >
          View all
        </a>
      </div>
      
      <div className="overflow-hidden">
        <ul className="divide-y divide-dark-800">
          {allTransactions.map((tx) => (
            <li key={tx.id} className="py-4">
              <motion.div 
                className="flex items-center justify-between"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    tx.type === 'deposit' 
                      ? 'bg-success-500/10 text-success-500' 
                      : 'bg-accent-500/10 text-accent-500'
                  }`}>
                    {tx.type === 'deposit' 
                      ? <ArrowDownLeft size={20} /> 
                      : <ArrowUpRight size={20} />}
                  </div>
                  
                  <div>
                    <p className="text-dark-200 font-medium">
                      {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </p>
                    <p className="text-dark-400 text-sm">
                      {tx.planName} • {formatDistanceToNow(new Date(tx.date), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      tx.type === 'deposit' ? 'text-success-500' : 'text-accent-500'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                    {getStatusIcon(tx.status)}
                  </div>
                  <p className="text-dark-400 text-xs">
                    {tx.cryptoAmount.toFixed(8)} {tx.cryptoType === 'btc' ? 'BTC' : 'SOL'}
                  </p>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default RecentTransactions;