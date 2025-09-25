import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  label?: string;
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({ label = 'Loading...', size = 24 }) => {
  return (
    <div 
      className="w-full flex flex-col items-center justify-center py-10 gap-4"
      role="status"
      aria-live="polite"
    >
      <motion.div
        style={{ 
          width: size, 
          height: size, 
          border: '3px solid', 
          borderTopColor: 'transparent',
          borderRadius: '50%',
        }}
        className="text-primary-light dark:text-primary-dark"
        animate={{ rotate: 360 }}
        transition={{ loop: Infinity, ease: 'linear', duration: 1 }}
      />
      {label && <span className="text-text_secondary-light dark:text-text_secondary-dark">{label}</span>}
    </div>
  );
};

export default Loader;
