import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa';
import axios from 'axios';
import './Login.css';
import logo from '../assets/logo.png';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: data.email,
        password: data.password
      });

      // Store token
      const token = response.data.data.access_token;
      localStorage.setItem('token', token);
      
      // Fetch user details with the token
      try {
        const userResponse = await axios.get('http://localhost:3000/api/auth/init', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = userResponse.data.data;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-toast';
        successDiv.textContent = 'Login successful! Redirecting...';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
          // Redirect admin users to admin dashboard, regular users to home
          if (userData.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
          window.location.reload(); // Refresh to update header state
        }, 1500);
        
      } catch (userError) {
        console.error('Failed to fetch user details:', userError);
        // Fallback to basic user info
        const userInfo = {
          email: data.email,
          name: data.email.split('@')[0],
          role: 'user'
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        // Show success message and redirect to home for fallback
        const successDiv = document.createElement('div');
        successDiv.className = 'success-toast';
        successDiv.textContent = 'Login successful! Redirecting...';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
          navigate('/');
          window.location.reload();
        }, 1500);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      
      // Show error toast
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-toast';
      errorDiv.textContent = errorMessage;
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          {/* Logo and Brand */}
          <div className="login-header">
            <img src={logo} className="login-logo" alt="CottonCo" />
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your CottonCo account</p>
          </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <div className="input-group">
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className={`login-input ${errors.email ? 'error' : ''}`}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    className={`login-input ${errors.password ? 'error' : ''}`}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
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

              <div className="login-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className={`login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Social Login */}
            <div className="social-login">
              <div className="divider">
                <span>Or continue with</span>
              </div>
              <div className="social-buttons">
                <button className="social-btn google" type="button">
                  <FaGoogle />
                  <span>Google</span>
                </button>
                <button className="social-btn facebook" type="button">
                  <FaFacebook />
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="register-link">
              <span>Don't have an account? </span>
              <Link to="/register">Create one now</Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
