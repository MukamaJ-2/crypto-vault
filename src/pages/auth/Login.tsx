import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Mail, Lock, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Login: React.FC = () => {
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Clock className="h-12 w-12 text-primary-500" />
        </motion.div>
        <motion.h2
          className="mt-6 text-center text-3xl font-extrabold text-dark-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Sign in to CryptoVault
        </motion.h2>
        <motion.p
          className="mt-2 text-center text-sm text-dark-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Start your savings journey with cryptocurrency
        </motion.p>
      </div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="glass-card">
          {error && (
            <div className="mb-4 p-3 bg-error-500/10 border border-error-500/20 rounded-lg flex items-center text-error-500">
              <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-dark-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-dark-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-900 text-dark-400">
                  Or
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-dark-400 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-500 hover:text-primary-400 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-dark-800/50 rounded-lg">
            <p className="text-dark-300 text-sm text-center">
              <span className="block mb-1 text-dark-200 font-medium">Demo Credentials</span>
              Email: demo@example.com<br />
              Password: password
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;