import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import Alert from './Alert';
import {
  HiOutlineBookOpen,
  HiOutlineMail,
  HiChevronRight,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiArrowRight
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
    {
      title: "Discover",
      links: [
        { name: "Home", to: "/" },
        { name: "Books", to: "/books" },
        { name: "Categories", to: "/books" },
        { name: "New Arrivals", to: "/books?sort=newest" },
        { name: "Best Sellers", to: "/books?sort=popular" },
        { name: "Special Offers", to: "/books?discount=true" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", to: "/about" },
        { name: "Contact", to: "/contact" },
        { name: "Careers", to: "#" },
        { name: "Press", to: "#" },
        { name: "Blog", to: "#" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", to: "#" },
        { name: "Order Status", to: "#" },
        { name: "Shipping Info", to: "#" },
        { name: "Returns & Exchanges", to: "#" },
        { name: "Gift Cards", to: "#" },
      ]
    }
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

  // Handle newsletter subscription (mock)
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
    <footer className="relative z-30 mt-24 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-2xl border-t border-border-light dark:border-border-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand and Newsletter */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="flex flex-col gap-6"
        >
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-light dark:text-primary-dark drop-shadow-lg">
            <HiOutlineBookOpen className="w-8 h-8" />
            BookStore
          </Link>
          <p className="text-text_secondary-light dark:text-text_secondary-dark max-w-xs">
            Your trusted online bookstore for every genre and every reader.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
            <label htmlFor="newsletter" className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark">
              Subscribe to our newsletter
            </label>
            <div className="flex gap-2">
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-primary-light/30 dark:focus:ring-primary-dark/30 flex-1"
                required
              />
              <Button type="submit" variant="primary" size="sm" className="px-5">
                Subscribe
              </Button>
            </div>
            <AnimatePresence>
              {subscriptionStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-success-light dark:text-success-dark text-sm mt-1"
                >
                  Subscribed!
                </motion.div>
              )}
              {subscriptionStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-error-light dark:text-error-dark text-sm mt-1"
                >
                  Please enter a valid email.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Footer Links */}
        {footerLinks.map((section, i) => (
          <motion.div
            key={section.title}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={i + 1}
            className="flex flex-col gap-3"
          >
            <h4 className="font-bold text-lg text-text_primary-light dark:text-text_primary-dark mb-2">
              {section.title}
            </h4>
            <ul className="flex flex-col gap-2">
              {section.links.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      {/* Social and copyright */}
      <div className="border-t border-border-light dark:border-border-dark py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/60 dark:bg-gray-900/60">
        <div className="flex gap-4">
          {[FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaFacebook].map((Icon, idx) => (
            <motion.a
              key={idx}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, color: '#22c55e' }}
              className="text-xl text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
              aria-label="Social link"
            >
              <Icon />
            </motion.a>
          ))}
        </div>
        <div className="text-sm text-text_secondary-light dark:text-text_secondary-dark text-center md:text-right">
          &copy; {currentYear} BookStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
