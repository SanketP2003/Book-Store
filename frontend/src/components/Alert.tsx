import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
} from 'react-icons/hi';

interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  className?: string;
}

const alertConfig = {
  error: {
    icon: HiOutlineExclamationCircle,
    bgClass: 'bg-red-50 dark:bg-red-900/20',
    textClass: 'text-red-700 dark:text-red-400',
    iconClass: 'text-red-500',
  },
  success: {
    icon: HiOutlineCheckCircle,
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    textClass: 'text-green-700 dark:text-green-400',
    iconClass: 'text-green-500',
  },
  info: {
    icon: HiOutlineInformationCircle,
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    textClass: 'text-blue-700 dark:text-blue-400',
    iconClass: 'text-blue-500',
  },
};

const Alert: React.FC<AlertProps> = ({ type = 'error', message, className = '' }) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`${config.bgClass} p-4 rounded-lg shadow-md flex items-start space-x-4 ${className}`}
      role="alert"
    >
      <Icon className={`h-6 w-6 ${config.iconClass} mt-0.5`} />
      <div className="flex-1">
        <p className={`font-semibold ${config.textClass}`}>{message}</p>
      </div>
    </motion.div>
  );
};

export default Alert;
