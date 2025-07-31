import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaClipboardList, 
  FaSearch, 
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCalendarAlt
} from 'react-icons/fa';
import { getAllOrders, updateOrderStatus, checkAdminAuth } from '../../services/adminApi';
import './OrdersManagement.css';

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (!checkAdminAuth()) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate, currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter
      };
      
      const response = await getAllOrders(params);
      const { orders: orderData, pagination } = response.data.data;
      
      setOrders(orderData);
      setTotalPages(pagination.totalPages);
      setTotalOrders(pagination.totalOrders);
      setError('');
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#007bff',
      shipped: '#28a745',
      delivered: '#17a2b8',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="orders-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-management">
      <div className="page-header">
        <div className="header-content">
          <button 
            className="back-btn"
            onClick={() => navigate('/admin')}
          >
            <FaChevronLeft />
            Back to Dashboard
          </button>
          <div className="header-info">
            <h1><FaClipboardList /> Orders Management</h1>
            <p>Track and manage customer orders</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchOrders}>Retry</button>
        </div>
      )}

      {/* Filters and Stats */}
      <div className="controls-section">
        <div className="filter-section">
          <FaFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="status-filter"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="orders-stats">
          <span className="stat-item">Total Orders: <strong>{totalOrders}</strong></span>
          <span className="stat-item">Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <h3>Order #{order.id}</h3>
                  <span className="order-date">
                    <FaCalendarAlt />
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                
                <div className="order-status-section">
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                  >
                    {statusOptions.slice(1).map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="order-content">
                <div className="customer-section">
                  <h4>Customer Information</h4>
                  <div className="customer-info">
                    <div className="customer-details">
                      <strong>{order.User?.name || 'N/A'}</strong>
                      <span className="customer-email">{order.User?.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="order-details-section">
                  <div className="detail-group">
                    <div className="detail-item">
                      <FaCreditCard className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Payment Method</span>
                        <span className="detail-value">{order.paymentMethod}</span>
                      </div>
                    </div>
                    
                    <div className="detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Shipping Address</span>
                        <span className="detail-value shipping-address">
                          {order.shippingAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="amount-info">
                    <span className="amount-label">Total Amount</span>
                    <span className="amount-value">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  
                  <button 
                    className="view-details-btn"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </div>

              <div 
                className="order-status-line" 
                style={{ backgroundColor: getStatusColor(order.status) }}
              ></div>
            </div>
          ))
        ) : (
          <div className="no-orders">
            {statusFilter ? (
              <div className="no-results">
                <FaClipboardList size={48} />
                <h3>No orders found</h3>
                <p>No orders match the selected status filter</p>
                <button 
                  className="clear-filter-btn"
                  onClick={() => {
                    setStatusFilter('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              <div className="empty-state">
                <FaClipboardList size={48} />
                <h3>No orders yet</h3>
                <p>Orders will appear here when customers start placing them</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
            Previous
          </button>
          
          <div className="pagination-info">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
