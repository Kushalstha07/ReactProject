import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { checkAdminAuth } from '../services/adminApi';

// Admin Components
import AdminDashboard from '../admin/AdminDashboard/AdminDashboard';
import UsersManagement from '../admin/UsersManagement/UsersManagement';
import ProductsManagement from '../admin/ProductsManagement/ProductsManagement';
import OrdersManagement from '../admin/OrdersManagement/OrdersManagement';

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const isAdmin = checkAdminAuth();
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/admin" 
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedAdminRoute>
            <UsersManagement />
          </ProtectedAdminRoute>
        } 
      />
      <Route 
        path="/admin/products" 
        element={
          <ProtectedAdminRoute>
            <ProductsManagement />
          </ProtectedAdminRoute>
        } 
      />
      <Route 
        path="/admin/orders" 
        element={
          <ProtectedAdminRoute>
            <OrdersManagement />
          </ProtectedAdminRoute>
        } 
      />
    </Routes>
  );
};

export default AdminRoutes;
