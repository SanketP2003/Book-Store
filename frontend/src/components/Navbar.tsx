import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import Button from './Button';
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
} from 'react-icons/hi';

const navLinks = [
  { to: '/books', text: 'Books', icon: HiOutlineBookOpen },
  { to: '/about', text: 'About', icon: HiOutlineUser },
  { to: '/contact', text: 'Contact', icon: HiOutlineLogin },
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

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'nav-bar' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
          <HiOutlineBookOpen className="w-8 h-8" />
          BookStore
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, text, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    <HiOutlineSearch size={18} />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search books..."
                    className="nav-search-input"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 nav-icon-btn"
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
                className="hidden md:flex nav-icon-btn"
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
              className={({ isActive }) => `nav-icon-btn ${isActive ? 'text-accent bg-accent-12' : ''}`}
              aria-label="Shopping Cart"
            >
              <HiOutlineShoppingCart size={20} />
            </NavLink>

            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Button to="/admin" size="sm" variant="secondary" ariaLabel="Admin Dashboard">Admin</Button>
                )}
                <Button size="sm" variant="outline" onClick={handleLogout} ariaLabel="Logout">
                  Logout
                </Button>
              </>
            ) : (
              <Button to="/login" size="sm" variant="primary" ariaLabel="Login">Login</Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            <button
              onClick={() => setShowSearch(prev => !prev)}
              className="md:hidden nav-icon-btn"
              aria-label={showSearch ? 'Close search' : 'Search'}
            >
              <HiOutlineSearch size={20} />
            </button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden nav-icon-btn"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'open'}
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
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t" style={{ borderColor: 'var(--card-border)' }}>
            <form onSubmit={handleSearchSubmit} className="p-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <HiOutlineSearch size={18} />
                </span>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books..." className="nav-search-input" autoFocus />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-b" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="p-4 flex flex-col gap-2">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => setIsOpen(false)}>
                    <link.icon className="h-5 w-5" />
                    <span>{link.text}</span>
                  </NavLink>
                ))}

                <NavLink to="/cart" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => setIsOpen(false)}>
                  <HiOutlineShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </NavLink>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
