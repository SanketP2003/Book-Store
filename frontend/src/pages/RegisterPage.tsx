import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/services/api';
import { useAuth } from '@/store/auth';
import Alert from '../components/Alert'; // Adjusted path
import type { UserRegistrationRequest } from '@/types/api';
import { motion } from 'framer-motion';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserRegistrationRequest>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const res = await authApi.register(values);
      const { token, user } = res.data;
      login(token, { id: user.id, username: user.username, email: user.email, role: user.role as any });
      navigate('/', { replace: true });
    } catch (e: any) {
      if (e.response) {
        setErrorMessage(e.response.data?.message || 'Registration failed. Please try again.');
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
        <h1 className="text-3xl font-bold text-center text-text_primary-light dark:text-text_primary-dark mb-2">Create Your Account</h1>
        <p className="text-center text-text_secondary-light dark:text-text_secondary-dark mb-8">Join us and start your next adventure.</p>

        {errorMessage && <div className="mb-4"><Alert message={errorMessage} /></div>}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <HiOutlineUser className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              {...register('username', { required: 'Username is required' })}
              className="input-field pl-10"
            />
            {errors.username && <p className="text-sm text-error-light dark:text-error-dark mt-1">{errors.username.message}</p>}
          </div>

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
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
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
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </motion.button>
        </form>

        <p className="text-sm text-center text-text_secondary-light dark:text-text_secondary-dark mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-light dark:text-primary-dark hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
