import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Award, ShoppingBag, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bookService } from '../services';
import { BookDto } from '../types/api';
import { imageUrl } from '@/utils/format';

export default function LandingPage() {
  const [featuredBooks, setFeaturedBooks] = useState<BookDto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const booksData = await bookService.getAllBooks(0, 6);
        setFeaturedBooks(booksData.content || []);

        const categoriesData = await bookService.getAllCategories();
        setCategories(categoriesData || []);
      } catch (err) {
        console.error('Error loading landing page data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-primary-800 text-white py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Discover Your Next Favorite Book
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Explore our vast collection of books spanning every genre.
                From bestsellers to hidden gems, find stories that will captivate your imagination.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/books" className="btn bg-white text-primary-800 hover:bg-gray-100">
                  Browse Collection <ChevronRight size={16} />
                </Link>
                <Link to="/register" className="btn bg-transparent border border-white hover:bg-white/10">
                  Sign Up Today
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative h-80 w-full">
                <div className="absolute top-0 right-0 w-64 h-72 bg-white/10 rounded-lg transform rotate-6"></div>
                <div className="absolute top-10 right-10 w-64 h-72 bg-white/20 rounded-lg transform -rotate-3"></div>
                <div className="absolute top-5 right-20 w-64 h-72 bg-white/30 rounded-lg transform rotate-12 shadow-xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vast Selection</h3>
              <p className="text-gray-600">Thousands of books across all genres, with new titles added weekly.</p>
            </motion.div>

            <motion.div variants={item} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick shipping on all orders with tracking and delivery updates.</p>
            </motion.div>

            <motion.div variants={item} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-gray-600">All our books are carefully inspected to ensure perfect quality.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Books</h2>
            <Link to="/books" className="text-primary-600 font-medium flex items-center hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-primary-600"></div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {featuredBooks.map((book) => (
                <motion.div key={book.id} variants={item} className="group">
                  <Link to={`/books/${book.id}`} className="block">
                    <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
                      {book.image ? (
                        <img
                          src={imageUrl(book.image)}
                          alt={book.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BookOpen size={40} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
                    <p className="text-sm font-medium mt-1">
                      ${typeof book.price === 'string' ? parseFloat(book.price).toFixed(2) : book.price}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-l-2 border-primary-600"></div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {categories.map((category) => (
                <motion.div key={category} variants={item}>
                  <Link
                    to={`/category/${encodeURIComponent(category)}`}
                    className="block bg-white p-6 rounded-lg shadow-sm hover:shadow transition-shadow text-center"
                  >
                    <h3 className="font-medium text-lg">{category}</h3>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-6 bg-primary-800 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-8 opacity-90">
              Subscribe to our newsletter to get updates on new books, exclusive offers, and reading recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md text-gray-800 focus:outline-none"
              />
              <button className="px-6 py-3 bg-white text-primary-800 font-medium rounded-md hover:bg-gray-100">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"The selection of books is amazing and the delivery was so quick. I've found my new favorite bookstore!"</p>
              <p className="font-medium">- Sarah Johnson</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"The recommendations were spot on. I've discovered so many new authors thanks to this store."</p>
              <p className="font-medium">- Michael Thompson</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Great prices and even better customer service. I had a question about my order and they responded immediately."</p>
              <p className="font-medium">- Emma Davis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary-700 to-blue-800 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Reading?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied readers and discover your next page-turner today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/books" className="btn bg-white text-primary-700 hover:bg-gray-100">
              Explore Books
            </Link>
            <Link to="/register" className="btn bg-transparent border border-white hover:bg-white/10">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
