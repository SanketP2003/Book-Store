import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { HiSun, HiMoon } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-toggle relative overflow-hidden"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -30, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 30, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 text-current"
        >
          {theme === 'light' ? (
            <HiMoon size={20} />
          ) : (
            <HiSun size={20} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full z-0 opacity-20"
        style={{ backgroundColor: 'var(--accent-primary)' }}
        animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.25, 0.1] }}
        transition={{ duration: 0.6 }}
        key={theme + '-glow'}
      />
    </motion.button>
  );
};

export default ThemeSwitcher;
