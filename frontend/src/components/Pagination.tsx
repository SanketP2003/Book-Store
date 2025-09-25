import React from 'react';
import { motion } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PaginationProps {
  page?: number;
  currentPage?: number;
  totalPages: number;
  onChange?: (page: number) => void;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, currentPage, totalPages, onChange, onPageChange }) => {
  const curr = typeof currentPage === 'number' ? currentPage : (page ?? 0);
  const setPage = (onPageChange ?? onChange) || (() => {});

  const handlePrevious = () => {
    if (curr > 0) setPage(curr - 1);
  };

  const handleNext = () => {
    if (curr < totalPages - 1) setPage(curr + 1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (curr > 1) {
        pages.push(0);
        if (curr > 2) pages.push('...');
      }
      const startPage = Math.max(0, curr - 1);
      const endPage = Math.min(totalPages - 1, curr + 1);
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (curr < totalPages - 2) {
        if (curr < totalPages - 3) pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const buttonClasses = "w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors duration-200";
  const activeClasses = "bg-primary-light dark:bg-primary-dark text-white shadow-md";
  const inactiveClasses = "bg-surface-light dark:bg-surface-dark hover:bg-gray-200 dark:hover:bg-gray-700";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <nav className="flex items-center justify-center gap-2">
      <motion.button
        onClick={handlePrevious}
        disabled={curr <= 0}
        className={`${buttonClasses} ${inactiveClasses} ${curr <= 0 ? disabledClasses : ''}`}
        whileHover={curr > 0 ? { scale: 1.1 } : {}}
        whileTap={curr > 0 ? { scale: 0.9 } : {}}
      >
        <HiChevronLeft size={20} />
      </motion.button>

      {pageNumbers.map((p, index) =>
        typeof p === 'number' ? (
          <motion.button
            key={p}
            onClick={() => setPage(p)}
            className={`${buttonClasses} ${curr === p ? activeClasses : inactiveClasses}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {p + 1}
          </motion.button>
        ) : (
          <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-text_secondary-light dark:text-text_secondary-dark">
            ...
          </span>
        )
      )}

      <motion.button
        onClick={handleNext}
        disabled={curr >= totalPages - 1}
        className={`${buttonClasses} ${inactiveClasses} ${curr >= totalPages - 1 ? disabledClasses : ''}`}
        whileHover={curr < totalPages - 1 ? { scale: 1.1 } : {}}
        whileTap={curr < totalPages - 1 ? { scale: 0.9 } : {}}
      >
        <HiChevronRight size={20} />
      </motion.button>
    </nav>
  );
};

export default Pagination;
