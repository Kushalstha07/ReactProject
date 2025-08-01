import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Dashboard API
export const getDashboardStats = () => adminApi.get('/admin/dashboard/stats');

// Users Management API
export const getAllUsers = (params = {}) => adminApi.get('/admin/users', { params });
export const updateUserRole = (userId, role) => 
  adminApi.put(`/admin/users/${userId}/role`, { role });
export const deleteUser = (userId) => adminApi.delete(`/admin/users/${userId}`);

// Products Management API
export const getAllProducts = (params = {}) => adminApi.get('/admin/products', { params });
export const createProduct = (productData) => {
  // If productData is FormData, let browser set the Content-Type automatically
  const config = productData instanceof FormData ? {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  } : {};
  
  return adminApi.post('/products', productData, config);
};
export const updateProduct = (productId, productData) => 
  adminApi.put(`/admin/products/${productId}`, productData);
export const deleteProduct = (productId) => adminApi.delete(`/admin/products/${productId}`);

// Orders Management API
export const getAllOrders = (params = {}) => adminApi.get('/admin/orders', { params });
export const getOrderById = (orderId) => adminApi.get(`/admin/orders/${orderId}`);
export const updateOrderStatus = (orderId, status) => 
  adminApi.put(`/admin/orders/${orderId}/status`, { status });

// Auth check
export const checkAdminAuth = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  return token && user && user.role === 'admin';
};

export default adminApi;
