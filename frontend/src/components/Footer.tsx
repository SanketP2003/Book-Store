import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineBookOpen, HiOutlineMail, HiChevronRight } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Discover",
      links: [
        { name: "Home", to: "/" },
        { name: "Books", to: "/books" },
        { name: "Categories", to: "/books" },
        { name: "New Arrivals", to: "/books?sort=newest" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", to: "/about" },
        { name: "Contact", to: "/contact" },
        { name: "Careers", to: "#" },
        { name: "Press", to: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", to: "#" },
        { name: "Privacy Policy", to: "#" },
        { name: "Cookie Policy", to: "#" },
        { name: "Accessibility", to: "#" },
      ]
    }
  ];

  const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here
    // This preserves existing functionality (nothing changes)
    console.log('Newsletter form submitted');
  };

  return (
    <footer className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer Content */}
      <div className="container-padded py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-12">
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-3 space-y-8">
            {/* Logo */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 group"
              aria-label="BookStore Homepage"
            >
              <span className="relative flex items-center justify-center w-10 h-10">
                <span className="absolute w-8 h-8 bg-gradient-to-br from-primary-light to-highlight-light dark:from-primary-dark dark:to-highlight-dark rounded-lg -rotate-6 group-hover:rotate-0 transition-transform duration-300"></span>
                <HiOutlineBookOpen className="h-6 w-6 text-white z-10" />
              </span>
              <span className="text-gradient text-2xl font-display font-bold">BookStore</span>
            </Link>

            <p className="text-text_secondary-light dark:text-text_secondary-dark max-w-md">
              Discover the perfect book for every moment. Our curated collection brings stories that inspire, educate, and entertain readers of all ages.
            </p>

            {/* Newsletter Signup */}
            <div className="pt-2">
              <h3 className="text-lg font-semibold mb-3 text-text_primary-light dark:text-text_primary-dark">
                Join Our Newsletter
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="relative flex-grow">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="form-input pl-10 py-2.5 w-full"
                    aria-label="Email for newsletter"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn btn-primary flex items-center gap-1"
                >
                  Subscribe
                  <HiChevronRight />
                </motion.button>
              </form>
              <p className="mt-2 text-xs text-text_secondary-light dark:text-text_secondary-dark">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <div className="flex items-center gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                    aria-label={link.label}
                  >
                    <link.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerLinks.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold mb-4 text-text_primary-light dark:text-text_primary-dark">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        to={link.to}
                        className="inline-flex text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container-padded flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text_secondary-light dark:text-text_secondary-dark">
            &copy; {currentYear} BookStore. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-text_secondary-light dark:text-text_secondary-dark">
            <a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
