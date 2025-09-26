import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi, ordersApi } from '../services/api';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { formatCurrency, imageUrl } from '@/utils/format';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  HiOutlineTrash,
  HiArrowRight,
  HiPlus,
  HiMinus,
  HiOutlineShoppingBag,
  HiOutlineCreditCard,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck
} from 'react-icons/hi';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [shippingAddress, setShippingAddress] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Fetch cart with error handling
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get().then(r => r.data),
    // Add retry and increased timeout for better reliability
    retry: (failureCount: number, err: any) => {
      // Don't retry on 403 to prevent noisy loops; retry other errors up to 2 times
      const status = err?.response?.status;
      if (status === 403) return false;
      return failureCount < 2;
    },
    staleTime: 30000,
    // Remove cacheTime and onError as they're causing TypeScript errors
  });

  // Log errors separately instead of in the query config
  useEffect(() => {
    if (error) {
      console.error('Error fetching cart:', error);
    }
  }, [error]);

  // Update cart item quantity
  const updateMutation = useMutation({
    mutationFn: ({id, quantity}: {id: number, quantity: number}) =>
      cartApi.update(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  // Remove item from cart
  const removeMutation = useMutation({
    mutationFn: (id: number) => cartApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: (orderData: any) => ordersApi.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCheckoutSuccess(true);

      // Reset checkout form
      setShippingAddress('');
      setPaymentMethod('CREDIT_CARD');

      // After 3 seconds, redirect to orders page
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    }
  });

  // Handlers
  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity >= 1) {
      updateMutation.mutate({id, quantity});
    }
  };

  const handleRemoveItem = (id: number) => {
    removeMutation.mutate(id);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrderMutation.mutate({
      shippingAddress,
      paymentMethod
    });
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="page-container py-8 flex justify-center items-center min-h-[50vh]">
        <Loader label="Loading your cart..." />
      </div>
    );
  }

  if (isError) {
    const status = (error as any)?.response?.status;
    const message = (error as any)?.response?.data?.message;
    const forbidden = status === 403;
    return (
      <div className="page-container py-8">
        <h1 className="page-title mb-6">Your Shopping Cart</h1>
        <Alert
          type={forbidden ? 'error' : 'error'}
          message={
            forbidden
              ? (user?.role === 'ADMIN'
                  ? 'Access to the cart API is forbidden for admin accounts on this server. Please use a customer (USER) account to view and manage the cart.'
                  : 'You do not have permission to access the cart. Please log in with a customer account or contact support.')
              : (message || 'Failed to load your cart. Please try again.')
          }
        />
        <div className="mt-6 flex gap-3">
          <Link to="/books" className="btn-secondary">Browse Books</Link>
          {!user && <Link to="/login" className="btn-primary">Login</Link>}
        </div>
      </div>
    );
  }

  // Safely extract cart items
  const cart = data || { items: [] };
  const items = Array.isArray(cart.items) ? cart.items : [];

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  // Empty cart view
  if (items.length === 0 && !checkoutSuccess) {
    return (
      <div className="page-container py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          Your Shopping Cart
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center"
        >
          <div className="flex justify-center mb-6">
            <HiOutlineShoppingBag className="w-20 h-20 text-text_secondary-light dark:text-text_secondary-dark opacity-50" />
          </div>
          <p className="text-xl text-text_secondary-light dark:text-text_secondary-dark mb-6">
            Your cart is currently empty.
          </p>
          <Link to="/books" className="btn-primary inline-flex items-center gap-2 text-lg">
            Start Shopping <HiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

  // Checkout success view
  if (checkoutSuccess) {
    return (
      <div className="page-container py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-title"
        >
          Your Shopping Cart
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center"
        >
          <div className="flex justify-center mb-6">
            <HiOutlineCheckCircle className="w-20 h-20 text-success-light dark:text-success-dark" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text_primary-light dark:text-text_primary-dark mb-3">
            Order Placed Successfully!
          </h2>
          <p className="text-xl text-text_secondary-light dark:text-text_secondary-dark mb-8">
            Thank you for your purchase. We're preparing your order now.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/orders" className="btn-primary inline-flex items-center gap-2">
              View Your Orders <HiArrowRight />
            </Link>
            <Link to="/books" className="btn-secondary inline-flex items-center gap-2">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Main cart view with items
  return (
    <div className="page-container py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-title"
      >
        Your Shopping Cart
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Item List */}
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                  className="card p-4 flex flex-col sm:flex-row items-center gap-4"
                >
                  <Link to={`/books/${item.bookId}`} className="shrink-0">
                    <img
                      src={imageUrl(item.image)}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-md shadow-sm"
                    />
                  </Link>

                  <div className="flex-grow text-center sm:text-left">
                    <Link
                      to={`/books/${item.bookId}`}
                      className="font-bold text-text_primary-light dark:text-text_primary-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-text_secondary-light dark:text-text_secondary-dark mb-2">
                      {formatCurrency(item.price)} each
                    </p>
                    <p className="text-primary-light dark:text-primary-dark font-semibold">
                      Subtotal: {formatCurrency(Number(item.price) * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Quantity Control */}
                    <div className="flex items-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={item.quantity <= 1 || updateMutation.isPending}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-2 rounded-l-lg bg-gray-100 dark:bg-gray-800 text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HiMinus size={16} />
                      </motion.button>

                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => handleUpdateQuantity(item.id, Number(e.target.value))}
                        className="input-field w-14 h-10 text-center rounded-none border-y border-x-0 border-gray-200 dark:border-gray-700"
                      />

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={updateMutation.isPending}
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-2 rounded-r-lg bg-gray-100 dark:bg-gray-800 text-text_secondary-light dark:text-text_secondary-dark hover:text-primary-light dark:hover:text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HiPlus size={16} />
                      </motion.button>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-error-light dark:text-error-dark rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={removeMutation.isPending}
                    >
                      <HiOutlineTrash size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Checkout Form */}
          {showCheckout && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-6"
            >
              <h2 className="text-xl font-display font-bold mb-4">Shipping Information</h2>
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label htmlFor="shippingAddress" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                    Shipping Address *
                  </label>
                  <textarea
                    id="shippingAddress"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Enter your full shipping address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                    Payment Method *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CREDIT_CARD"
                        checked={paymentMethod === 'CREDIT_CARD'}
                        onChange={() => setPaymentMethod('CREDIT_CARD')}
                        className="mr-3"
                      />
                      <HiOutlineCreditCard className="mr-2 text-primary-light dark:text-primary-dark" size={20} />
                      <span>Credit Card</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg cursor-pointer border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="PAYPAL"
                        checked={paymentMethod === 'PAYPAL'}
                        onChange={() => setPaymentMethod('PAYPAL')}
                        className="mr-3"
                      />
                      <HiOutlineShieldCheck className="mr-2 text-secondary-light dark:text-secondary-dark" size={20} />
                      <span>PayPal</span>
                    </label>
                  </div>
                </div>

                {/* For demo purposes only - no actual payment processing */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                  <p><strong>Demo mode:</strong> No actual payment will be processed.</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="btn-secondary"
                  >
                    Back to Cart
                  </button>
                  <button
                    type="submit"
                    disabled={placeOrderMutation.isPending || !shippingAddress.trim()}
                    className="btn-primary flex items-center gap-2"
                  >
                    {placeOrderMutation.isPending ? (
                      <>
                        <Loader size="sm" /> Processing...
                      </>
                    ) : (
                      <>
                        Place Order <HiArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-24"
        >
          <div className="card p-6">
            <h2 className="text-xl font-display font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-text_secondary-light dark:text-text_secondary-dark">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text_secondary-light dark:text-text_secondary-dark">Shipping</span>
                <span className="font-medium">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text_secondary-light dark:text-text_secondary-dark">Tax (8%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-light dark:text-primary-dark">{formatCurrency(total)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCheckout(true)}
              disabled={items.length === 0 || showCheckout}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <HiOutlineLocationMarker size={20} />
              {showCheckout ? "Completing Checkout..." : "Proceed to Checkout"}
            </motion.button>

            <div className="mt-6 text-center text-sm text-text_secondary-light dark:text-text_secondary-dark">
              <p>Need help? <Link to="/contact" className="text-primary-light dark:text-primary-dark hover:underline">Contact our support team</Link></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
