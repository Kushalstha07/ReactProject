import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaChevronLeft, 
  FaEye, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaCalendarAlt,
  FaUser,
  FaBox,
  FaTruck,
  FaCheckCircle
} from 'react-icons/fa';
import { getOrderById, updateOrderStatus } from '../../services/adminApi';
import './OrdersManagement.css';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderById(orderId);
      setOrder(response.data.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrder({ ...order, status: newStatus });
      
      // Show success message
      const successDiv = document.createElement('div');
      successDiv.className = 'success-toast';
      successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="color: #28a745; font-size: 20px;">✓</span>
          Order status updated successfully!
        </div>
      `;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Failed to update order status:', error);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-toast';
      errorDiv.textContent = 'Failed to update order status. Please try again.';
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaBox />;
      case 'processing': return <FaBox />;
      case 'shipped': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      case 'cancelled': return <FaBox />;
      default: return <FaBox />;
    }
  };

  if (loading) {
    return (
      <div className="orders-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="orders-management">
        <div className="error-message">
          <p>{error || 'Order not found'}</p>
          <button onClick={() => navigate('/admin/orders')}>Back to Orders</button>
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
            onClick={() => navigate('/admin/orders')}
          >
            <FaChevronLeft />
            Back to Orders
          </button>
          <div className="header-info">
            <h1><FaEye /> Order Details</h1>
            <p>Order #{order.id} - {order.orderNumber}</p>
          </div>
        </div>
      </div>

      <div className="order-detail-container">
        {/* Order Status Section */}
        <div className="order-status-section-detail">
          <div className="status-info">
            <div className="status-icon">
              {getStatusIcon(order.status)}
            </div>
            <div className="status-text">
              <h3>Order Status</h3>
              <span className={getStatusBadge(order.status)}>
                {order.status}
              </span>
            </div>
          </div>
          
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="status-select"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Order Information Grid */}
        <div className="order-detail-grid">
          {/* Customer Information */}
          <div className="detail-card">
            <h3><FaUser /> Customer Information</h3>
            <div className="detail-content">
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">
                  {order.User?.name || 
                   `${order.customerFirstName} ${order.customerLastName}` || 
                   'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">
                  {order.User?.email || order.customerEmail || 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span className="value">{order.customerPhone || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Order Date:</span>
                <span className="value">
                  <FaCalendarAlt /> {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="detail-card">
            <h3><FaMapMarkerAlt /> Shipping Information</h3>
            <div className="detail-content">
              <div className="detail-row">
                <span className="label">Address:</span>
                <span className="value">
                  {order.shippingAddress}, {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Country:</span>
                <span className="value">{order.shippingCountry}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="detail-card">
            <h3><FaCreditCard /> Payment Information</h3>
            <div className="detail-content">
              <div className="detail-row">
                <span className="label">Payment Method:</span>
                <span className="value">{order.paymentMethod}</span>
              </div>
              <div className="detail-row">
                <span className="label">Payment Status:</span>
                <span className="value">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="detail-card">
            <h3>Order Summary</h3>
            <div className="detail-content">
              <div className="detail-row">
                <span className="label">Subtotal:</span>
                <span className="value">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Tax:</span>
                <span className="value">{formatCurrency(order.tax)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Shipping:</span>
                <span className="value">{formatCurrency(order.shipping)}</span>
              </div>
              <div className="detail-row total">
                <span className="label">Total:</span>
                <span className="value">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.OrderItems && order.OrderItems.length > 0 && (
          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.OrderItems.map((item, index) => (
                <div key={index} className="item-card">
                  <div className="item-image">
                    <img 
                      src={`http://localhost:3000/uploads/${item.Product?.image}`} 
                      alt={item.Product?.name}
                      onError={(e) => {
                        e.target.src = '/src/assets/logo.png';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.Product?.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {formatCurrency(item.price)}</p>
                    {item.size && <p>Size: {item.size}</p>}
                    {item.color && <p>Color: {item.color}</p>}
                  </div>
                  <div className="item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 