import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css'; 
import logo from '../assets/logo.png'; 
import { createUser } from '../services/userApi';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { name, email, password } = data;
      const response = await createUser({ name, email, password });

      toast.success("Registration successful! Redirecting to login...");
      reset();
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <Link to="/" className="register-logo">
              <img src={logo} alt="CottonCo" />
              <span className="logo-text">CottonCo</span>
            </Link>
            <h1 className="register-title">Create Account</h1>
            <p className="register-subtitle">Join our cotton family today</p>
          </div>



          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            {/* Name Field */}
            <div className="input-group">
              <label htmlFor="name" className="input-label">Full Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  {...register('name', { 
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
              </div>
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            {/* Email Field */}
            <div className="input-group">
              <label htmlFor="email" className="input-label">Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>

            {/* Password Field */}
            <div className="input-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password.message}</span>}
            </div>

            {/* Confirm Password Field */}
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watch('password') || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
            </div>

            {/* Terms and Conditions */}
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                {...register('terms', { required: 'You must accept the terms and conditions' })}
              />
              <label htmlFor="terms">
                I agree to the <Link to="/terms" className="terms-link">Terms & Conditions</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </label>
              {errors.terms && <span className="error-message">{errors.terms.message}</span>}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`register-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="register-footer">
            <p>Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
          </div>
        </div>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Register;
