import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '../components/Alert';
import type { LoginRequest } from '@/types/api';
import axios from 'axios';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8080';

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
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface-light dark:bg-surface-dark p-8 rounded-xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center text-text_primary-light dark:text-text_primary-dark mb-2">Welcome Back</h1>
        <p className="text-center text-text_secondary-light dark:text-text_secondary-dark mb-8">Sign in to continue</p>

        {errorMessage && <div className="mb-4"><Alert message={errorMessage} /></div>}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <HiOutlineMail className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="input-field pl-10"
            />
            {errors.email && <p className="text-sm text-error-light dark:text-error-dark mt-1">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <HiOutlineLockClosed className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="input-field pl-10"
            />
            {errors.password && <p className="text-sm text-error-light dark:text-error-dark mt-1">{errors.password.message}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-sm text-center text-text_secondary-light dark:text-text_secondary-dark mt-8">
          Don't have an account?{' '} 
          <Link to="/register" className="font-medium text-primary-light dark:text-primary-dark hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
