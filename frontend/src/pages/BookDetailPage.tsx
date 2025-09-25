import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { booksApi, cartApi } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { formatCurrency, imageUrl } from '@/utils/format';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineShoppingCart } from 'react-icons/hi';

export default function BookDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState('');

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.get(id).then(r => r.data),
    enabled: !!id,
  });

  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  const handleAddToCart = async () => {
    if (!token) {
      // Redirect to login and come back here after successful login
      navigate('/login', { state: { from: location } });
      return;
    }
    setError('');
    try {
      await cartApi.add({ bookId: Number(id), quantity });
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      setIsAdded(true);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        setError('You don\'t have permission to modify the cart. Please use a customer (USER) account.');
      } else {
        setError('Failed to add item to cart. Please try again.');
      }
    }
  };

  if (isLoading) return <Loader label="Loading book details..." />;
  if (isError || !book) return <div className="container mx-auto p-4"><Alert message="Could not find the book you're looking for." /></div>;

  const columnVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Left Column: Image */}
        <motion.div
          initial={{ ...columnVariants.hidden, x: -30 }}
          animate={{ ...columnVariants.visible, x: 0 }}
          className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-lg"
        >
          <img
            src={imageUrl(book.image)}
            alt={book.title}
            className="w-full h-full object-contain rounded-lg aspect-[4/3]"
          />
        </motion.div>

        {/* Right Column: Details */}
        <motion.div
          initial={{ ...columnVariants.hidden, x: 30 }}
          animate={{ ...columnVariants.visible, x: 0 }}
          className="flex flex-col h-full"
        >
          <h1 className="text-4xl font-extrabold text-text_primary-light dark:text-text_primary-dark mb-2">{book.title}</h1>
          <p className="text-xl text-text_secondary-light dark:text-text_secondary-dark mb-4">by {book.author}</p>
          
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-primary-light dark:text-primary-dark">{formatCurrency(book.price)}</span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="text-xl text-gray-400 line-through">{formatCurrency(book.originalPrice)}</span>
            )}
          </div>

          <p className="text-text_secondary-light dark:text-text_secondary-dark whitespace-pre-line leading-relaxed mb-8">{book.description}</p>

          <div className="mt-auto">
            {error && <Alert message={error} type="error" className="mb-4" />}
            {isAdded && <Alert message="Added to cart successfully!" type="success" className="mb-4" />}

            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                className="input-field w-24 text-center"
              />
              <motion.button
                onClick={handleAddToCart}
                className="btn-primary flex-1 text-lg flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HiOutlineShoppingCart size={22} />
                Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
