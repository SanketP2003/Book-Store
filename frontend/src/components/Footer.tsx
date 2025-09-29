import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import {
  HiOutlineBookOpen,
} from 'react-icons/hi';
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebook
} from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<null | 'success' | 'error'>(null);

  const footerLinks = [
    { title: 'Discover', links: [
      { name: 'Home', to: '/' },
      { name: 'Books', to: '/books' },
      { name: 'Categories', to: '/books' },
      { name: 'New Arrivals', to: '/books?sort=newest' },
      { name: 'Best Sellers', to: '/books?sort=popular' },
      { name: 'Special Offers', to: '/books?discount=true' },
    ]},
    { title: 'Company', links: [
      { name: 'About Us', to: '/about' },
      { name: 'Contact', to: '/contact' },
      { name: 'Careers', to: '#' },
      { name: 'Press', to: '#' },
      { name: 'Blog', to: '#' },
    ]},
    { title: 'Support', links: [
      { name: 'Help Center', to: '#' },
      { name: 'Order Status', to: '#' },
      { name: 'Shipping Info', to: '#' },
      { name: 'Returns & Exchanges', to: '#' },
      { name: 'Gift Cards', to: '#' },
    ]},
  ];

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, type: 'spring', stiffness: 80, damping: 18 },
    }),
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscriptionStatus('success');
      setEmail('');
      setTimeout(() => setSubscriptionStatus(null), 3000);
    } else {
      setSubscriptionStatus('error');
      setTimeout(() => setSubscriptionStatus(null), 3000);
    }
  };

  return (
    <footer className="relative z-30 mt-24 footer-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand and Newsletter */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={0} className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold hover:text-[var(--accent-primary)] transition-colors">
            <HiOutlineBookOpen className="w-8 h-8" />
            BookStore
          </Link>
          <p className="max-w-xs" style={{ color: 'var(--text-secondary)' }}>
            Your trusted online bookstore for every genre and every reader.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
            <label htmlFor="newsletter" className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Subscribe to our newsletter
            </label>
            <div className="flex gap-2">
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="form-input flex-1"
                required
              />
              <Button type="submit" variant="primary" size="sm" className="px-5">
                Subscribe
              </Button>
            </div>
            <AnimatePresence>
              {subscriptionStatus === 'success' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-sm" style={{ color: 'var(--success)' }}>
                  Subscribed!
                </motion.div>
              )}
              {subscriptionStatus === 'error' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-sm" style={{ color: 'var(--error)' }}>
                  Please enter a valid email.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Footer Links */}
        {footerLinks.map((section, i) => (
          <motion.div key={section.title} variants={sectionVariants} initial="hidden" animate="visible" custom={i + 1} className="flex flex-col gap-3">
            <h4 className="font-bold text-lg footer-section-title mb-2">{section.title}</h4>
            <ul className="flex flex-col gap-2">
              {section.links.map(link => (
                <li key={link.name}>
                  <Link to={link.to} className="footer-link transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Social and copyright */}
      <div className="footer-divider py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4" style={{ backgroundColor: 'color-mix(in oklab, var(--bg-primary) 70%, transparent)', borderTopWidth: 1 }}>
        <div className="flex gap-4">
          {[FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaFacebook].map((Icon, idx) => (
            <motion.a key={idx} href="#" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.2 }} className="text-xl footer-link" aria-label="Social link">
              <Icon />
            </motion.a>
          ))}
        </div>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          &copy; {currentYear} BookStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
