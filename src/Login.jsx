import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import logo from './images/logo.png';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    navigate('/'); // Redirect on successful login
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-mainbody">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} height="60px" width="60px" alt="Logo" />
        </div>

        <div className="login-SU">
          <p>Sign IN</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email" className="login-mainline">Enter Your Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
          />

          <label htmlFor="password" className="login-mainline">Enter Your Password</label>
          <div className="login-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
            />
            <span className="login-eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="login-last">
            <button type="submit" className="login-LB">Sign In</button>
          </div>

          <p className="login-register-link">
            Don't have an account? <a href="/register">Register now</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
