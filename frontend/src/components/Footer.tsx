import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com' },
    { icon: FaTwitter, href: 'https://twitter.com' },
    { icon: FaLinkedin, href: 'https://linkedin.com' },
  ];

  const hoverEffect = { scale: 1.1 };

  return (
    <footer className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-text_primary-light dark:text-text_primary-dark mb-2">
              <HiOutlineBookOpen className="h-6 w-6 text-primary-light dark:text-primary-dark" />
              <span>BookStore</span>
            </Link>
            <p className="text-sm text-text_secondary-light dark:text-text_secondary-dark text-center md:text-left">
              Your favorite place to find new stories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text_primary-light dark:text-text_primary-dark mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-text_secondary-light dark:text-text_secondary-dark">
              <li><Link to="/" className="hover:text-primary-light dark:hover:text-primary-dark">Home</Link></li>
              <li><Link to="/books" className="hover:text-primary-light dark:hover:text-primary-dark">Books</Link></li>
              <li><Link to="/about" className="hover:text-primary-light dark:hover:text-primary-dark">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-light dark:hover:text-primary-dark">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-text_primary-light dark:text-text_primary-dark mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-text_secondary-light dark:text-text_secondary-dark">
              <li><Link to="#" className="hover:text-primary-light dark:hover:text-primary-dark">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary-light dark:hover:text-primary-dark">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-text_primary-light dark:text-text_primary-dark mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={hoverEffect}
                  className="text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark"
                >
                  <link.icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-text_secondary-light dark:text-text_secondary-dark">
          <p>&copy; {new Date().getFullYear()} BookStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
