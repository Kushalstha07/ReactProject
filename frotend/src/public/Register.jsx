import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import './Register.css'; 
import logo from './images/logo.png'; 
import axios from 'axios';
import { createUser } from '../services/userApi';



function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [users, setUsers] = useState([]);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      setUsers(response.data.data); // assuming your API returns { data: [...] }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };
  fetchUsers();
}, []);


const onSubmit = async (data) => {
  try {
    const { name, email, password } = data;
    const response = await createUser({ name, email, password });

    alert("Registered successfully");
    reset();
    setTimeout(() => navigate("/login"), 1000);
  } catch (error) {
    alert(error.response?.data?.message );
  }
};

  const columns = [
    { name: 'Name', selector: row => row.name, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Password', selector: row => '*'.repeat(row.password.length) },
  ];

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
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            })}
          />

          <div className="register-last">
            <button type="submit" className="register-LB">Register</button>
          </div>
        </form>
      </div>

      {/* DataTable */}
      <div style={{ marginTop: '40px', width: '90%' }}>
        <DataTable
          title="Registered Users"
          columns={columns}
          data={Array.isArray(users) ? users : []}
          pagination
        />
      </div>
    </div>
  );
}

export default Register;
