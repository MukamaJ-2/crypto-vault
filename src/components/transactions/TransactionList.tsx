import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  ExternalLink
} from 'lucide-react';
import { useSavingsStore, Transaction } from '../../store/savingsStore';

type FilterType = 'all' | 'deposit' | 'withdrawal';
type StatusFilter = 'all' | 'completed' | 'pending' | 'failed';

interface ExtendedTransaction extends Transaction {
  planName: string;
}

const TransactionList: React.FC = () => {
  const { plans } = useSavingsStore();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  // Get all transactions with plan names
  const allTransactions: ExtendedTransaction[] = plans
    .flatMap(plan => 
      plan.transactions.map(tx => ({
        ...tx,
        planName: plan.name,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Apply filters
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesType && matchesStatus;
  });

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
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <p className="text-dark-300 mb-4">No transactions found.</p>
          <a href="/savings-plans" className="btn-primary">Create a Savings Plan</a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold text-dark-100 mb-4 sm:mb-0">Transaction History</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as FilterType)}
              className="appearance-none pl-8 pr-10 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
            </select>
            <Filter size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-dark-400" />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="appearance-none pl-8 pr-10 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <Filter size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-dark-400" />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-dark-800">
              <th className="pb-3 text-dark-400 font-medium text-sm">Type</th>
              <th className="pb-3 text-dark-400 font-medium text-sm">Plan</th>
              <th className="pb-3 text-dark-400 font-medium text-sm">Date</th>
              <th className="pb-3 text-dark-400 font-medium text-sm">Amount</th>
              <th className="pb-3 text-dark-400 font-medium text-sm">Crypto</th>
              <th className="pb-3 text-dark-400 font-medium text-sm">Status</th>
              <th className="pb-3 text-dark-400 font-medium text-sm">Transaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-center text-dark-400">
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-dark-800/30">
                  <td className="py-4">
                    <div className={`flex items-center w-min rounded-full px-2 py-1 ${
                      tx.type === 'deposit' 
                        ? 'bg-success-500/10 text-success-500' 
                        : 'bg-accent-500/10 text-accent-500'
                    }`}>
                      {tx.type === 'deposit' 
                        ? <ArrowDownLeft size={16} className="mr-1" /> 
                        : <ArrowUpRight size={16} className="mr-1" />}
                      <span className="text-xs capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="py-4 text-dark-200">{tx.planName}</td>
                  <td className="py-4 text-dark-300 text-sm">
                    {format(new Date(tx.date), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="py-4">
                    <span className={
                      tx.type === 'deposit' ? 'text-success-500' : 'text-accent-500'
                    }>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 text-dark-300 text-sm">
                    {tx.cryptoAmount.toFixed(8)} {tx.cryptoType === 'btc' ? 'BTC' : 'SOL'}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center">
                      {getStatusIcon(tx.status)}
                      <span className="ml-1 text-sm capitalize">{tx.status}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    {tx.txHash ? (
                      <a 
                        href={`https://explorer.${tx.cryptoType === 'btc' ? 'bitcoin' : 'solana'}.com/tx/${tx.txHash}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-400 flex items-center"
                      >
                        <span className="text-sm mr-1">View</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-dark-500 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TransactionList;