import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // In a real app, you would fetch user data and orders from the API
      // For now, we'll use mock data
      setOrders([
        {
          id: 1,
          orderNumber: 'ORD-001',
          date: '2024-01-15',
          status: 'delivered',
          total: 299.99,
          items: [
            { name: 'Cotton Dress', quantity: 1, price: 199.99 },
            { name: 'Cotton Shirt', quantity: 1, price: 100.00 }
          ]
        },
        {
          id: 2,
          orderNumber: 'ORD-002',
          date: '2024-01-10',
          status: 'processing',
          total: 150.00,
          items: [
            { name: 'Cotton Pants', quantity: 1, price: 150.00 }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

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
                  <h2>Order History</h2>
                  {orders.length === 0 ? (
                    <div className="no-orders">
                      <p>You haven't placed any orders yet.</p>
                      <button className="shop-now-btn" onClick={() => navigate('/products')}>
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="orders-list">
                      {orders.map((order) => (
                        <div key={order.id} className="order-item">
                          <div className="order-header">
                            <div className="order-info">
                              <h3>Order #{order.orderNumber}</h3>
                              <p>Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="order-status">
                              <span 
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(order.status) }}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="order-items">
                            {order.items.map((item, index) => (
                              <div key={index} className="order-item-detail">
                                <span>{item.name}</span>
                                <span>Qty: {item.quantity}</span>
                                <span className="item-price">${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="order-footer">
                            <span className="order-total">Total: ${order.total.toFixed(2)}</span>
                            <button className="view-order-btn">View Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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