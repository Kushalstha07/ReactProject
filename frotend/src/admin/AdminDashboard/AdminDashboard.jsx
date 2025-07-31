import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaShoppingBag, 
  FaClipboardList, 
  FaDollarSign,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { checkAdminAuth, getDashboardStats } from '../../services/adminApi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check admin authentication
    if (!checkAdminAuth()) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      const { stats: dashboardStats, recentOrders: orders } = response.data.data;
      
      setStats(dashboardStats);
      setRecentOrders(orders);
      setError('');
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    
    return `status-badge ${statusClasses[status] || 'status-pending'}`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your CottonCo store</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardData}>Retry</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/admin/users')}
          >
            <FaEye />
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <FaShoppingBag />
          </div>
          <div className="stat-info">
            <h3>{stats.totalProducts}</h3>
            <p>Total Products</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/admin/products')}
          >
            <FaEye />
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <FaClipboardList />
          </div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
          <button 
            className="stat-action"
            onClick={() => navigate('/admin/orders')}
          >
            <FaEye />
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button 
            className="action-btn add-product"
            onClick={() => navigate('/admin/products/add')}
          >
            <FaPlus />
            <span>Add Product</span>
          </button>
          <button 
            className="action-btn manage-users"
            onClick={() => navigate('/admin/users')}
          >
            <FaUsers />
            <span>Manage Users</span>
          </button>
          <button 
            className="action-btn view-orders"
            onClick={() => navigate('/admin/orders')}
          >
            <FaClipboardList />
            <span>View Orders</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <div className="section-header">
          <h2>Recent Orders</h2>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/admin/orders')}
          >
            View All
          </button>
        </div>
        
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="customer-info">
                        <strong>{order.User?.name || 'N/A'}</strong>
                        <small>{order.User?.email || 'N/A'}</small>
                      </div>
                    </td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn-edit"
                          onClick={() => navigate(`/admin/orders/${order.id}/edit`)}
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
