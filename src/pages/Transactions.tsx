import React from 'react';
import { motion } from 'framer-motion';
import TransactionList from '../components/transactions/TransactionList';

const Transactions: React.FC = () => {
  return (
    <div>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-dark-100">Transactions</h1>
        <p className="text-dark-400 mt-1">
          View and manage all your transactions
        </p>
      </motion.div>
      
      <TransactionList />
    </div>
  );
};

export default Transactions;