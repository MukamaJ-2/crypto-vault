import React from 'react';
import { motion } from 'framer-motion';
import { format, isBefore } from 'date-fns';
import { Bitcoin, CreditCard, Clock, Lock, Unlock, AlertCircle } from 'lucide-react';
import { useSavingsStore, SavingsPlan } from '../../store/savingsStore';

const PlanList: React.FC = () => {
  const { plans, canWithdraw, withdrawFunds } = useSavingsStore();
  
  const handleWithdraw = (planId: string) => {
    if (canWithdraw(planId)) {
      withdrawFunds(planId);
    }
  };
  
  const getSavedAmount = (plan: SavingsPlan) => {
    return plan.transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  const getProgressPercentage = (plan: SavingsPlan) => {
    const savedAmount = getSavedAmount(plan);
    return (savedAmount / plan.targetAmount) * 100;
  };
  
  if (plans.length === 0) {
    return (
      <motion.div
        className="glass-card mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-dark-500 mb-4" />
          <h3 className="text-xl font-medium text-dark-200 mb-2">No Savings Plans Yet</h3>
          <p className="text-dark-400 mb-6">You haven't created any savings plans yet.</p>
          <a href="/savings-plans/create" className="btn-primary">Create Your First Plan</a>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {plans.map((plan) => {
        const savedAmount = getSavedAmount(plan);
        const progressPercentage = getProgressPercentage(plan);
        const isMatured = !isBefore(new Date(), new Date(plan.maturityDate));
        
        return (
          <motion.div
            key={plan.id}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    plan.preferredCrypto === 'btc' 
                      ? 'bg-yellow-500/10 text-yellow-500' 
                      : 'bg-purple-500/10 text-purple-500'
                  }`}>
                    {plan.preferredCrypto === 'btc' 
                      ? <Bitcoin size={20} /> 
                      : <CreditCard size={20} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-dark-100">{plan.name}</h3>
                    <div className="flex items-center text-dark-400 text-sm">
                      <span className="mr-2">
                        {plan.preferredCrypto === 'btc' ? 'Bitcoin' : 'Solana'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-dark-600 mr-2"></span>
                      <span>
                        Created on {format(new Date(plan.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  plan.status === 'active'
                    ? 'bg-primary-500/20 text-primary-400'
                    : plan.status === 'completed'
                    ? 'bg-success-500/20 text-success-400'
                    : 'bg-accent-500/20 text-accent-400'
                }`}>
                  {plan.status === 'active' ? 'Active' : 
                   plan.status === 'completed' ? 'Completed' : 'Withdrawn'}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm text-dark-400 mb-2">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-dark-800 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, progressPercentage)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-dark-800/50 rounded-lg">
                <p className="text-dark-400 text-sm mb-1">Saved Amount</p>
                <p className="text-lg font-semibold text-dark-100">${savedAmount.toFixed(2)}</p>
              </div>
              
              <div className="p-4 bg-dark-800/50 rounded-lg">
                <p className="text-dark-400 text-sm mb-1">Target Amount</p>
                <p className="text-lg font-semibold text-dark-100">${plan.targetAmount.toFixed(2)}</p>
              </div>
              
              <div className="p-4 bg-dark-800/50 rounded-lg">
                <p className="text-dark-400 text-sm mb-1">Weekly Contribution</p>
                <p className="text-lg font-semibold text-dark-100">${plan.weeklyContribution.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center text-dark-400">
                {plan.status === 'active' && (
                  <>
                    {isMatured ? (
                      <Unlock size={16} className="mr-2 text-success-500" />
                    ) : (
                      <Lock size={16} className="mr-2" />
                    )}
                    <span className="text-sm">
                      {isMatured 
                        ? 'Funds available for withdrawal' 
                        : `Locked until ${format(new Date(plan.maturityDate), 'MMM d, yyyy')}`}
                    </span>
                  </>
                )}
                {plan.status === 'withdrawn' && (
                  <span className="text-sm flex items-center">
                    <Clock size={16} className="mr-2" />
                    Withdrawn on {format(
                      new Date(
                        plan.transactions
                          .find(t => t.type === 'withdrawal')?.date || new Date()
                      ), 
                      'MMM d, yyyy'
                    )}
                  </span>
                )}
              </div>
              
              {plan.status === 'active' && isMatured && (
                <button
                  onClick={() => handleWithdraw(plan.id)}
                  className="btn-accent"
                >
                  Withdraw Funds
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default PlanList;