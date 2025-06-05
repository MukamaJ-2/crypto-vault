import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Wallet, Save, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    btcWalletAddress: user?.btcWalletAddress || '',
    solanaWalletAddress: user?.solanaWalletAddress || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    
    // Update profile
    updateProfile(formData);
    setIsEditing(false);
    setError('');
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-dark-100">Profile</h1>
        <p className="text-dark-400 mt-1">
          Manage your account settings and wallet addresses
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile info */}
        <div className="lg:col-span-2">
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-dark-100">Account Information</h2>
              
              {!isEditing && (
                <button
                  type="button"
                  className="btn-outline text-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {saveSuccess && (
              <div className="mb-6 p-3 bg-success-500/10 border border-success-500/20 rounded-lg text-success-500 flex items-center">
                <Save size={18} className="mr-2" />
                <span>Profile updated successfully!</span>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-3 bg-error-500/10 border border-error-500/20 rounded-lg text-error-500 flex items-center">
                <AlertTriangle size={18} className="mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="label">
                    Full Name
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={16} className="text-dark-500" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-dark-900 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="label">
                    Email Address
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-dark-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field pl-10 ${!isEditing ? 'bg-dark-900 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="btcWalletAddress" className="label">
                    Bitcoin Wallet Address
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Wallet size={16} className="text-dark-500" />
                    </div>
                    <input
                      id="btcWalletAddress"
                      name="btcWalletAddress"
                      type="text"
                      value={formData.btcWalletAddress}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "Enter your BTC wallet address" : "No BTC wallet address"}
                      className={`input-field pl-10 ${!isEditing ? 'bg-dark-900 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="solanaWalletAddress" className="label">
                    Solana Wallet Address
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Wallet size={16} className="text-dark-500" />
                    </div>
                    <input
                      id="solanaWalletAddress"
                      name="solanaWalletAddress"
                      type="text"
                      value={formData.solanaWalletAddress}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "Enter your Solana wallet address" : "No Solana wallet address"}
                      className={`input-field pl-10 ${!isEditing ? 'bg-dark-900 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          btcWalletAddress: user?.btcWalletAddress || '',
                          solanaWalletAddress: user?.solanaWalletAddress || '',
                        });
                        setError('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Security settings (simplified) */}
        <div>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-dark-100 mb-6">Security</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-dark-800 rounded-lg">
                <div>
                  <p className="font-medium text-dark-200">Password</p>
                  <p className="text-dark-400 text-sm">Last changed 30 days ago</p>
                </div>
                <button className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-dark-800 rounded-lg">
                <div>
                  <p className="font-medium text-dark-200">Two-Factor Authentication</p>
                  <p className="text-dark-400 text-sm">Not enabled</p>
                </div>
                <button className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                  Setup
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-dark-800 rounded-lg">
                <div>
                  <p className="font-medium text-dark-200">Session</p>
                  <p className="text-dark-400 text-sm">Manage active sessions</p>
                </div>
                <button className="text-primary-500 hover:text-primary-400 text-sm font-medium">
                  View
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;