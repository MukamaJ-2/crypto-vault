import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useSavingsStore } from '../store/savingsStore';
import PlanList from '../components/savings/PlanList';
import CreatePlanForm from '../components/savings/CreatePlanForm';

const SavingsPlans: React.FC = () => {
  const { plans } = useSavingsStore();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div>
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-dark-100">Savings Plans</h1>
          <p className="text-dark-400 mt-1">
            Manage your time-locked savings plans
          </p>
        </div>
        
        {plans.length > 0 && !showCreateForm && (
          <motion.button
            className="btn-primary mt-4 sm:mt-0 flex items-center"
            onClick={() => setShowCreateForm(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <PlusCircle size={18} className="mr-2" />
            New Plan
          </motion.button>
        )}
      </motion.div>
      
      {showCreateForm ? (
        <CreatePlanForm onSuccess={() => setShowCreateForm(false)} />
      ) : (
        <PlanList />
      )}
    </div>
  );
};

export default SavingsPlans;