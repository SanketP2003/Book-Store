import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookDto } from '../services/api';
import { formatCurrency, imageUrl } from '@/utils/format';
import { HiOutlineShoppingCart, HiStar, HiOutlineBookmark, HiChevronRight, HiOutlineEye } from 'react-icons/hi';

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

  // Convert price values to numbers for safe comparison and calculation
  const priceValue = typeof book.price === 'string' ? parseFloat(book.price) : book.price;
  const originalPriceValue = book.originalPrice
    ? (typeof book.originalPrice === 'string' ? parseFloat(book.originalPrice) : book.originalPrice)
    : null;

  // Calculate discount percentage if original price exists and is greater than price
  const discountPercentage = originalPriceValue && !isNaN(originalPriceValue) &&
                             priceValue && !isNaN(priceValue) &&
                             originalPriceValue > priceValue
    ? Math.round(100 - ((priceValue / originalPriceValue) * 100))
    : null;

  // Generate random rating for demo purposes (in real app, would come from API)
  const rating = ((Math.random() * 2) + 3).toFixed(1); // Random rating between 3.0 and 5.0

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="card card-hover h-full bg-surface-light dark:bg-surface-dark group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-t-xl">
        <Link to={`/books/${book.id}`} className="block h-full" aria-label={`View details for ${book.title}`}>
          <img
            src={imageUrl(book.image)}
            alt={book.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Genre badge (was incorrectly using category) */}
          <div className="absolute top-3 left-3">
            <span className="badge badge-secondary px-2.5 py-1">
              {book.genre || 'Fiction'}
            </span>
          </div>

          {/* Discount badge */}
          {discountPercentage && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute top-3 right-3"
            >
              <span className="badge bg-accent-light dark:bg-accent-dark text-white font-bold px-2.5 py-1 shadow-soft">
                -{discountPercentage}%
              </span>
            </motion.div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Book title on image for better UX */}
          <div className="absolute bottom-3 left-3 right-10 text-white">
            <h3 className="font-bold text-lg line-clamp-1 drop-shadow-md">{book.title}</h3>
            <p className="text-sm text-white/90 line-clamp-1">by {book.author}</p>
          </div>
        </Link>

        {/* Quick action buttons with staggered animation */}
        <AnimatePresence>
          {isHovered && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-secondary-light dark:text-secondary-dark hover:text-secondary-light hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-light/50 dark:focus:ring-secondary-dark/50"
                aria-label="Save for later"
              >
                <HiOutlineBookmark size={20} />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                // onClick={() => onAddToCart(book.id)} // Ready for cart logic
                className="p-2 rounded-full bg-primary-light dark:bg-primary-dark text-white shadow-md hover:shadow-glow dark:hover:shadow-glow-dark focus:outline-none focus:ring-2 focus:ring-primary-light/50 dark:focus:ring-primary-dark/50"
                aria-label="Add to cart"
              >
                <HiOutlineShoppingCart size={20} />
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        {/* Quick view overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/30 flex items-center justify-center"
            >
              <Link
                to={`/books/${book.id}`}
                className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-primary-light dark:text-primary-dark font-medium py-2 px-4 rounded-full shadow-md transition-transform hover:scale-105"
                aria-label={`Quick view of ${book.title}`}
              >
                <HiOutlineEye size={20} />
                <span>Quick View</span>
                <HiChevronRight size={16} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5 flex flex-col">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-accent-light dark:text-accent-dark">
            {[...Array(5)].map((_, i) => (
              <HiStar
                key={i}
                size={16}
                className={i < parseInt(rating) ? 'fill-current' : 'opacity-30'}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-text_secondary-light dark:text-text_secondary-dark">({rating})</span>
        </div>

        {/* Title - Hidden on mobile as we now show it on the image for better UX on small screens */}
        <h3 className="hidden sm:block font-bold text-lg text-text_primary-light dark:text-text_primary-dark line-clamp-1 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors duration-200">
          <Link to={`/books/${book.id}`}>
            {book.title}
          </Link>
        </h3>

        {/* Author - Hidden on mobile as we now show it on the image */}
        <p className="hidden sm:block text-sm text-text_secondary-light dark:text-text_secondary-dark line-clamp-1 mb-3">
          by {book.author}
        </p>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="font-bold text-xl text-gradient">
            {formatCurrency(book.price)}
          </span>

          {originalPriceValue && priceValue && originalPriceValue > priceValue && (
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
