import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'react-icons/hi';

const navLinks = [
  { to: '/books', text: 'Books' },
  { to: '/about', text: 'About' },
  { to: '/contact', text: 'Contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 dark:bg-surface-dark/95 shadow-soft-md backdrop-blur-lg" 
          : "bg-white dark:bg-surface-dark"
      } border-b border-gray-100 dark:border-gray-800/50`}
    >
      <div className="container-padded h-18 flex items-center justify-between">
        {/* Logo and Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-xl text-text_primary-light dark:text-text_primary-dark group"
            aria-label="BookStore Home"
          >
            <motion.span
              className="relative flex items-center justify-center w-10 h-10"
              whileHover={{ rotate: [0, -5, 0, -5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="absolute w-8 h-8 bg-gradient-to-br from-green-600 to-green-400 dark:from-green-500 dark:to-green-300 rounded-lg -rotate-6 group-hover:rotate-0 transition-transform duration-300"></span>
              <HiOutlineBookOpen className="h-6 w-6 text-white z-10" />
            </motion.span>
            <span className="text-gradient">BookStore</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary-light dark:text-primary-dark font-semibold hover-underline after:w-full"
                    : "hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 hover-underline"
                }
              >
                {link.text}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Search Bar */}
          <AnimatePresence>
            {showSearch ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:block"
                onSubmit={handleSearchSubmit}
              >
                <div className="search-bar">
                  <span className="icon">
                    <HiOutlineSearch size={18} />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className="w-full"
                    autoFocus
                  />
                </div>
              </motion.form>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:flex p-2 rounded-full text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                onClick={() => setShowSearch(true)}
                aria-label="Search"
              >
                <HiOutlineSearch size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/cart"
              className="relative p-2 rounded-full text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
              aria-label="Shopping Cart"
            >
              <HiOutlineShoppingCart size={22} />
              {user && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center rounded-full text-xs font-medium text-white bg-accent-light dark:bg-accent-dark"
                >
                  1
                </motion.span>
              )}
            </NavLink>

            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/admin')}
                    className="btn btn-sm bg-gradient-green text-white font-semibold py-1.5 px-3 rounded-lg shadow-soft"
                    aria-label="Admin Dashboard"
                  >
                    <HiOutlineShieldCheck size={18} />
                    <span className="ml-1">Admin</span>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="btn btn-sm btn-primary flex items-center gap-2"
                  aria-label="Logout"
                >
                  <HiOutlineLogout size={18} />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="btn btn-sm btn-primary flex items-center gap-2"
                aria-label="Login"
              >
                <HiOutlineLogin size={18} />
                <span>Login</span>
              </motion.button>
            )}
          </div>

          <div className="border-l border-gray-200 dark:border-gray-700 h-8 mx-1 hidden md:block"></div>

          <ThemeSwitcher />

          <div className="md:hidden flex gap-2">
            <button
              onClick={() => setShowSearch(prev => !prev)}
              className="p-2 rounded-full text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              aria-label="Search"
            >
              <HiOutlineSearch size={20} />
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-text_primary-light dark:text-text_primary-dark hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
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
            className="md:hidden overflow-hidden border-b border-gray-100 dark:border-gray-800"
          >
            <form onSubmit={handleSearchSubmit} className="p-3">
              <div className="search-bar">
                <span className="icon">
                  <HiOutlineSearch size={18} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books..."
                  className="w-full"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-[72px] left-0 w-full bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 shadow-soft-lg overflow-hidden"
          >
            <nav className="flex flex-col items-center gap-4 p-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full"
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `block text-center text-lg font-medium py-3 px-5 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? "text-primary-light dark:text-primary-dark bg-green-50 dark:bg-green-900/20" 
                        : "text-text_secondary-light dark:text-text_secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {link.text}
                  </NavLink>
                </motion.div>
              ))}
              <div className="w-full h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="w-full"
              >
                <NavLink
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 text-lg font-medium py-3 px-5 rounded-lg text-text_secondary-light dark:text-text_secondary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <HiOutlineShoppingCart size={22} /> Cart
                  {user && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium text-white bg-accent-light dark:bg-accent-dark">1</span>
                  )}
                </NavLink>
              </motion.div>

              {/* Rest of mobile menu code */}
              {user ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.05 }}
                  className="w-full flex flex-col gap-3 mt-2"
                >
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => { navigate('/admin'); setIsOpen(false); }}
                      className="w-full btn btn-primary flex items-center justify-center gap-2"
                    >
                      <HiOutlineShieldCheck size={20} />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full btn btn-primary flex items-center justify-center gap-2"
                  >
                    <HiOutlineLogout size={20} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navLinks.length + 1) * 0.05 }}
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                  className="w-full btn btn-primary flex items-center justify-center gap-2 mt-2"
                >
                  <HiOutlineLogin size={20} />
                  <span>Login</span>
                </motion.button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
