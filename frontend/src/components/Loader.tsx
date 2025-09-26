import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  label?: string;
  size?: number | 'sm' | 'md' | 'lg';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  label = 'Loading...',
  size = 24,
  className = ''
}) => {
  // Convert string sizes to pixels
  let sizeInPixels = size;
  if (typeof size === 'string') {
    switch (size) {
      case 'sm':
        sizeInPixels = 16;
        break;
      case 'md':
        sizeInPixels = 24;
        break;
      case 'lg':
        sizeInPixels = 32;
        break;
      default:
        sizeInPixels = 24;
    }
  }

  return (
    <div
      className={`w-full flex flex-col items-center justify-center py-10 gap-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <motion.div
        style={{
          width: sizeInPixels,
          height: sizeInPixels,
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
