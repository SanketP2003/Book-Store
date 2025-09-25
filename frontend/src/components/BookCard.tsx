import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookDto } from '../services/api'; // Adjusted path
import { formatCurrency, imageUrl } from '@/utils/format';
import { HiOutlineShoppingCart, HiStar, HiOutlineBookmark } from 'react-icons/hi';

interface BookCardProps {
  book: BookDto;
  // onAddToCart: (bookId: number) => void; // Future-ready prop
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1, // Animate when 10% of the card is visible
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    },
  };

  // Calculate discount percentage if original price exists
  const discountPercentage = book.originalPrice && book.originalPrice > book.price
    ? Math.round(100 - (book.price / book.originalPrice * 100))
    : null;

  // Generate random rating for demo purposes (in real app, would come from API)
  const rating = ((Math.random() * 2) + 3).toFixed(1); // Random rating between 3.0 and 5.0

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card card-hover h-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Link to={`/books/${book.id}`} className="block h-full">
          <img
            src={imageUrl(book.image)}
            alt={book.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="badge badge-secondary">
              {book.category || 'Fiction'}
            </span>
          </div>

          {/* Discount badge */}
          {discountPercentage && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-accent-light dark:bg-accent-dark text-white font-bold">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
        </Link>

        {/* Quick action buttons */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 right-3 flex gap-2"
            >
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-secondary-light dark:text-secondary-dark hover:text-secondary-light hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <HiOutlineBookmark size={20} />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                // onClick={() => onAddToCart(book.id)} // Ready for cart logic
                className="p-2 rounded-full bg-primary-light dark:bg-primary-dark text-white shadow-md hover:shadow-glow dark:hover:shadow-glow-dark"
              >
                <HiOutlineShoppingCart size={20} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 flex flex-col">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-accent-light dark:text-accent-dark">
            {[...Array(5)].map((_, i) => (
              <HiStar key={i} size={16} className={i < parseInt(rating) ? 'fill-current' : 'opacity-30'} />
            ))}
          </div>
          <span className="ml-1 text-xs text-text_secondary-light dark:text-text_secondary-dark">({rating})</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-text_primary-light dark:text-text_primary-dark line-clamp-1 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors duration-200">
          <Link to={`/books/${book.id}`}>
            {book.title}
          </Link>
        </h3>

        {/* Author */}
        <p className="text-sm text-text_secondary-light dark:text-text_secondary-dark line-clamp-1 mb-3">
          by {book.author}
        </p>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-bold text-xl bg-gradient-to-r from-primary-light to-highlight-light dark:from-primary-dark dark:to-highlight-dark bg-clip-text text-transparent">
            {formatCurrency(book.price)}
          </span>

          {book.originalPrice && book.originalPrice > book.price && (
            <span className="text-sm text-text_secondary-light dark:text-text_secondary-dark line-through">
              {formatCurrency(book.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
