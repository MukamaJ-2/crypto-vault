import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PiggyBank, 
  Clock, 
  RefreshCw, 
  User, 
  LogOut, 
  X 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { logout, user } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Savings Plans', to: '/savings-plans', icon: <PiggyBank size={20} /> },
    { name: 'Transactions', to: '/transactions', icon: <RefreshCw size={20} /> },
    { name: 'Profile', to: '/profile', icon: <User size={20} /> },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-dark-900/90 backdrop-blur-sm border-r border-dark-800">
      {/* Mobile close button */}
      {onClose && (
        <div className="lg:hidden absolute right-4 top-4">
          <button
            type="button"
            className="text-dark-400 hover:text-dark-200"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-6 border-b border-dark-800">
        <motion.div
          className="flex items-center space-x-2 text-primary-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Clock size={24} className="text-primary-500" />
          <span className="text-xl font-bold">CryptoVault</span>
        </motion.div>
      </div>

      {/* User info */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-dark-800">
        <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mb-2">
          <span className="text-2xl font-bold text-primary-500">
            {user?.name.charAt(0) || 'U'}
          </span>
        </div>
        <h3 className="text-sm font-medium text-dark-200">{user?.name}</h3>
        <p className="text-xs text-dark-400 mt-1">{user?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
              }`
            }
            onClick={onClose}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout button */}
      <div className="px-4 py-6 border-t border-dark-800">
        <button
          type="button"
          className="flex items-center px-4 py-3 text-sm font-medium text-dark-300 rounded-lg hover:bg-dark-800 hover:text-dark-100 w-full transition-colors"
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;