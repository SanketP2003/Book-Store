import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '../components/Alert';
import type { LoginRequest } from '@/types/api';
import axios from 'axios';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineLogin, HiOutlineArrowSmRight, HiOutlineBookOpen } from 'react-icons/hi';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'https://book-store-backend-8880.onrender.com';

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (credentials) => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      // Log the request for debugging
      console.log('Login request:', credentials);

      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
      console.log('Login response:', response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Make sure the token is stored in localStorage directly, in addition to calling login
      localStorage.setItem('token', token);

      // Call the login function from AuthContext
      login(token, user);

      // Verify the token was stored correctly
      console.log('Token stored:', localStorage.getItem('token'));

      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);

      if (err.response) {
        if (err.response.status === 401) {
          setErrorMessage('Invalid email or password');
        } else {
          setErrorMessage(err.response.data?.message || 'An unknown server error occurred');
        }
      } else {
        setErrorMessage('Cannot connect to the server. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background-light dark:bg-background-dark">
      {/* Left side - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-light to-highlight-light dark:from-primary-dark dark:to-highlight-dark text-white p-8 justify-center items-center">
        <div className="max-w-md px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Link to="/" className="flex items-center gap-3 mb-8">
              <span className="relative flex items-center justify-center w-12 h-12">
                <span className="absolute w-10 h-10 bg-white/20 rounded-lg -rotate-6"></span>
                <HiOutlineBookOpen className="h-7 w-7 text-white z-10" />
              </span>
              <span className="text-3xl font-display font-bold">BookStore</span>
            </Link>
            <h1 className="text-4xl font-display font-bold mb-4">Welcome back to your literary journey</h1>
            <p className="text-lg text-white/80">
              Sign in to access your account, browse your favorite books, and continue exploring stories that inspire, educate, and entertain.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9.5L1 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 13.5L19 9.5L15 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-medium">"The more that you read, the more things you will know. The more that you learn, the more places you'll go."</p>
            </div>
            <p className="text-right text-white/70 text-sm">— Dr. Seuss</p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex justify-center items-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-soft-lg"
        >
          <div className="text-center mb-8">
            {/* Logo shown only on mobile */}
            <Link to="/" className="md:hidden flex items-center justify-center gap-2 mb-6">
              <span className="relative flex items-center justify-center w-10 h-10">
                <span className="absolute w-8 h-8 bg-gradient-to-br from-primary-light to-highlight-light dark:from-primary-dark dark:to-highlight-dark rounded-lg -rotate-6"></span>
                <HiOutlineBookOpen className="h-6 w-6 text-white z-10" />
              </span>
              <span className="text-xl font-display font-bold text-gradient">BookStore</span>
            </Link>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-text_primary-light dark:text-text_primary-dark mb-2">
              Sign in to your account
            </h2>
            <p className="text-text_secondary-light dark:text-text_secondary-dark">
              Welcome back! Please enter your details
            </p>
          </div>

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert message={errorMessage} />
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })}
                  className="form-input pl-10"
                  aria-invalid={errors.email ? "true" : "false"}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-error-light dark:text-error-dark mt-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="#" className="text-sm text-primary-light dark:text-primary-dark hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                  className="form-input pl-10"
                  aria-invalid={errors.password ? "true" : "false"}
                  autoComplete="current-password"
                />
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-error-light dark:text-error-dark mt-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <HiOutlineLogin size={20} />
                  <span>Sign in</span>
                </>
              )}
            </motion.button>

            <div className="text-center text-text_secondary-light dark:text-text_secondary-dark">
              <p>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-light dark:text-primary-dark font-medium hover:underline inline-flex items-center"
                >
                  Sign up <HiOutlineArrowSmRight className="ml-1" />
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
