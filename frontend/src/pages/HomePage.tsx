import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksApi, BookDto } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiArrowRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineStar,
  HiOutlineBookOpen,
  HiOutlineUserGroup
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

const HomePage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [bestsellersPage, setBestsellersPage] = useState(0);
  const size = 8;
  const navigate = useNavigate();

  // Query for latest books
  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', { page, size }],
    queryFn: () => booksApi.list(page, size).then(r => r.data),
    keepPreviousData: true,
  });

  // Query for bestsellers (simulate with different sorting)
  const { data: bestsellers, isLoading: loadingBestsellers } = useQuery({
    queryKey: ['books', 'bestsellers', { page: bestsellersPage, size: 4 }],
    queryFn: () => booksApi.list(bestsellersPage, 4).then(r => r.data),
    keepPreviousData: true,
    select: (data) => {
      // For demo purposes, sort by price to simulate "bestsellers"
      return {
        ...data,
        content: [...data.content].sort((a, b) => b.price - a.price)
      };
    }
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
    <div className="bg-background-light dark:bg-background-dark text-text_primary-light dark:text-text_primary-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light/90 to-highlight-light/90 dark:from-primary-dark/90 dark:to-highlight-dark/90"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-28">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-white space-y-6">
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                  Discover Your Next
                  <span className="block">Favorite Book</span>
                </h1>
              </motion.div>

              <motion.p variants={itemVariants} className="text-lg md:text-xl opacity-90 max-w-lg">
                Explore thousands of books on any device, from bestsellers to hidden gems, and find the stories that will keep you turning pages.
              </motion.p>

              <motion.div variants={itemVariants} className="pt-4 flex flex-wrap gap-4">
                <Link to="/books" className="btn-primary inline-flex items-center gap-2 text-lg">
                  Browse Catalog <HiArrowRight />
                </Link>
                <Link to="/about" className="btn-secondary bg-white/20 text-white hover:bg-white/30 border-white/30 inline-flex items-center gap-2">
                  Learn More
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-2 pt-6 text-white/90 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
                      <img src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} alt="User" />
                    </div>
                  ))}
                </div>
                <span>Join <b>5,000+</b> readers discovering new books every day</span>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="hidden lg:flex justify-center relative"
            >
              <div className="relative w-72 h-96">
                {/* Books stacked for visual effect */}
                <div className="absolute left-0 top-0 transform -rotate-6 shadow-xl rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=387&auto=format&fit=crop" alt="Book cover" className="w-72 h-96 object-cover" />
                </div>
                <div className="absolute left-12 top-4 transform rotate-3 shadow-xl rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=387&auto=format&fit=crop" alt="Book cover" className="w-72 h-96 object-cover" />
                </div>
                <div className="absolute left-6 top-2 shadow-2xl rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=387&auto=format&fit=crop" alt="Book cover" className="w-72 h-96 object-cover" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Categories Section - database-driven */}
        <section className="mb-16">
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold">Browse Categories</h2>
            <button onClick={() => navigate('/books')} className="text-primary-light dark:text-primary-dark flex items-center gap-1 hover:underline">
              View All <HiArrowRight />
            </button>
          </motion.div>

          {catLoading && (
            <div className="py-10"><Loader /></div>
          )}

          {catError && (
            <Alert type="error" message="Failed to load categories. Please try again later." />
          )}

          {categories && categories.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((category: string, idx: number) => (
                <motion.button
                  key={category}
                  onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="card card-hover text-center p-6 cursor-pointer"
                  aria-label={`Open category ${category}`}
                >
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center text-xl font-bold text-primary-light dark:text-primary-dark">
                    {category.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-medium line-clamp-1" title={category}>{category}</h3>
                </motion.button>
              ))}
            </div>
          )}

          {categories && categories.length === 0 && !catLoading && !catError && (
            <div className="py-8"><Alert message="No categories found." /></div>
          )}
        </section>

        {/* Bestsellers Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
              <HiOutlineStar className="text-accent-light dark:text-accent-dark" />
              Bestsellers
            </h2>

            {bestsellers && bestsellers.totalPages > 1 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={prevBestsellersPage}
                  disabled={bestsellersPage === 0}
                  className="p-2 rounded-full border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft size={20} />
                </button>
                <button
                  onClick={nextBestsellersPage}
                  disabled={bestsellers && bestsellersPage >= bestsellers.totalPages - 1}
                  className="p-2 rounded-full border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {loadingBestsellers ? (
            <div className="py-12 text-center">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {bestsellers?.content?.map((book: BookDto) => (
                <BookCard key={`bestseller-${book.id}`} book={book} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Authors Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
              <HiOutlineUserGroup className="text-secondary-light dark:text-secondary-dark" />
              Featured Authors
            </h2>
            <Link to="/books" className="text-primary-light dark:text-primary-dark flex items-center gap-1 hover:underline">
              View All <HiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAuthors.map((author, index) => (
              <motion.div
                key={author.id}
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-light/20 dark:border-primary-dark/20">
                  <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold mb-1">{author.name}</h3>
                <p className="text-text_secondary-light dark:text-text_secondary-dark text-sm mb-3">{author.genre}</p>
                <div className="flex justify-center gap-4 text-sm text-text_secondary-light dark:text-text_secondary-dark">
                  <div className="flex items-center gap-1">
                    <HiOutlineBookOpen />
                    <span>{author.books} books</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineUserGroup />
                    <span>{author.followers}</span>
                  </div>
                </div>
                <button className="mt-4 w-full btn-secondary text-sm py-2">View Profile</button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Latest Books Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-2">
              <HiOutlineBookOpen className="text-primary-light dark:text-primary-dark" />
              Latest Arrivals
            </h2>
          </div>

          {isLoading && <Loader />}
          {isError && <Alert message="Failed to load books. Please try again later." type="error" />}
          {data && (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.content.map((book: BookDto) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </motion.div>
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="mt-24">
          <div className="card p-8 md:p-12 bg-gradient-to-r from-primary-light/10 to-highlight-light/10 dark:from-primary-dark/10 dark:to-highlight-dark/10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-text_secondary-light dark:text-text_secondary-dark mb-6">
                Stay updated with new releases, author interviews, and exclusive deals.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="input-field flex-grow"
                  required
                />
                <button
                  type="submit"
                  className="btn-primary whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
