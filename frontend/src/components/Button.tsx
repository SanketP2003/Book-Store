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
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    text: 'btn-text',
  }[variant];

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size];

  const base = `btn ${variantClass} ${sizeClass} ${isFullWidth ? 'w-full flex justify-center' : ''} ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`.trim();

  const motionProps = !isDisabled && !isLoading
    ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: { type: 'spring', stiffness: 300, damping: 20 } }
    : {};

  const content = (
    <>
      {isLoading && (
        <motion.div
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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

  if (to) {
    return (
      <Link
        to={to}
        className={`relative ${base}`}
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
        className={`relative ${base}`}
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
      className={`relative ${base}`}
      onClick={onClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-busy={isLoading}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;
