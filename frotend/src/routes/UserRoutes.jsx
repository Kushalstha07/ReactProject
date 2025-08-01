import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from '../public/Home'; 
import Login from '../public/Login'; 
import Register from '../public/Register'; 
import Support from '../public/Support';
import ContactUs from '../public/ContactUs';
import AboutUs from '../public/AboutUs';
import Products from '../public/Products';
import Cart from '../private/Cart';
import Checkout from '../private/Checkout';
import OrderConfirmation from '../private/OrderConfirmation';
import OrderDetail from '../private/OrderDetail';
import Profile from '../private/Profile';
import TestProfile from '../private/TestProfile';

// Admin Components
import AdminDashboard from '../admin/AdminDashboard/AdminDashboard';
import UsersManagement from '../admin/UsersManagement/UsersManagement';
import ProductsManagement from '../admin/ProductsManagement/ProductsManagement';
import OrdersManagement from '../admin/OrdersManagement/OrdersManagement';
import AdminOrderDetail from '../admin/OrdersManagement/OrderDetail';
import AddProduct from '../admin/AddProduct/AddProduct';

export default function UserRoutes() {
    return(
    <Routes> 
      <Route path="/" element={<Homepage />} /> 
      <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} /> 
      <Route path="/support" element={<Support />} />
      <Route path="/contactus" element={<ContactUs />} />   
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order/:orderNumber" element={<OrderDetail />} />
        <Route path="/profile" element={<Profile />} />      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UsersManagement />} />
      <Route path="/admin/products" element={<ProductsManagement />} />
      <Route path="/admin/products/add" element={<AddProduct />} />
      <Route path="/admin/orders" element={<OrdersManagement />} />
      <Route path="/admin/orders/:orderId" element={<AdminOrderDetail />} />
    </Routes> 
    );
}