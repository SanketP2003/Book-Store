import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksApi, BookDto } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiArrowRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineStar,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
  HiOutlineTrendingUp,
  HiOutlineCollection,
  HiOutlineSearch,
  HiOutlineBookmark,
} from 'react-icons/hi';

// Featured authors data - in a real app, this would come from an API
const featuredAuthors = [
  {
    id: 1,
    name: "J.K. Rowling",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    books: 12,
    followers: "2.4M",
    genre: "Fantasy"
  },
  {
    id: 2,
    name: "Stephen King",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    books: 64,
    followers: "1.8M",
    genre: "Horror"
  },
  {
    id: 3,
    name: "Toni Morrison",
    image: "https://randomuser.me/api/portraits/women/76.jpg",
    books: 18,
    followers: "942K",
    genre: "Literary Fiction"
  },
  {
    id: 4,
    name: "Neil Gaiman",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    books: 42,
    followers: "1.2M",
    genre: "Fantasy/Comics"
  },
];

// Features highlights for the services section
const features = [
  {
    icon: HiOutlineSearch,
    title: "Discover New Books",
    description: "Find your next favorite read with personalized recommendations based on your interests."
  },
  {
    icon: HiOutlineBookmark,
    title: "Save & Build Lists",
    description: "Create reading lists, save favorites, and track books you want to read in the future."
  },
  {
    icon: HiOutlineTrendingUp,
    title: "Stay Updated",
    description: "Get notified about new releases from your favorite authors and trending titles."
  },
  {
    icon: HiOutlineCollection,
    title: "Wide Selection",
    description: "Access thousands of books across every genre, from classics to the latest bestsellers."
  }
];

const HomePage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [bestsellersPage, setBestsellersPage] = useState(0);
  const size = 8;
  const navigate = useNavigate();
  
  // Scroll animations
  const featuresRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: featuresScrollProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end center"]
  });
  
  const featuresOpacity = useTransform(featuresScrollProgress, [0, 0.5], [0.6, 1]);
  const featuresY = useTransform(featuresScrollProgress, [0, 0.5], [60, 0]);

  // Query for latest books
  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', { page, size }],
    queryFn: () => booksApi.list(page, size).then(r => r.data),
    placeholderData: (prev) => prev,
  });

  // Convert price value (string or number) to a number for comparison
  const priceToNumber = (price: string | number | undefined): number => {
    if (price === undefined || price === null) {
      return 0;
    }
    // If it's already a number, return it
    if (typeof price === 'number') {
      return price;
    }
    // Try to parse the string as a float
    const parsed = parseFloat(price);
    // Return 0 if parsing failed, otherwise return the parsed number
    return isNaN(parsed) ? 0 : parsed;
  };

  // Query for bestsellers with proper number conversion for sorting
  const { data: bestsellers, isLoading: loadingBestsellers } = useQuery({
    queryKey: ['books', 'bestsellers', { page: bestsellersPage, size: 4 }],
    queryFn: () => booksApi.list(bestsellersPage, 4).then(r => r.data),
    placeholderData: (prev) => prev,
    select: (data) => {
      if (!data || !data.content || !Array.isArray(data.content)) {
        return data;
      }
      return {
        ...data,
        content: [...data.content].sort((a, b) => {
          // Use our helper function to safely convert prices to numbers
          const priceA = priceToNumber(a.price);
          const priceB = priceToNumber(b.price);
          return priceB - priceA; // Sort from highest to lowest
        })
      };
    },
  });

  // Database-driven categories
  const { data: categories, isLoading: catLoading, isError: catError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => booksApi.categories().then(r => r.data),
  });

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.6
      }
    })
  };

  // Navigation for bestsellers carousel
  const nextBestsellersPage = () => {
    if (bestsellers && bestsellersPage < bestsellers.totalPages - 1) {
      setBestsellersPage(prev => prev + 1);
    }
  };

  const prevBestsellersPage = () => {
    if (bestsellersPage > 0) {
      setBestsellersPage(prev => prev - 1);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text_primary-light dark:text-text_primary-dark">
      {/* Hero Section with green theme gradient overlay and enhanced design */}
      <section className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMEI5ODEiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDRjMCAyLjIxIDEuNzkgNCA0IDRzNC0xLjc5IDQtNHptLTQgMTJjLTYuNjMgMC0xMi01LjM3LTEyLTEyczUuMzctMTIgMTItMTIgMTIgNS4zNyAxMiAxMi01LjM3IDEyLTEyIDEyeiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] bg-center"></div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/95 to-green-400/95 dark:from-green-700/95 dark:to-green-500/95"></div>

        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-300/20 rounded-full blur-3xl"></div>

        <div className="relative container-padded py-16 md:py-28 min-h-[85vh] flex items-center">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-white space-y-6">
              <motion.div variants={itemVariants}>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                  Best Online Bookstore of 2025
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  Discover Your Next 
                  <span className="block mt-2">Reading Adventure</span>
                </h1>
              </motion.div>

              <motion.p variants={itemVariants} className="text-lg md:text-xl opacity-95 max-w-lg">
                Explore thousands of books on any device, from bestsellers to hidden gems, and find the stories that will keep you turning pages.
              </motion.p>

              <motion.div variants={itemVariants} className="pt-4 flex flex-wrap gap-4">
                <Link 
                  to="/books" 
                  className="btn btn-lg bg-white text-green-600 hover:bg-green-50 inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                  aria-label="Browse our book catalog"
                >
                  Browse Catalog <HiArrowRight />
                </Link>
                <Link 
                  to="/about" 
                  className="btn btn-lg bg-white/10 text-white border border-white/30 backdrop-blur-sm hover:bg-white/20 inline-flex items-center gap-2"
                  aria-label="Learn more about our bookstore"
                >
                  Learn More
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-3 pt-8 text-white/90 text-sm">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div 
                      key={i} 
                      className="h-10 w-10 rounded-full border-2 border-white/80 overflow-hidden shadow-md"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + (i * 0.1) }}
                    >
                      <img 
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} 
                        alt="User avatar" 
                        className="w-full h-full object-cover"
                        loading="lazy" 
                      />
                    </motion.div>
                  ))}
                </div>
                <span>Join <b>5,000+</b> readers discovering new books every day</span>
              </motion.div>
            </div>

            {/* Animated book stack with floating animation */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex justify-center relative"
            >
              <div className="relative w-80 h-96">
                {/* Decorative elements */}
                <div className="absolute -right-10 -top-10 w-20 h-20 bg-yellow-300/30 rounded-full blur-xl"></div>
                <div className="absolute -left-5 -bottom-5 w-16 h-16 bg-green-400/30 rounded-full blur-lg"></div>

                {/* Books stacked for visual effect */}
                <motion.div 
                  className="absolute left-0 top-4 rounded-xl overflow-hidden shadow-2xl"
                  animate={{ rotate: [-6, -4, -6], y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=387&auto=format&fit=crop" 
                    alt="Book cover" 
                    className="w-72 h-96 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </motion.div>
                <motion.div 
                  className="absolute left-16 top-0 rounded-xl overflow-hidden shadow-2xl z-10"
                  animate={{ rotate: [3, 1, 3], y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
                >
                  <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=387&auto=format&fit=crop" 
                    alt="Book cover" 
                    className="w-72 h-96 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </motion.div>
                <motion.div 
                  className="absolute left-8 top-8 rounded-xl overflow-hidden shadow-2xl z-20"
                  animate={{ rotate: [0, 2, 0], y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                >
                  <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=387&auto=format&fit=crop" 
                    alt="Book cover" 
                    className="w-72 h-96 object-cover rounded-xl shadow-lg"
                    loading="lazy"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Wave svg separator - enhanced with green theme */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-[70px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              className="fill-background-light dark:fill-background-dark"></path>
          </svg>
        </div>
      </section>

      <main>
        {/* Features highlight section */}
        <motion.section 
          ref={featuresRef}
          style={{ opacity: featuresOpacity, y: featuresY }}
          className="py-16"
        >
          <div className="container-padded">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full text-sm font-medium text-primary-light dark:text-primary-dark mb-3">
                Why Choose BookStore
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold">Everything you need for your reading journey</h2>
              <p className="mt-4 max-w-2xl mx-auto text-text_secondary-light dark:text-text_secondary-dark text-lg">
                Discover a modern bookstore experience with tools designed to help you find and enjoy books that match your interests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  custom={index}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="card p-6 text-center hover:shadow-soft-lg transition-all duration-300 group"
                >
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary-light/20 to-highlight-light/20 dark:from-primary-dark/20 dark:to-highlight-dark/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-primary-light dark:text-primary-dark" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-text_primary-light dark:text-text_primary-dark">
                    {feature.title}
                  </h3>
                  <p className="text-text_secondary-light dark:text-text_secondary-dark">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Categories Section - database-driven */}
        <section className="py-16 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="container-padded">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <span className="inline-block px-3 py-1 bg-secondary-light/10 dark:bg-secondary-dark/10 rounded-full text-sm font-medium text-secondary-light dark:text-secondary-dark mb-3">
                  Categories
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Find your genre</h2>
                <p className="mt-2 text-text_secondary-light dark:text-text_secondary-dark max-w-lg">
                  Explore our extensive collection organized by categories to find exactly what you're looking for.
                </p>
              </div>
              <button 
                onClick={() => navigate('/books')} 
                className="btn btn-primary flex items-center gap-1"
                aria-label="View all book categories"
              >
                View All <HiArrowRight />
              </button>
            </motion.div>

            {catLoading && (
              <div className="py-20 text-center">
                <Loader size="lg" />
                <p className="mt-4 text-text_secondary-light dark:text-text_secondary-dark">Loading categories...</p>
              </div>
            )}

            {catError && (
              <Alert type="error" message="Failed to load categories. Please try again later." />
            )}

            {categories && categories.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {categories.map((category: string, idx: number) => (
                  <motion.button
                    key={category}
                    onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.03 }}
                    className="card card-hover text-center p-6 cursor-pointer overflow-hidden group relative"
                    aria-label={`Browse ${category} books`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-highlight-light/5 dark:from-primary-dark/5 dark:to-highlight-dark/5 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl"></div>
                    <div className="relative">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary-light/10 to-highlight-light/10 dark:from-primary-dark/10 dark:to-highlight-dark/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-bold text-primary-light dark:text-primary-dark">
                          {category.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-medium line-clamp-1 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors duration-200" title={category}>
                        {category}
                      </h3>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {categories && categories.length === 0 && !catLoading && !catError && (
              <div className="py-12 text-center">
                <Alert message="No categories found." />
              </div>
            )}
          </div>
        </section>

        {/* Bestsellers Section */}
        <section className="py-16">
          <div className="container-padded">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-12">
              <div>
                <span className="inline-block px-3 py-1 bg-accent-light/10 dark:bg-accent-dark/10 rounded-full text-sm font-medium text-accent-light dark:text-accent-dark mb-3">
                  Top Picks
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold flex items-center gap-2">
                  <HiOutlineStar className="text-accent-light dark:text-accent-dark hidden sm:inline" />
                  Bestsellers
                </h2>
                <p className="mt-2 text-text_secondary-light dark:text-text_secondary-dark max-w-lg">
                  Our most popular books that readers can't put down.
                </p>
              </div>

              {bestsellers && bestsellers.totalPages > 1 && (
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={prevBestsellersPage}
                    disabled={bestsellersPage === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    aria-label="View previous bestsellers"
                  >
                    <HiOutlineChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    onClick={nextBestsellersPage}
                    disabled={bestsellers && bestsellersPage >= bestsellers.totalPages - 1}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    aria-label="View more bestsellers"
                  >
                    <HiOutlineChevronRight size={20} />
                  </motion.button>
                </div>
              )}
            </div>

            {loadingBestsellers ? (
              <div className="py-20 text-center">
                <Loader size="lg" />
                <p className="mt-4 text-text_secondary-light dark:text-text_secondary-dark">Loading bestsellers...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`bestsellers-page-${bestsellersPage}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                >
                  {bestsellers?.content?.map((book: BookDto) => (
                    <BookCard key={`bestseller-${book.id}`} book={book} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* Featured Authors Section */}
        <section className="py-16 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="container-padded">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-12">
              <div>
                <span className="inline-block px-3 py-1 bg-highlight-light/10 dark:bg-highlight-dark/10 rounded-full text-sm font-medium text-highlight-light dark:text-highlight-dark mb-3">
                  Meet The Authors
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold flex items-center gap-2">
                  <HiOutlineUserGroup className="text-secondary-light dark:text-secondary-dark hidden sm:inline" />
                  Featured Authors
                </h2>
                <p className="mt-2 text-text_secondary-light dark:text-text_secondary-dark max-w-lg">
                  Get to know the minds behind your favorite stories.
                </p>
              </div>
              <Link 
                to="/books" 
                className="btn btn-primary flex items-center gap-1"
                aria-label="View all authors"
              >
                View All <HiArrowRight />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredAuthors.map((author, index) => (
                <motion.div
                  key={author.id}
                  className="card p-6 text-center hover:shadow-soft-lg transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light/20 to-highlight-light/20 dark:from-primary-dark/20 dark:to-highlight-dark/20 blur-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"></div>
                    <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-soft-md group-hover:scale-105 transition-transform duration-300">
                      <img src={author.image} alt={author.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors duration-200">
                    {author.name}
                  </h3>
                  <p className="text-text_secondary-light dark:text-text_secondary-dark text-sm mb-3">
                    {author.genre}
                  </p>
                  <div className="flex justify-center gap-6 text-sm text-text_secondary-light dark:text-text_secondary-dark">
                    <div className="flex flex-col">
                      <span className="font-bold text-text_primary-light dark:text-text_primary-dark">{author.books}</span>
                      <span>Books</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-text_primary-light dark:text-text_primary-dark">{author.followers}</span>
                      <span>Followers</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full btn btn-outline hover:bg-primary-light/5 dark:hover:bg-primary-dark/5 group-hover:border-primary-light dark:group-hover:border-primary-dark transition-colors duration-200">
                    View Profile
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Books Section */}
        <section className="py-16">
          <div className="container-padded">
            <motion.div
              className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div>
                <span className="inline-block px-3 py-1 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full text-sm font-medium text-primary-light dark:text-primary-dark mb-3">
                  Fresh Arrivals
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Latest Books</h2>
                <p className="mt-2 text-text_secondary-light dark:text-text_secondary-dark max-w-lg">
                  The newest additions to our ever-growing collection.
                </p>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="py-20 text-center">
                <Loader size="lg" />
                <p className="mt-4 text-text_secondary-light dark:text-text_secondary-dark">Loading latest books...</p>
              </div>
            ) : isError ? (
              <Alert type="error" message="Failed to load books. Please try again later." />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {data?.content?.map((book: BookDto) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
                
                {data && data.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination 
                      currentPage={page} 
                      totalPages={data.totalPages} 
                      onPageChange={setPage} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Call to action */}
        <section className="py-16 bg-gradient-to-br from-primary-light/95 to-highlight-light/95 dark:from-primary-dark/95 dark:to-highlight-dark/95 text-white">
          <div className="container-padded">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold">
                  Start your reading journey today
                </h2>
                <p className="text-lg text-white/90 max-w-lg">
                  Sign up now and get personalized recommendations, track your reading progress, and join a community of book lovers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    onClick={() => navigate('/register')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-lg bg-white text-primary-light hover:bg-gray-100 shadow-soft-lg"
                  >
                    Create Account
                  </motion.button>
                  <Link to="/books" className="btn btn-lg bg-white/10 border border-white/30 backdrop-blur-sm hover:bg-white/20">
                    Browse Books
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="hidden lg:block"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1513001900722-370f803f498d?w=600&auto=format&fit=crop" 
                  alt="Person reading a book" 
                  className="w-full h-auto rounded-2xl shadow-2xl" 
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
