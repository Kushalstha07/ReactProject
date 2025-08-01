import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendar, FaCreditCard, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import { getOrderByNumber } from '../services/orderApi';
import './OrderDetail.css';

function OrderDetail() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await getOrderByNumber(orderNumber);
      
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>{error || 'Order not found'}</h2>
            <button onClick={() => navigate('/profile')} className="back-btn">
              <FaArrowLeft /> Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <div className="order-detail-header">
          <button onClick={() => navigate('/profile')} className="back-btn">
            <FaArrowLeft /> Back to Orders
          </button>
          <div className="order-title">
            <h1>Order Details</h1>
            <div className="order-meta">
              <span className="order-number">#{order.orderNumber}</span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="order-detail-content">
          <div className="order-info-grid">
            <div className="order-summary-card">
              <h3><FaCalendar /> Order Information</h3>
              <div className="info-item">
                <label>Order Date:</label>
                <span>{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <label>Payment Method:</label>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="info-item">
                <label>Payment Status:</label>
                <span className={`payment-status ${order.paymentStatus}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="shipping-info-card">
              <h3><FaTruck /> Shipping Information</h3>
              <div className="info-item">
                <label>Customer:</label>
                <span>{order.customerFirstName} {order.customerLastName}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{order.customerEmail}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{order.customerPhone}</span>
              </div>
              <div className="info-item">
                <label>Shipping Address:</label>
                <div className="address">
                  {order.shippingAddress}<br/>
                  {order.shippingCity}, {order.shippingState} {order.shippingZipCode}<br/>
                  {order.shippingCountry}
                </div>
              </div>
            </div>
          </div>

          <div className="order-items-card">
            <h3>Order Items</h3>
            <div className="items-list">
              {order.OrderItems && order.OrderItems.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div className="item-image">
                    <img 
                      src={item.Product?.image || '/api/placeholder/80/80'} 
                      alt={item.Product?.name || 'Product'}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/80/80';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.Product?.name || 'Product'}</h4>
                    <p>{item.Product?.description || ''}</p>
                    {item.size && <span className="item-variant">Size: {item.size}</span>}
                    {item.color && <span className="item-variant">Color: {item.color}</span>}
                  </div>
                  <div className="item-quantity">
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div className="item-price">
                    <span>Rs.{item.price.toFixed(2)}</span>
                  </div>
                  <div className="item-total">
                    <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-totals-card">
            <h3>Order Summary</h3>
            <div className="totals-breakdown">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>Rs.{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>Rs.{order.tax.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Rs.{order.shipping.toFixed(2)}</span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>Rs.{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
