import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksApi, BookDto } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import { motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineX,
  HiOutlineSortAscending,
  HiOutlineSortDescending
} from 'react-icons/hi';

// Available book genres for filtering (in a real app, this would come from an API)
const bookGenres = [
  'All Genres',
  'Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Biography',
  'History',
  'Self-Help',
  'Business'
];

type SortOption = {
  id: string;
  name: string;
  field: string;
  direction: 'asc' | 'desc';
};

const sortOptions: SortOption[] = [
  { id: 'newest', name: 'Newest Arrivals', field: 'id', direction: 'desc' },
  { id: 'title_asc', name: 'Title (A-Z)', field: 'title', direction: 'asc' },
  { id: 'title_desc', name: 'Title (Z-A)', field: 'title', direction: 'desc' },
  { id: 'price_asc', name: 'Price (Low to High)', field: 'price', direction: 'asc' },
  { id: 'price_desc', name: 'Price (High to Low)', field: 'price', direction: 'desc' }
];

const BooksPage: React.FC = () => {
  // States for pagination and filtering
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const pageSize = 12;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedQuery, selectedGenre, selectedSort]);

  // Query for books with filters
  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', { page, pageSize, search: debouncedQuery, genre: selectedGenre, sort: selectedSort }],
    queryFn: () => booksApi.list(page, pageSize).then(r => r.data),
    keepPreviousData: true,
    select: (data) => {
      let filtered = [...data.content];

      // Filter by search query
      if (debouncedQuery) {
        filtered = filtered.filter(book =>
          book.title?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          book.author?.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
      }

      // Filter by genre (if not "All Genres")
      if (selectedGenre !== 'All Genres') {
        filtered = filtered.filter(book =>
          book.genre?.toLowerCase() === selectedGenre.toLowerCase()
        );
      }

      // Sort the filtered data
      filtered.sort((a, b) => {
        const field = selectedSort.field as keyof BookDto;

        // Handle null or undefined values
        const aValue = a[field] || '';
        const bValue = b[field] || '';

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return selectedSort.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Numeric comparison
        return selectedSort.direction === 'asc'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });

      return {
        ...data,
        content: filtered,
      };
    }
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Toggle filters on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="page-container py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="page-title">Book Catalog</h1>
        <p className="text-text_secondary-light dark:text-text_secondary-dark max-w-3xl">
          Explore our collection of books across various genres. Use the filters to find exactly what you're looking for.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 w-full"
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text_secondary-light dark:text-text_secondary-dark" size={20} />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text_secondary-light dark:text-text_secondary-dark hover:text-error-light dark:hover:text-error-dark"
              >
                <HiOutlineX size={18} />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={toggleFilters}
            className="md:hidden btn-secondary flex items-center justify-center gap-2"
          >
            <HiOutlineFilter size={20} />
            <span>Filters</span>
          </button>

          {/* Desktop Sorting */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <select
                value={selectedSort.id}
                onChange={(e) => {
                  const option = sortOptions.find(opt => opt.id === e.target.value);
                  if (option) setSelectedSort(option);
                }}
                className="input-field pl-8 pr-10 appearance-none"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {selectedSort.direction === 'asc' ? (
                <HiOutlineSortAscending className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
              ) : (
                <HiOutlineSortDescending className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
              )}
            </div>
          </div>
        </div>

        {/* Filters - Always visible on desktop, toggleable on mobile */}
        <motion.div
          className={`${showFilters ? 'block' : 'hidden'} md:block bg-white dark:bg-surface-dark rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700`}
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: showFilters ? 'auto' : 0,
            opacity: showFilters ? 1 : 0,
            display: showFilters ? 'block' : 'none'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mr-2 pt-1.5">Genre:</span>
            {bookGenres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedGenre === genre 
                    ? 'bg-primary-light dark:bg-primary-dark text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-text_secondary-light dark:text-text_secondary-dark hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Mobile Sorting */}
          <div className="mt-4 md:hidden">
            <span className="text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mr-2">Sort by:</span>
            <select
              value={selectedSort.id}
              onChange={(e) => {
                const option = sortOptions.find(opt => opt.id === e.target.value);
                if (option) setSelectedSort(option);
              }}
              className="input-field mt-1 w-full"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>

      {/* Books Grid */}
      {isLoading && <Loader label="Loading books..." />}

      {isError && (
        <Alert message="Failed to load books. Please try again later." type="error" />
      )}

      {data && !isLoading && (
        <>
          {data.content.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.content.map((book: BookDto) => (
                  <motion.div key={book.id} variants={itemVariants}>
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={Math.max(1, Math.ceil(data.content.length / pageSize))}
                  onPageChange={setPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">No books found</h3>
              <p className="text-text_secondary-light dark:text-text_secondary-dark">
                Try changing your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('All Genres');
                  setSelectedSort(sortOptions[0]);
                }}
                className="mt-4 btn-secondary"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BooksPage;
