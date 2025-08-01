import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { getUserOrders } from '../services/orderApi';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('Profile component rendered'); // Debug log

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
      
      // Fetch user orders from API
      if (userInfo.id) {
        fetchUserOrders(userInfo.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Check for order refresh flag when component mounts
  useEffect(() => {
    const shouldRefreshOrders = localStorage.getItem('refreshOrders');
    if (shouldRefreshOrders === 'true' && user && user.id) {
      console.log('Refreshing orders after new order placement');
      fetchUserOrders(user.id);
      localStorage.removeItem('refreshOrders'); // Clear the flag
    }
  }, [user]);

  const fetchUserOrders = async (userId) => {
    try {
      setLoading(true);
      
      const response = await getUserOrders(userId);
      
      if (response.data && response.data.success) {
        const newOrders = response.data.data || [];
        setOrders(newOrders);
        
        // Show success message if orders were refreshed after new order
        const wasRefreshed = localStorage.getItem('refreshOrders') === 'true';
        if (wasRefreshed && newOrders.length > 0) {
          const successDiv = document.createElement('div');
          successDiv.className = 'success-toast';
          successDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #28a745; font-size: 20px;">✓</span>
              Your new order has been added to your history!
            </div>
          `;
          document.body.appendChild(successDiv);
          
          setTimeout(() => {
            if (document.body.contains(successDiv)) {
              document.body.removeChild(successDiv);
            }
          }, 3000);
        }
      } else {
        console.error('Failed to fetch orders:', response.data?.message || 'Unknown error');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh orders (can be called from other components)
  const refreshOrders = () => {
    if (user && user.id) {
      fetchUserOrders(user.id);
    }
  };

  // Expose refresh function globally so it can be called after order creation
  useEffect(() => {
    window.refreshUserOrders = refreshOrders;
    return () => {
      delete window.refreshUserOrders;
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#28a745';
      case 'processing': return '#ffc107';
      case 'shipped': return '#17a2b8';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Add a simple fallback if something goes wrong
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">
            <p>Unable to load profile. Please try logging in again.</p>
            <button onClick={() => navigate('/login')}>Go to Login</button>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Account</h1>
          <p>Manage your profile and view your orders</p>
        </div>


          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="menu-item" onClick={() => setActiveTab('profile')}>
                <FaUser />
                <span>Profile Details</span>
              </div>
              <div className="menu-item" onClick={() => setActiveTab('orders')}>
                <FaShoppingBag />
                <span>Order History</span>
              </div>
              <div className="menu-item" onClick={() => setActiveTab('wishlist')}>
                <FaHeart />
                <span>Wishlist</span>
              </div>
              <div className="menu-item" onClick={() => setActiveTab('settings')}>
                <FaCog />
                <span>Settings</span>
              </div>
              <div className="menu-item logout" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </div>
            </div>

            <div className="profile-main">
              {activeTab === 'profile' && (
                <div className="profile-details-card">
                  <h2>Profile Details</h2>
                  <div className="profile-info">
                    <div className="info-group">
                      <label>Name</label>
                      <p>{user?.name || 'Not provided'}</p>
                    </div>
                    <div className="info-group">
                      <label>Email</label>
                      <p>{user?.email || 'Not provided'}</p>
                    </div>
                    <div className="info-group">
                      <label>Member Since</label>
                      <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}</p>
                    </div>
                  </div>
                  <button className="edit-btn">Edit Profile</button>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="order-history-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Purchase History</h2>
                    <button 
                      className="refresh-btn"
                      onClick={() => user && user.id && fetchUserOrders(user.id)}
                      disabled={loading}
                      style={{
                        background: '#2832C2',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {loading ? 'Refreshing...' : 'Refresh Orders'}
                    </button>
                  </div>
                  {(() => {
                    try {
                      if (!orders || orders.length === 0) {
                        return (
                          <div className="no-orders">
                            <p>You haven't placed any orders yet.</p>
                            <button className="shop-now-btn" onClick={() => navigate('/products')}>
                              Start Shopping
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="orders-list">
                          {orders.map((order, orderIndex) => (
                            <div key={order.id || orderIndex} className="order-item">
                              <div className="order-header">
                                <div className="order-info">
                                  <h3>Order #{order.orderNumber || `#${orderIndex + 1}`}</h3>
                                  <p>Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                                <div className="order-status">
                                  <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(order.status || 'pending') }}
                                  >
                                    {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="order-items">
                                {(order.OrderItems || []).map((item, index) => (
                                  <div key={index} className="order-item-detail">
                                    <span>{item.Product?.name || 'Product'}</span>
                                    <span>Qty: {item.quantity || 0}</span>
                                    <span className="item-price">Rs.{(() => {
                                      try {
                                        const price = parseFloat(item.price) || 0;
                                        return price.toFixed(2);
                                      } catch (error) {
                                        console.error('Error formatting price:', error);
                                        return '0.00';
                                      }
                                    })()}</span>
                                    {item.size && <span>Size: {item.size}</span>}
                                    {item.color && <span>Color: {item.color}</span>}
                                  </div>
                                ))}
                              </div>
                              
                              <div className="order-footer">
                                <span className="order-total">Total: Rs.{(() => {
                                  try {
                                    const total = parseFloat(order.totalAmount) || 0;
                                    return total.toFixed(2);
                                  } catch (error) {
                                    console.error('Error formatting total:', error);
                                    return '0.00';
                                  }
                                })()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    } catch (error) {
                      console.error('Error rendering orders:', error);
                      return (
                        <div className="error-message">
                          <p>Error loading orders. Please try refreshing the page.</p>
                          <button onClick={() => user && user.id && fetchUserOrders(user.id)}>
                            Retry
                          </button>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="wishlist-card">
                  <h2>My Wishlist</h2>
                  <div className="empty-wishlist">
                    <p>Your wishlist is empty.</p>
                    <button className="shop-now-btn" onClick={() => navigate('/products')}>
                      Discover Products
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="settings-card">
                  <h2>Account Settings</h2>
                  <div className="settings-section">
                    <h3>Notifications</h3>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Email notifications for orders
                      </label>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Promotional emails
                      </label>
                    </div>
                  </div>
                  
                  <div className="settings-section">
                    <h3>Privacy</h3>
                    <div className="setting-item">
                      <label>
                        <input type="checkbox" defaultChecked />
                        Share order history for recommendations
                      </label>
                    </div>
                  </div>
                  
                  <button className="save-settings-btn">Save Settings</button>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}

export default Profile; 