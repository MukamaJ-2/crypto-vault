import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Bitcoin, ArrowRight } from 'lucide-react';
import { useSavingsStore } from '../../store/savingsStore';

interface CreatePlanFormProps {
  onSuccess?: () => void;
}

const CreatePlanForm: React.FC<CreatePlanFormProps> = ({ onSuccess }) => {
  const { createPlan } = useSavingsStore();
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: 1000,
    weeklyContribution: 50,
    preferredCrypto: 'btc' as 'btc' | 'solana',
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Please enter a name for your savings plan');
      return;
    }
    
    if (formData.targetAmount <= 0) {
      setError('Target amount must be greater than 0');
      return;
    }
    
    if (formData.weeklyContribution <= 0) {
      setError('Weekly contribution must be greater than 0');
      return;
    }
    
    if (formData.weeklyContribution * 26 < formData.targetAmount) {
      setError('Weekly contributions over 6 months are not enough to reach your target. Either increase your weekly contribution or decrease your target.');
      return;
    }
    
    createPlan(formData);
    
    if (onSuccess) {
      onSuccess();
    }
    
    // Reset form
    setFormData({
      name: '',
      targetAmount: 1000,
      weeklyContribution: 50,
      preferredCrypto: 'btc',
    });
    setStep(1);
    setError('');
  };

  const nextStep = () => {
    if (step === 1 && !formData.name.trim()) {
      setError('Please enter a name for your savings plan');
      return;
    }
    
    if (step === 2) {
      if (formData.targetAmount <= 0) {
        setError('Target amount must be greater than 0');
        return;
      }
      
      if (formData.weeklyContribution <= 0) {
        setError('Weekly contribution must be greater than 0');
        return;
      }
    }
    
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-dark-100 mb-6">Create a New Savings Plan</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                stepNumber === step
                  ? 'bg-primary-500 text-white'
                  : stepNumber < step
                  ? 'bg-success-500 text-white'
                  : 'bg-dark-800 text-dark-400'
              }`}>
                {stepNumber}
              </div>
              
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  stepNumber < step ? 'bg-success-500' : 'bg-dark-800'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-error-500/10 border border-error-500/20 text-error-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Step 1: Name */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <label htmlFor="name" className="label">What are you saving for?</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., New Laptop, Vacation, Emergency Fund"
                className="input-field"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="btn-primary flex items-center"
                onClick={nextStep}
              >
                Next <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Step 2: Amounts */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <label htmlFor="targetAmount" className="label">Target Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-dark-400">$</span>
                <input
                  type="number"
                  id="targetAmount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="input-field pl-8"
                  min="1"
                  step="1"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="weeklyContribution" className="label">Weekly Contribution (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-dark-400">$</span>
                <input
                  type="number"
                  id="weeklyContribution"
                  name="weeklyContribution"
                  value={formData.weeklyContribution}
                  onChange={handleChange}
                  className="input-field pl-8"
                  min="1"
                  step="1"
                />
              </div>
              <p className="text-dark-400 text-xs mt-2">
                At this rate, you'll save ${(formData.weeklyContribution * 26).toFixed(2)} over 6 months.
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="btn-outline"
                onClick={prevStep}
              >
                Back
              </button>
              
              <button
                type="button"
                className="btn-primary flex items-center"
                onClick={nextStep}
              >
                Next <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Payment Method */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <label className="label">Select Preferred Cryptocurrency</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.preferredCrypto === 'btc'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-700 hover:border-dark-600'
                }`}>
                  <input
                    type="radio"
                    name="preferredCrypto"
                    value="btc"
                    checked={formData.preferredCrypto === 'btc'}
                    onChange={() => setFormData({ ...formData, preferredCrypto: 'btc' })}
                    className="sr-only"
                  />
                  <Bitcoin size={24} className="text-yellow-500 mr-3" />
                  <div>
                    <div className="font-medium">Bitcoin (BTC)</div>
                    <div className="text-xs text-dark-400">The original cryptocurrency</div>
                  </div>
                </label>
                
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.preferredCrypto === 'solana'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-700 hover:border-dark-600'
                }`}>
                  <input
                    type="radio"
                    name="preferredCrypto"
                    value="solana"
                    checked={formData.preferredCrypto === 'solana'}
                    onChange={() => setFormData({ ...formData, preferredCrypto: 'solana' })}
                    className="sr-only"
                  />
                  <CreditCard size={24} className="text-purple-500 mr-3" />
                  <div>
                    <div className="font-medium">Solana (SOL)</div>
                    <div className="text-xs text-dark-400">Fast, low-fee transactions</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="mb-8 p-4 bg-dark-800/50 rounded-lg">
              <h3 className="text-sm font-medium text-dark-200 mb-2">Summary</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-dark-400">Plan Name:</span>
                  <span className="text-dark-200">{formData.name}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-dark-400">Target Amount:</span>
                  <span className="text-dark-200">${formData.targetAmount.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-dark-400">Weekly Contribution:</span>
                  <span className="text-dark-200">${formData.weeklyContribution.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-dark-400">Preferred Cryptocurrency:</span>
                  <span className="text-dark-200">{formData.preferredCrypto === 'btc' ? 'Bitcoin (BTC)' : 'Solana (SOL)'}</span>
                </li>
                <li className="flex justify-between border-t border-dark-700 pt-2 mt-2">
                  <span className="text-dark-400">Total Over 6 Months:</span>
                  <span className="text-dark-200">${(formData.weeklyContribution * 26).toFixed(2)}</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="btn-outline"
                onClick={prevStep}
              >
                Back
              </button>
              
              <button
                type="submit"
                className="btn-primary"
              >
                Create Savings Plan
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default CreatePlanForm;