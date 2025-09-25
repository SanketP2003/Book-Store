import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineBookOpen,
  HiOutlineShoppingCart,
  HiOutlineLogout,
  HiOutlineLogin,
  HiMenu,
  HiX,
} from 'react-icons/hi';

const navLinks = [
  { to: '/books', text: 'Books' },
  { to: '/about', text: 'About' },
  { to: '/contact', text: 'Contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-surface-dark/95 backdrop-blur-lg shadow-soft border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 h-18 flex items-center justify-between">
        {/* Logo and Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-xl text-text_primary-light dark:text-text_primary-dark group"
          >
            <span className="relative flex items-center justify-center w-10 h-10">
              <span className="absolute w-8 h-8 bg-gradient-to-br from-primary-light to-highlight-light dark:from-primary-dark dark:to-highlight-dark rounded-lg -rotate-6 group-hover:rotate-0 transition-transform duration-300"></span>
              <HiOutlineBookOpen className="h-6 w-6 text-white z-10" />
            </span>
            <span className="bg-gradient-to-r from-primary-light to-highlight-light dark:from-primary-dark dark:to-highlight-dark bg-clip-text text-transparent">BookStore</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-light dark:text-primary-dark font-semibold relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary-light dark:after:bg-primary-dark after:bottom-[-6px] after:left-0"
                    : "hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary-light/50 dark:after:bg-primary-dark/50 after:bottom-[-6px] after:left-0 hover:after:w-full after:transition-all after:duration-300"
                }
              >
                {link.text}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/cart"
              className="relative p-2 rounded-full text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 transition-colors duration-200"
            >
              <HiOutlineShoppingCart size={22} />
              {user && (
                <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full text-xs font-medium text-white bg-accent-light dark:bg-accent-dark">1</span>
              )}
            </NavLink>

            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/admin')}
                    className="bg-gradient-to-r from-highlight-light to-primary-light dark:from-highlight-dark dark:to-primary-dark text-white font-semibold py-2 px-4 rounded-xl shadow-soft transition-all duration-200"
                  >
                    Admin
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="btn-secondary flex items-center gap-2"
                >
                  <HiOutlineLogout size={20} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn-primary flex items-center gap-2"
              >
                <HiOutlineLogin size={20} />
                <span>Login</span>
              </motion.button>
            )}
          </div>

          <div className="border-l border-gray-200 dark:border-gray-700 h-8 mx-1 hidden md:block"></div>

          <ThemeSwitcher />

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-text_primary-light dark:text-text_primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-[72px] left-0 w-full bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col items-center gap-4 p-6">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `text-lg font-medium py-2 ${
                    isActive 
                      ? "text-primary-light dark:text-primary-dark" 
                      : "text-text_secondary-light dark:text-text_secondary-dark"
                  }`}
                >
                  {link.text}
                </NavLink>
              ))}
              <div className="w-full h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              <NavLink
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-lg font-medium py-2 text-text_secondary-light dark:text-text_secondary-dark"
              >
                <HiOutlineShoppingCart size={22} /> Cart
                {user && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium text-white bg-accent-light dark:bg-accent-dark">1</span>
                )}
              </NavLink>

              {/* Rest of mobile menu code */}
              {user ? (
                <div className="w-full flex flex-col gap-3 mt-2">
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => { navigate('/admin'); setIsOpen(false); }}
                      className="w-full btn-primary"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button onClick={handleLogout} className="w-full btn-secondary flex items-center justify-center gap-2">
                    <HiOutlineLogout size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                  className="w-full btn-primary flex items-center justify-center gap-2 mt-2"
                >
                  <HiOutlineLogin size={20} />
                  <span>Login</span>
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
