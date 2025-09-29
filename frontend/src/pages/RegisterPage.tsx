import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/services/api';
import { useAuth } from '@/store/auth';
import Alert from '../components/Alert';
import type { UserRegistrationRequest } from '@/types/api';
import { motion } from 'framer-motion';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineBookOpen,
  HiOutlineUserAdd,
  HiOutlineArrowSmLeft
} from 'react-icons/hi';

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
    <div className="min-h-screen flex flex-col md:flex-row bg-background-light dark:bg-background-dark">
      {/* Left side - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-highlight-light to-primary-light dark:from-highlight-dark dark:to-primary-dark text-white p-8 justify-center items-center">
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
            <h1 className="text-4xl font-display font-bold mb-4">Begin your reading adventure today</h1>
            <p className="text-lg text-white/80">
              Create an account to track your favorite books, get personalized recommendations, and join our community of passionate readers.
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6.25278V19.2528M12 6.25278C10.8321 6.25278 9.66071 6.04129 8.57037 5.6264C7.48002 5.2115 6.48997 4.60096 5.64612 3.83147C4.80227 3.06198 4.11673 2.14699 3.63378 1.13813C3.15083 0.129266 2.87841 -0.0129455 2.83789 0.000896392C2.79736 0.0147383 2.77859 0.115958 2.78134 0.303223C2.7841 0.490488 2.79472 0.67838 2.8131 0.865442C2.83147 1.05251 2.85279 1.23745 2.87594 1.41969C2.89909 1.60193 2.92719 1.78173 2.96013 1.95843C2.99308 2.13513 3.21832 2.52927 3.23965 2.69689C3.26098 2.86451 3.6394 3.54472 3.67461 3.69418C3.7098 3.84364 3.95576 4.41743 4.01531 4.60356C4.07486 4.78969 4.34341 5.15475 4.40902 5.33384C4.47462 5.51292 4.6926 5.82255 4.7582 5.99407C4.8238 6.16559 5.0287 6.41476 5.10039 6.51802C5.17208 6.62129 5.24377 6.73894 5.31546 6.87099C5.66266 7.3587 6.06642 7.81429 6.52231 8.22736C6.9782 8.64043 7.48293 9.00787 8.02555 9.31989C8.56817 9.63191 9.14504 9.88678 9.74476 10.077C10.3445 10.2673 10.9634 10.3913 11.5903 10.4469C11.7271 10.4552 11.864 10.4594 12 10.4594" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6.25278V19.2528M12 6.25278C13.1679 6.25278 14.3393 6.04129 15.4296 5.6264C16.52 5.2115 17.51 4.60096 18.3539 3.83147C19.1977 3.06198 19.8833 2.14699 20.3662 1.13813C20.8492 0.129266 21.1216 -0.0129455 21.1621 0.000896392C21.2026 0.0147383 21.2214 0.115958 21.2187 0.303223C21.2159 0.490488 21.2053 0.67838 21.1869 0.865442C21.1685 1.05251 21.1472 1.23745 21.1241 1.41969C21.1009 1.60193 21.0728 1.78173 21.0399 1.95843C21.0069 2.13513 20.7817 2.52927 20.7603 2.69689C20.739 2.86451 20.3606 3.54472 20.3254 3.69418C20.2902 3.84364 20.0442 4.41743 19.9847 4.60356C19.9251 4.78969 19.6566 5.15475 19.591 5.33384C19.5254 5.51292 19.3074 5.82255 19.2418 5.99407C19.1762 6.16559 18.9713 6.41476 18.8996 6.51802C18.8279 6.62129 18.7562 6.73894 18.6845 6.87099C18.3373 7.3587 17.9336 7.81429 17.4777 8.22736C17.0218 8.64043 16.5171 9.00787 15.9745 9.31989C15.4318 9.63191 14.855 9.88678 14.2552 10.077C13.6555 10.2673 13.0366 10.3913 12.4097 10.4469C12.2729 10.4552 12.136 10.4594 12 10.4594" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-medium">"A reader lives a thousand lives before he dies. The man who never reads lives only one."</p>
            </div>
            <p className="text-right text-white/70 text-sm">— George R.R. Martin</p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Register Form */}
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
                <HiOutlineBookOpen className="h-6 w-6 text-primary-light dark:text-primary-dark z-10" />
              </span>
              <span className="text-2xl font-display font-bold text-primary-light dark:text-primary-dark">BookStore</span>
            </Link>
            <h2 className="page-title">Create your account</h2>
            <p className="text-text_secondary-light dark:text-text_secondary-dark">
              Join our community and start your reading journey.
            </p>
          </div>

          {errorMessage && <Alert type="error" message={errorMessage} className="mb-4" />}

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-with-icon">
                <span className="icon"><HiOutlineUser size={18} /></span>
                <input
                  id="username"
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  className="form-input"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
              {errors.username && <p className="text-error-light dark:text-error-dark text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-with-icon">
                <span className="icon"><HiOutlineMail size={18} /></span>
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="form-input"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-error-light dark:text-error-dark text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon">
                <span className="icon"><HiOutlineLockClosed size={18} /></span>
                <input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="form-input"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
              </div>
              {errors.password && <p className="text-error-light dark:text-error-dark text-sm mt-1">{errors.password.message}</p>}
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
              icon={<HiOutlineUserAdd size={20} />}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-text_secondary-light dark:text-text_secondary-dark">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-light dark:text-primary-dark font-medium hover:underline">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
