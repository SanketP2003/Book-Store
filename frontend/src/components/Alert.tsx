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
  type = 'error',
  message,
  className = '',
  onClose,
  duration = null,
  isVisible = true
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;
  const [remainingTime, setRemainingTime] = useState(100);
  const [shouldRender, setShouldRender] = useState(isVisible);

  // Handle auto-dismiss countdown
  useEffect(() => {
    if (!duration || !isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const percentage = (remaining / duration) * 100;

      setRemainingTime(percentage);

      if (percentage <= 0 && onClose) {
        clearInterval(timer);
        onClose();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [duration, onClose, isVisible]);

  // Track visibility for animation
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  // Animation variants
  const alertVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const handleClose = () => {
    setShouldRender(false);
    if (onClose) setTimeout(onClose, 200); // Delay onClose until after exit animation
  };

  return (
    <AnimatePresence onExitComplete={() => setShouldRender(false)}>
      {shouldRender && isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={alertVariants}
          className={`${config.bgClass} ${config.borderClass} p-4 rounded-lg shadow-medium flex items-start space-x-4 relative overflow-hidden ${className}`}
          role="alert"
        >
          <div className="flex-shrink-0 mt-0.5">
            <Icon className={`h-5 w-5 ${config.iconClass}`} />
          </div>

          <div className="flex-1">
            <p className={`${config.textClass} text-body-md`}>
              {message}
            </p>
          </div>

          {onClose && (
            <button
              onClick={handleClose}
              className={`flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 ${config.textClass} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type} focus:ring-${type}`}
              aria-label="Dismiss"
            >
              <HiX className="h-4 w-4" />
            </button>
          )}

          {/* Progress indicator for timed alerts */}
          {duration && (
            <motion.div
              className={`absolute bottom-0 left-0 h-1 ${config.progressClass}`}
              initial={{ width: "100%" }}
              animate={{ width: `${remainingTime}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
