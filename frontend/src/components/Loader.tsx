import React from 'react';
import { motion } from 'framer-motion';

export type LoaderType = 'spinner' | 'pulse' | 'skeleton';
export type LoaderSize = number | 'sm' | 'md' | 'lg';

export interface LoaderProps {
  type?: LoaderType;
  size?: LoaderSize;
  label?: string | null;
  className?: string;
  isFullPage?: boolean;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  type = 'spinner',
  size = 'md',
  label = 'Loading...',
  className = '',
  isFullPage = false,
  color,
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

  // Determine container classes
  const containerClasses = isFullPage
    ? 'fixed inset-0 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-50'
    : `flex flex-col items-center justify-center py-6 ${className}`;

  // Determine color classes
  const colorClass = color || 'text-primary-light dark:text-primary-dark';

  // Render different loader types
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <motion.div
            style={{
              width: sizeInPixels,
              height: sizeInPixels,
              borderRadius: '50%',
              border: `${Math.max(2, sizeInPixels / 10)}px solid currentColor`,
              borderTopColor: 'transparent',
            }}
            className={colorClass}
            animate={{ rotate: 360 }}
            transition={{ loop: Infinity, ease: 'linear', duration: 0.8 }}
            aria-hidden="true"
          />
        );

      case 'pulse':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                style={{
                  width: sizeInPixels / 3,
                  height: sizeInPixels / 3,
                  borderRadius: '50%',
                }}
                className={colorClass}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        );

      case 'skeleton':
        return (
          <div className="w-full">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 last:mb-0"
                style={{ width: index === 0 ? '100%' : index === 1 ? '80%' : '60%' }}
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Add ellipsis animation to label if provided
  const LabelWithEllipsis = ({ text }: { text: string }) => (
    <span className="relative">
      {text}
      <span className="absolute">
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.2 }}
        >
          .
        </motion.span>
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.4 }}
        >
          .
        </motion.span>
      </span>
    </span>
  );

  return (
    <div
      className={containerClasses}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        {renderLoader()}

        {label && type !== 'skeleton' && (
          <p className="text-text_secondary-light dark:text-text_secondary-dark text-body-sm font-medium mt-2">
            <LabelWithEllipsis text={label} />
          </p>
        )}
      </div>

      {/* Visually hidden text for screen readers */}
      <span className="sr-only">{label || 'Loading'}</span>
    </div>
  );
};

export default Loader;
