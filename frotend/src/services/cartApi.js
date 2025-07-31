import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const cartApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
cartApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
cartApi.interceptors.response.use(
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

// Cart API functions
export const getCart = () => cartApi.get('/cart');
export const getCartCount = () => cartApi.get('/cart/count');
export const addToCart = (cartData) => cartApi.post('/cart', cartData);
export const updateCartItem = (itemId, quantity) => cartApi.put(`/cart/${itemId}`, { quantity });
export const removeFromCart = (itemId) => cartApi.delete(`/cart/${itemId}`);
export const clearCart = () => cartApi.delete('/cart');

// Helper function to check if user is authenticated
export const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  return !!(token && userData);
};
