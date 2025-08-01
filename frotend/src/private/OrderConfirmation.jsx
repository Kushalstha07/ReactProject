import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const generateOrderNumber = () => {
    return `CC${Date.now().toString().slice(-8)}`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const estimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now
    return deliveryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        {/* Order Details */}
        <div className="order-details">
          <div className="order-info-card">
            <h2>Order Information</h2>
            <div className="order-info-grid">
              <div className="info-item">
                <span className="label">Order Number:</span>
                <span className="value">{generateOrderNumber()}</span>
              </div>
              <div className="info-item">
                <span className="label">Order Date:</span>
                <span className="value">{formatDate(new Date())}</span>
              </div>
              <div className="info-item">
                <span className="label">Estimated Delivery:</span>
                <span className="value">{estimatedDelivery()}</span>
              </div>
              <div className="info-item">
                <span className="label">Payment Method:</span>
                <span className="value">
                  {orderData.paymentMethod === 'esewa' && 'eSewa'}
                  {orderData.paymentMethod === 'khalti' && 'Khalti'}
                  {orderData.paymentMethod === 'imepay' && 'IME Pay'}
                  {orderData.paymentMethod === 'cod' && 'Cash on Delivery'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="customer-info-card">
            <h2>Customer Information</h2>
            <div className="customer-details">
              <div className="detail-section">
                <h3>Contact Details</h3>
                <p>{orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</p>
                <p>{orderData.customerInfo.email}</p>
                <p>{orderData.customerInfo.phone}</p>
              </div>
              
              <div className="detail-section">
                <h3>Shipping Address</h3>
                <p>{orderData.shippingAddress.address}</p>
                <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}</p>
                <p>{orderData.shippingAddress.country}</p>
              </div>
              
              <div className="detail-section">
                <h3>Billing Address</h3>
                <p>{orderData.billingAddress.address}</p>
                <p>{orderData.billingAddress.city}, {orderData.billingAddress.state} {orderData.billingAddress.zipCode}</p>
                <p>{orderData.billingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-card">
            <h2>Order Items</h2>
            <div className="items-list">
              {orderData.items.map((item) => (
                <div key={item.id} className="confirmation-item">
                  <div className="item-image">
                    <img 
                      src={`http://localhost:3000/uploads/${item.Product.image}`} 
                      alt={item.Product.name}
                      onError={(e) => {
                        e.target.src = '/src/assets/logo.png';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.Product.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    {item.size && <p>Size: {item.size}</p>}
                    {item.color && <p>Color: {item.color}</p>}
                  </div>
                  <div className="item-price">
                    ${(item.Product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{orderData.shipping === 0 ? 'Free' : `$${orderData.shipping.toFixed(2)}`}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${orderData.tax.toFixed(2)}</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h2>What's Next?</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Order Confirmation</h3>
                <p>You'll receive an email confirmation shortly with your order details.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Processing</h3>
                <p>We'll prepare your order for shipment within 1-2 business days.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Shipping</h3>
                <p>You'll receive tracking information once your order ships.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Delivery</h3>
                <p>Your order will be delivered within 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn primary"
            onClick={() => navigate('/')}
          >
            <FaHome />
            <span>Continue Shopping</span>
          </button>
          <button 
            className="btn secondary"
            onClick={() => navigate('/products')}
          >
            <FaShoppingBag />
            <span>Browse Products</span>
          </button>
        </div>

        {/* Support Information */}
        <div className="support-info">
          <h3>Need Help?</h3>
          <p>If you have any questions about your order, please contact our customer support team.</p>
          <div className="support-contact">
            <span>Email: support@cottonco.com</span>
            <span>Phone: 1-800-COTTON</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
