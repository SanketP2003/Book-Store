import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineExternalLink } from 'react-icons/hi';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  href?: string;
  to?: string;
  external?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  isFullWidth = false,
  isDisabled = false,
  href,
  to,
  external = false,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
}) => {
  // Determine base styles by variant
  const baseStyles = {
    primary: 'bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white shadow-lg',
    secondary: 'bg-gradient-to-r from-secondary-light to-primary-light dark:from-secondary-dark dark:to-primary-dark text-white shadow-lg',
    outline: 'bg-transparent border border-border-light dark:border-border-dark text-text_primary-light dark:text-text_primary-dark',
    text: 'bg-transparent text-primary-light dark:text-primary-dark shadow-none hover:bg-primary-light/5 dark:hover:bg-primary-dark/10',
  };

  // Determine size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl',
  };

  // Animation for tap/hover
  const motionProps = {
    whileHover: !isDisabled && !isLoading ? { scale: 1.04, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' } : {},
    whileTap: !isDisabled && !isLoading ? { scale: 0.96 } : {},
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  };

  // Loading, hover, focus, and disabled states
  const stateStyles = `
    font-medium transition-all duration-300
    ${isFullWidth ? 'w-full flex justify-center' : 'inline-flex'} 
    items-center gap-2
    ${!isDisabled ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-60 cursor-not-allowed'}
    focus:outline-none focus:ring-2 focus:ring-primary-light/40 dark:focus:ring-primary-dark/40
  `;

  // Shadow effect based on variant
  const shadowEffect = variant === 'text' ? '' : 'hover:shadow-high';

  // Combine all styles
  const buttonStyles = `
    ${baseStyles[variant]} 
    ${sizeStyles[size]} 
    ${stateStyles} 
    ${shadowEffect}
    ${className}
  `;

  // Content with loading state
  const content = (
    <>
      {isLoading && (
        <motion.div
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      )}

      {icon && iconPosition === 'left' && !isLoading && (
        <span className="button-icon">{icon}</span>
      )}

      <span className={isLoading ? 'opacity-80' : ''}>
        {children}
      </span>

      {icon && iconPosition === 'right' && !isLoading && (
        <span className="button-icon">{icon}</span>
      )}

      {external && (
        <HiOutlineExternalLink className="ml-1 h-4 w-4" />
      )}
    </>
  );

  // The ripple effect animation
  const RippleEffect = ({ onClick }: { onClick?: (e: React.MouseEvent<HTMLDivElement>) => void }) => {
    return (
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-md"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="ripple-effect"
          initial={{ scale: 0, x: 0, y: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '100%',
            width: 100,
            height: 100,
            marginLeft: -50,
            marginTop: -50,
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    );
  };

  // Render as button, Link, or anchor based on props
  if (to) {
    return (
      <Link
        to={to}
        className={`relative ${buttonStyles}`}
        onClick={onClick as any}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-disabled={isDisabled}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={`relative ${buttonStyles}`}
        onClick={onClick as any}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-disabled={isDisabled}
      >
        {content}
      </a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled || isLoading}
      className={`relative ${buttonStyles}`}
      onClick={onClick}
      whileTap={!isDisabled && !isLoading ? { scale: 0.98 } : undefined}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={isLoading}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;
