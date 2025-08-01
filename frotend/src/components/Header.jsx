import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaSignOutAlt, FaUserCircle, FaCog, FaUserShield, FaTimes as FaX } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    
    // Update cart count when storage changes
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery('');
      
      // Show a brief success message
      const successToast = document.createElement('div');
      successToast.className = 'success-toast';
      successToast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #28a745; font-size: 20px;">✓</span>
          Searching for "${trimmedQuery}"...
        </div>
      `;
      document.body.appendChild(successToast);
      
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast);
        }
      }, 2000);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-left">
          <Link to="/" className="logo">
            <img src={logo} alt="CottonCo" />
            <span className="logo-text">CottonCo</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link 
            to="/" 
            className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`nav-link ${isActiveRoute('/products') ? 'active' : ''}`}
          >
            Products
          </Link>
          <Link 
            to="/aboutus" 
            className={`nav-link ${isActiveRoute('/aboutus') ? 'active' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/contactus" 
            className={`nav-link ${isActiveRoute('/contactus') ? 'active' : ''}`}
          >
            Contact
          </Link>
          <Link 
            to="/support" 
            className={`nav-link ${isActiveRoute('/support') ? 'active' : ''}`}
          >
            Support
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="header-center">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !searchQuery.trim()) {
                  e.preventDefault();
                  // Show a message for empty search
                  const errorToast = document.createElement('div');
                  errorToast.className = 'error-toast';
                  errorToast.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="color: #ef4444; font-size: 20px;">⚠</span>
                      Please enter a search term
                    </div>
                  `;
                  document.body.appendChild(errorToast);
                  
                  setTimeout(() => {
                    if (document.body.contains(errorToast)) {
                      document.body.removeChild(errorToast);
                    }
                  }, 2000);
                }
              }}
            />
            {searchQuery && (
              <button 
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <FaX />
              </button>
            )}
            <button 
              type="submit" 
              className="search-btn"
              disabled={!searchQuery.trim()}
              title={searchQuery.trim() ? "Search products" : "Enter a search term"}
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="header-right">
          {/* Cart */}
          <Link to="/cart" className="header-icon cart-icon">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="user-menu">
              <button 
                className="user-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <FaUserCircle />
                <span className="user-name">{user?.name || 'User'}</span>
              </button>
              
              {showUserDropdown && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item">
                    <FaUser /> Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item admin-item">
                      <FaUserShield /> Admin Dashboard
                    </Link>
                  )}
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/register" className="signup-btn">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          {/* Mobile Search */}
          <div className="mobile-search">
            <form onSubmit={handleSearch} className="mobile-search-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-btn">
                <FaSearch />
              </button>
            </form>
          </div>
          
          <Link 
            to="/" 
            className={`mobile-nav-link ${isActiveRoute('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`mobile-nav-link ${isActiveRoute('/products') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Products
          </Link>
          <Link 
            to="/aboutus" 
            className={`mobile-nav-link ${isActiveRoute('/aboutus') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contactus" 
            className={`mobile-nav-link ${isActiveRoute('/contactus') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link 
            to="/support" 
            className={`mobile-nav-link ${isActiveRoute('/support') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Support
          </Link>
          
          {/* Admin link for mobile */}
          {isLoggedIn && user?.role === 'admin' && (
            <Link 
              to="/admin" 
              className={`mobile-nav-link admin-link ${isActiveRoute('/admin') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUserShield /> Admin Dashboard
            </Link>
          )}
          
          {!isLoggedIn && (
            <div className="mobile-auth">
              <Link to="/login" className="mobile-auth-btn" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="mobile-auth-btn primary" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
