import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import Button from './Button'; // Import our new Button component
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  HiOutlineBookOpen,
  HiOutlineShoppingCart,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineShieldCheck,
  HiOutlineSearch,
  HiChevronDown,
  HiOutlineHome,
  HiOutlineInformationCircle,
  HiOutlineMail,
  HiOutlinePhone,
} from 'react-icons/hi';

const navLinks = [
  { to: '/books', text: 'Books', icon: HiOutlineBookOpen },
  { to: '/about', text: 'About', icon: HiOutlineInformationCircle },
  { to: '/contact', text: 'Contact', icon: HiOutlineMail },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Add scroll detection for enhanced navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when search bar is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  // Handle escape key to close search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSearch(false);
    }
  };

  // Animation variants
  const navbarVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Mobile menu animation variants
  const mobileMenuVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const menuItemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Add glassmorphism and shadow to navbar
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo and Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary-light dark:text-primary-dark drop-shadow-lg hover:scale-105 transition-transform duration-200"
        >
          <HiOutlineBookOpen className="w-8 h-8" />
          BookStore
        </Link>
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, text, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 hover:scale-105 ${
                  isActive
                    ? 'bg-primary-light/20 dark:bg-primary-dark/20 text-primary-light dark:text-primary-dark shadow-md'
                    : 'text-gray-700 dark:text-gray-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {text}
            </NavLink>
          ))}
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Search Bar */}
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:flex"
                onSubmit={handleSearchSubmit}
              >
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text_secondary-light dark:text-text_secondary-dark">
                    <HiOutlineSearch size={18} />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search books..."
                    className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary-light/30 dark:focus:ring-primary-dark/30"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text_secondary-light dark:text-text_secondary-dark hover:text-text_primary-light dark:hover:text-text_primary-dark"
                    onClick={() => setShowSearch(false)}
                    aria-label="Close search"
                  >
                    <HiOutlineX size={16} />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:flex p-2 rounded-full text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowSearch(true)}
                aria-label="Search"
              >
                <HiOutlineSearch size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/cart"
              className={({ isActive }) => `
                relative p-2 rounded-full 
                ${isActive 
                  ? "bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark" 
                  : "text-text_secondary-light dark:text-text_secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-light dark:hover:text-primary-dark"}
                transition-colors duration-200
              `}
              aria-label="Shopping Cart"
            >
              <HiOutlineShoppingCart size={20} />
              {user && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-medium text-white bg-accent-light dark:bg-accent-dark shadow-low"
                >
                  1
                </motion.span>
              )}
            </NavLink>

            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Button
                    to="/admin"
                    size="sm"
                    variant="secondary"
                    icon={<HiOutlineShieldCheck size={16} />}
                    iconPosition="left"
                    ariaLabel="Admin Dashboard"
                  >
                    Admin
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  icon={<HiOutlineLogout size={16} />}
                  iconPosition="left"
                  onClick={handleLogout}
                  ariaLabel="Logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                to="/login"
                size="sm"
                variant="primary"
                icon={<HiOutlineLogin size={16} />}
                iconPosition="left"
                ariaLabel="Login"
              >
                Login
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            <button
              onClick={() => setShowSearch(prev => !prev)}
              className="md:hidden p-2 rounded-full text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={showSearch ? "Close search" : "Search"}
            >
              <HiOutlineSearch size={20} />
            </button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-text_primary-light dark:text-text_primary-dark hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-b border-border-light dark:border-border-dark"
          >
            <form onSubmit={handleSearchSubmit} className="p-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text_secondary-light dark:text-text_secondary-dark">
                  <HiOutlineSearch size={18} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary-light/30 dark:focus:ring-primary-dark/30"
                  autoFocus
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden overflow-hidden bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark"
          >
            <div className="p-4 flex flex-col gap-4">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    variants={menuItemVariants}
                    custom={index}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg
                         ${isActive 
                          ? "bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark font-medium" 
                          : "text-text_secondary-light dark:text-text_secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"}`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <link.icon className="h-5 w-5" />
                      <span>{link.text}</span>
                    </NavLink>
                  </motion.div>
                ))}

                <motion.div variants={menuItemVariants}>
                  <NavLink
                    to="/cart"
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg
                       ${isActive 
                        ? "bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark font-medium" 
                        : "text-text_secondary-light dark:text-text_secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"}`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <HiOutlineShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                    {user && (
                      <span className="ml-auto px-1.5 py-0.5 rounded text-xs font-medium text-white bg-accent-light dark:bg-accent-dark">
                        1
                      </span>
                    )}
                  </NavLink>
                </motion.div>
              </nav>

              {/* Mobile auth buttons */}
              <motion.div variants={menuItemVariants} className="mt-2 pt-4 border-t border-border-light dark:border-border-dark">
                {user ? (
                  <div className="flex flex-col gap-2">
                    {user.role === 'ADMIN' && (
                      <Button
                        to="/admin"
                        variant="secondary"
                        icon={<HiOutlineShieldCheck size={18} />}
                        iconPosition="left"
                        isFullWidth
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Dashboard
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      icon={<HiOutlineLogout size={18} />}
                      iconPosition="left"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      isFullWidth
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      to="/login"
                      variant="primary"
                      icon={<HiOutlineLogin size={18} />}
                      iconPosition="left"
                      isFullWidth
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Button>
                    <Button
                      to="/register"
                      variant="outline"
                      icon={<HiOutlineUser size={18} />}
                      iconPosition="left"
                      isFullWidth
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
