import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookDto } from '../services/api';
import { formatCurrency, imageUrl } from '@/utils/format';
import {
  HiOutlineShoppingCart,
  HiStar,
  HiOutlineStar,
  HiChevronRight,
  HiOutlineEye,
  HiOutlineHeart,
  HiHeart,
  HiOutlineBookOpen,
  HiOutlineTag
} from 'react-icons/hi';

interface BookCardProps {
  book: BookDto;
  className?: string;
  onAddToCart?: (bookId: number) => void;
  onToggleWishlist?: (bookId: number) => void;
  isWishlisted?: boolean;
  index?: number; // For staggered animations
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  className = '',
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  index = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  // Use react-intersection-observer to trigger animation when card becomes visible
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px 0px',
  });

  // Convert price values to numbers for safe comparison and calculation
  const priceValue = typeof book.price === 'string' ? parseFloat(book.price) : book.price;
  const originalPriceValue = book.originalPrice
    ? (typeof book.originalPrice === 'string' ? parseFloat(book.originalPrice) : book.originalPrice)
    : null;

  // Calculate discount percentage
  const discountPercentage = originalPriceValue && !isNaN(originalPriceValue) &&
                             priceValue && !isNaN(priceValue) &&
                             originalPriceValue > priceValue
    ? Math.round(100 - ((priceValue / originalPriceValue) * 100))
    : null;

  // Generate rating display - using a fixed value since rating is not in BookDto
  // In a real app, you would either add the rating to the BookDto type
  // or fetch ratings separately
  const randomRating = ((Math.random() * 2) + 3).toFixed(1); // Random rating between 3.0-5.0
  const ratingValue = parseFloat(randomRating);

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.6,
        delay: index * 0.08, // Staggered delay based on index
        ease: [0.22, 1, 0.36, 1]
      }
    },
  };

  // Animation for the card on hover
  const hoverAnimations = {
    rest: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { type: "spring", stiffness: 400, damping: 12 }
    }
  };

  // Handle add to cart with animation
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToCart) {
      onAddToCart(book.id);
    }
  };

  // Handle wishlist toggle with animation
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 700);

    if (onToggleWishlist) {
      onToggleWishlist(book.id);
    }
  };

  // Combine animation variants to avoid duplicate attributes
  const combinedVariants = {
    hidden: cardVariants.hidden,
    visible: cardVariants.visible,
    rest: hoverAnimations.rest,
    hover: hoverAnimations.hover
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      variants={combinedVariants}
      className={`group h-full rounded-xl overflow-hidden bg-surface-light dark:bg-surface-dark shadow-medium hover:shadow-high transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        <Link
          to={`/books/${book.id}`}
          className="block h-full"
          aria-label={`View details for ${book.title}`}
        >
          {/* Book Cover Image with loading state */}
          <div className="relative w-full h-full">
            {/* Skeleton placeholder with subtle animation */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
                  <HiOutlineBookOpen className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            )}

            {/* Book Cover Image */}
            <motion.img
              src={imageUrl(book.image)}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover transition-all duration-700"
              style={{
                opacity: isImageLoaded ? 1 : 0,
                scale: isHovered ? 1.1 : 1,
                filter: isHovered ? 'brightness(0.85)' : 'brightness(1)',
              }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.7, ease: "easeOut" },
                filter: { duration: 0.3 }
              }}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
            />

            {/* Fancy book page edge effect */}
            <div className="absolute right-0 inset-y-0 w-[3px] bg-white/20 dark:bg-black/20 shadow-[-1px_0_3px_rgba(0,0,0,0.2)]"></div>
          </div>

          {/* Genre Badge */}
          <div className="absolute top-3 left-3 z-10">
            <motion.div
              className="flex items-center gap-1.5 bg-secondary-light/90 dark:bg-secondary-dark/90 text-white text-body-sm px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05, type: "spring", stiffness: 400, damping: 25 }}
            >
              <HiOutlineTag className="w-3.5 h-3.5" />
              <span>{book.genre || 'Fiction'}</span>
            </motion.div>
          </div>

          {/* Discount Badge */}
          {discountPercentage && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.3 + index * 0.05 }}
              className="absolute top-3 right-14 z-10"
            >
              <div className="inline-flex items-center bg-accent-light dark:bg-accent-dark text-white font-bold text-body-sm px-3 py-1.5 rounded-full shadow-high">
                <span className="mr-1 text-xs">SAVE</span>
                <span className="text-sm">{discountPercentage}%</span>
              </div>
            </motion.div>
          )}

          {/* Bottom gradient overlay for better text contrast */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

          {/* Book info on image */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <h3 className="font-display font-bold text-h3 line-clamp-2 drop-shadow-md group-hover:text-white group-hover:translate-y-[-3px] transition-all duration-300">
              {book.title}
            </h3>
            <p className="text-body-sm text-white/80 line-clamp-1 mt-1 group-hover:text-white/100 transition-colors">
              by {book.author}
            </p>
          </div>
        </Link>

        {/* Wishlist Button - Always visible */}
        <motion.button
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-medium
                     hover:bg-white dark:hover:bg-gray-700 transition-colors border border-white/20 dark:border-gray-700/50"
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <AnimatePresence mode="wait">
            {isWishlisted ? (
              <motion.div
                key="filled"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{
                  scale: isHeartAnimating ? [1, 1.35, 1] : 1,
                  opacity: 1
                }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  scale: {
                    times: isHeartAnimating ? [0, 0.5, 1] : [0, 1],
                    duration: 0.6
                  }
                }}
              >
                <HiHeart className="h-5 w-5 text-error-light dark:text-error-dark" />
              </motion.div>
            ) : (
              <motion.div
                key="outline"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HiOutlineHeart className="h-5 w-5 text-text_secondary-light dark:text-text_secondary-dark" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Quick actions overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 flex items-center justify-center backdrop-blur-[1px] z-10"
            >
              <div className="flex flex-col gap-3 items-center">
                {/* Quick view button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Link
                    to={`/books/${book.id}`}
                    className="flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-primary-light dark:text-primary-dark
                               font-medium py-2.5 px-5 rounded-full shadow-high hover:shadow-glow border border-white/30 dark:border-gray-700/30
                               transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    aria-label={`Quick view of ${book.title}`}
                  >
                    <HiOutlineEye className="h-4.5 w-4.5" />
                    <span>Quick View</span>
                    <HiChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>

                {/* Add to cart button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
                >
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center gap-2 bg-primary-light dark:bg-primary-dark text-white
                             font-medium py-2.5 px-5 rounded-full shadow-high hover:shadow-glow-dark border border-primary-light/30 dark:border-primary-dark/30
                             transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    aria-label={`Add ${book.title} to cart`}
                  >
                    <HiOutlineShoppingCart className="h-4.5 w-4.5" />
                    <span>Add to Cart</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex flex-col">
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.2, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                className="cursor-pointer"
              >
                {i < Math.floor(ratingValue) ? (
                  <HiStar className="h-4.5 w-4.5 text-accent-light dark:text-accent-dark" />
                ) : i < ratingValue ? (
                  <HiStar className="h-4.5 w-4.5 text-accent-light/70 dark:text-accent-dark/70" />
                ) : (
                  <HiOutlineStar className="h-4.5 w-4.5 text-accent-light/50 dark:text-accent-dark/50" />
                )}
              </motion.span>
            ))}
          </div>
          <span className="ml-2 text-body-sm font-medium text-text_secondary-light dark:text-text_secondary-dark">
            ({randomRating})
          </span>
        </div>

        {/* Desktop-only title & author - for better layout on larger screens */}
        <div className="hidden sm:block mb-4">
          <Link to={`/books/${book.id}`} className="group/title">
            <h3 className="font-display font-bold text-h3 text-text_primary-light dark:text-text_primary-dark
                          line-clamp-2 group-hover/title:text-primary-light dark:group-hover/title:text-primary-dark transition-colors duration-300">
              {book.title}
            </h3>
          </Link>
          <p className="text-body-sm text-text_secondary-light dark:text-text_secondary-dark line-clamp-1 mt-1 font-medium">
            by <span className="hover:text-primary-light dark:hover:text-primary-dark cursor-pointer transition-colors">{book.author}</span>
          </p>
        </div>

        {/* Price section with enhanced styling */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="font-display font-bold text-h2 text-primary-light dark:text-primary-dark">
              {formatCurrency(book.price)}
            </span>

            {originalPriceValue && priceValue && originalPriceValue > priceValue && (
              <span className="text-body-sm text-text_secondary-light dark:text-text_secondary-dark line-through -mt-1">
                {formatCurrency(book.originalPrice)}
              </span>
            )}
          </div>

          {/* Status badge (could be "In Stock", "Low Stock", etc.) */}
          <span className="text-xs px-2 py-1 bg-success-light/10 dark:bg-success-dark/10 text-success-light dark:text-success-dark rounded-md font-medium">
            In Stock
          </span>
        </div>
      </div>

      {/* Shine effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/30 to-white/0 z-10"
            initial={{ opacity: 0, x: -200, y: -100 }}
            animate={{ opacity: 0.5, x: 400, y: 400 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookCard;
