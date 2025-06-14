import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './Register.css'; // Make sure the CSS file uses updated classNames
import logo from './images/logo.png';

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Submit data to backend or handle it here
    navigate('/'); // Redirect to homepage or login page
  };

  return (
    <div className="register-mainbody">
      <div className="register-box">
        <div className="register-header">
          <img src={logo} height="60px" width="60px" alt="Logo" />
        </div>
        <div className="register-SU">
          <p>Register</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name" className="register-mainline">Enter Your Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            {...register('name', { required: 'Name is required' })}
          />

          <label htmlFor="email" className="register-mainline">Enter Your Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
          />

          <label htmlFor="password" className="register-mainline">Enter Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
          />

          <label htmlFor="confirmPassword" className="register-mainline">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
            })}
          />

          <div className="register-last">
            <button type="submit" className="register-LB">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
