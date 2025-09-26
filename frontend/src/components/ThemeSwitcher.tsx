import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-text_primary-light dark:text-text_primary-dark hover:bg-green-50 dark:hover:bg-green-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -30, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 30, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10"
        >
          {theme === 'light' ? (
            <HiMoon
              size={20}
              className="text-primary-light"
            />
          ) : (
            <HiSun
              size={20}
              className="text-amber-400"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full z-0 opacity-30 ${
          theme === 'light' 
            ? 'bg-primary-light' 
            : 'bg-amber-400'
        }`}
        animate={{
          scale: [0.8, 1.2, 1],
          opacity: [0, 0.3, 0.1],
        }}
        transition={{ duration: 0.6 }}
        key={theme + "glow"}
      />
    </motion.button>
  );
};

export default ThemeSwitcher;
