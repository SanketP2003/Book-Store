import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiX,
  HiExclamation,
} from 'react-icons/hi';

export interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  message: string;
  className?: string;
  onClose?: () => void;
  duration?: number | null; // Auto-dismiss duration in ms, null for no auto-dismiss
  isVisible?: boolean;
}

const alertConfig = {
  error: {
    icon: HiOutlineExclamationCircle,
    bgClass: 'bg-error-light/10 dark:bg-error-dark/10',
    textClass: 'text-error-light dark:text-error-dark',
    iconClass: 'text-error-light dark:text-error-dark',
    borderClass: 'border-l-4 border-error-light dark:border-error-dark',
    progressClass: 'bg-error-light dark:bg-error-dark',
  },
  success: {
    icon: HiOutlineCheckCircle,
    bgClass: 'bg-success-light/10 dark:bg-success-dark/10',
    textClass: 'text-success-light dark:text-success-dark',
    iconClass: 'text-success-light dark:text-success-dark',
    borderClass: 'border-l-4 border-success-light dark:border-success-dark',
    progressClass: 'bg-success-light dark:bg-success-dark',
  },
  info: {
    icon: HiOutlineInformationCircle,
    bgClass: 'bg-info-light/10 dark:bg-info-dark/10',
    textClass: 'text-info-light dark:text-info-dark',
    iconClass: 'text-info-light dark:text-info-dark',
    borderClass: 'border-l-4 border-info-light dark:border-info-dark',
    progressClass: 'bg-info-light dark:bg-info-dark',
  },
  warning: {
    icon: HiExclamation,
    bgClass: 'bg-warning-light/10 dark:bg-warning-dark/10',
    textClass: 'text-warning-light dark:text-warning-dark',
    iconClass: 'text-warning-light dark:text-warning-dark',
    borderClass: 'border-l-4 border-warning-light dark:border-warning-dark',
    progressClass: 'bg-warning-light dark:bg-warning-dark',
  },
};

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  message,
  className = '',
  onClose,
  duration = 4000,
  isVisible = true,
}) => {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (duration && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, visible, onClose]);

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className={`relative flex items-start gap-3 px-5 py-4 rounded-xl shadow-high backdrop-blur-md ${config.bgClass} ${config.borderClass} ${className}`}
          role="alert"
        >
          <span className={`mt-1 ${config.iconClass}`}><Icon size={24} /></span>
          <div className={`flex-1 ${config.textClass} font-medium text-base`}>{message}</div>
          {onClose && (
            <button
              onClick={() => { setVisible(false); onClose(); }}
              className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close alert"
            >
              <HiX size={18} />
            </button>
          )}
          {/* Progress bar for auto-dismiss */}
          {duration && (
            <motion.div
              className={`absolute left-0 bottom-0 h-1 rounded-b-xl ${config.progressClass}`}
              initial={{ width: '100%' }}
              animate={{ width: 0 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
