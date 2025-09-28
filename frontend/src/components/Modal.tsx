import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 22 } },
  exit: { opacity: 0, y: 60, scale: 0.98, transition: { duration: 0.18 } },
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          className={`relative bg-white/80 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark max-w-lg w-full mx-4 p-8 backdrop-blur-lg ${className}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={e => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
          {title && <h2 className="text-xl font-bold mb-4 text-text_primary-light dark:text-text_primary-dark">{title}</h2>}
          <div>{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;

