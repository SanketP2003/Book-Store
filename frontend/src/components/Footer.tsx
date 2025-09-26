import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: '#1DA1F2' },
    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook', color: '#4267B2' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', color: '#E1306C' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: '#0077B5' },
    { icon: FaGithub, href: 'https://github.com', label: 'GitHub', color: '#333' },
  ];

  const contactInfo = [
    {
      icon: HiOutlineLocationMarker,
      text: '123 Bookstore Ave, Reading City, RC 12345',
      href: 'https://maps.google.com'
    },
    {
      icon: HiOutlinePhone,
      text: '+1 (555) 123-4567',
      href: 'tel:+15551234567'
    },
    {
      icon: HiOutlineMail,
      text: 'support@bookstore.com',
      href: 'mailto:support@bookstore.com'
    },
    {
      icon: HiOutlineGlobeAlt,
      text: 'www.bookstore.com',
      href: 'https://www.bookstore.com'
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('error');
      return;
    }

    // In a real app, we would call an API endpoint here
    console.log('Newsletter subscription for:', email);

    // Show success message
    setSubscriptionStatus('success');

    // Reset form
    setEmail('');

    // Clear status after 5 seconds
    setTimeout(() => {
      setSubscriptionStatus(null);
    }, 5000);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <footer className="bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={footerVariants}
        >
          {/* Brand & Newsletter Section */}
          <motion.div variants={fadeInUp} className="space-y-6">
            {/* Logo */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 group"
              aria-label="BookStore Homepage"
            >
              <span className="relative flex items-center justify-center w-10 h-10">
                <span className="absolute w-8 h-8 bg-gradient-to-br from-primary-light to-green-600 dark:from-primary-dark dark:to-green-500 rounded-lg -rotate-6 group-hover:rotate-0 transition-transform duration-300"></span>
                <HiOutlineBookOpen className="h-6 w-6 text-white z-10" />
              </span>
              <span className="bg-gradient-to-r from-primary-light to-green-600 dark:from-primary-dark dark:to-green-400 bg-clip-text text-transparent text-2xl font-display font-bold">
                BookStore
              </span>
            </Link>

            <p className="text-text_secondary-light dark:text-text_secondary-dark max-w-md">
              Discover the perfect book for every moment. Our curated collection brings stories that inspire, educate, and entertain readers of all ages.
            </p>

            {/* Social Media Links */}
            <div>
              <h3 className="text-h3 font-display font-semibold mb-3 text-text_primary-light dark:text-text_primary-dark">
                Follow Us
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-text_secondary-light dark:text-text_secondary-dark hover:text-white dark:hover:text-white hover:bg-[color:var(--color)] transition-all duration-300"
                    aria-label={link.label}
                    style={{ "--color": link.color } as React.CSSProperties}
                  >
                    <link.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer Links - First Two Columns */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8">
            {footerLinks.slice(0, 2).map((section, idx) => (
              <div key={idx}>
                <h3 className="text-h3 font-display font-semibold mb-4 text-text_primary-light dark:text-text_primary-dark">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        to={link.to}
                        className="inline-block text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 hover:translate-x-1"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Footer Links - Last Column and Contact Info */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div>
              <h3 className="text-h3 font-display font-semibold mb-4 text-text_primary-light dark:text-text_primary-dark">
                {footerLinks[2].title}
              </h3>
              <ul className="space-y-2.5">
                {footerLinks[2].links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      to={link.to}
                      className="inline-block text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors duration-200 hover:translate-x-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div>
              <h3 className="text-h3 font-display font-semibold mb-3 text-text_primary-light dark:text-text_primary-dark">
                Join Our Newsletter
              </h3>
              <p className="text-text_secondary-light dark:text-text_secondary-dark mb-4">
                Sign up to receive updates on new releases and special offers.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text_secondary-light dark:text-text_secondary-dark" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-10 pr-3 py-2.5 rounded-md border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light/30 dark:focus:ring-primary-dark/30"
                    aria-label="Email for newsletter"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isFullWidth
                  icon={<HiArrowRight />}
                  iconPosition="right"
                >
                  Subscribe
                </Button>

                {subscriptionStatus === 'success' && (
                  <Alert
                    type="success"
                    message="Thank you for subscribing!"
                    duration={5000}
                    onClose={() => setSubscriptionStatus(null)}
                  />
                )}

                {subscriptionStatus === 'error' && (
                  <Alert
                    type="error"
                    message="Please enter a valid email address."
                    duration={5000}
                    onClose={() => setSubscriptionStatus(null)}
                  />
                )}
              </form>

              <p className="mt-3 text-xs text-text_secondary-light dark:text-text_secondary-dark">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>

            {/* Contact information */}
            <div>
              <h3 className="text-h3 font-display font-semibold mb-3 text-text_primary-light dark:text-text_primary-dark">
                Contact Us
              </h3>
              <ul className="space-y-3">
                {contactInfo.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <item.icon className="h-5 w-5 mt-0.5 text-primary-light dark:text-primary-dark flex-shrink-0" />
                    <a
                      href={item.href}
                      className="text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar with Divider */}
      <div className="border-t border-border-light dark:border-border-dark py-6">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-body-sm text-text_secondary-light dark:text-text_secondary-dark">
            &copy; {currentYear} BookStore. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-body-sm text-text_secondary-light dark:text-text_secondary-dark">
            <Link to="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
              Cookie Policy
            </Link>
            <Link to="#" className="hover:text-primary-light dark:hover:text-primary-dark transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
