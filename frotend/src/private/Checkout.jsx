import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCreditCard, 
  FaLock, 
  FaArrowLeft,
  FaCheckCircle,
  FaShieldAlt,
  FaGift
} from 'react-icons/fa';
import { getCart, clearCart } from '../services/cartApi';
import { createOrder } from '../services/orderApi';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm({
    mode: 'onChange'
  });

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      const items = response.data.data || [];
      
      if (items.length === 0) {
        navigate('/cart');
        return;
      }
      
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.Product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.13; // 13% tax
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 100 ? 0 : 15.99; // Free shipping over $100
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const onSubmit = async (data) => {
    setProcessing(true);
    
    try {
      // Check if user is authenticated
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      const user = userData ? JSON.parse(userData) : null;
      
      // Create order object
      const orderData = {
        customerInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone
        },
        shippingAddress: {
          address: data.shippingAddress,
          city: data.shippingCity,
          state: data.shippingState,
          zipCode: data.shippingZip,
          country: data.shippingCountry
        },
        billingAddress: sameAsShipping ? {
          address: data.shippingAddress,
          city: data.shippingCity,
          state: data.shippingState,
          zipCode: data.shippingZip,
          country: data.shippingCountry
        } : {
          address: data.billingAddress,
          city: data.billingCity,
          state: data.billingState,
          zipCode: data.billingZip,
          country: data.billingCountry
        },
        paymentMethod: paymentMethod,
        items: cartItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal()
      };

      console.log('Order Data:', orderData);
      console.log('User authenticated:', !!user);
      console.log('Token available:', !!token);
      
      // Create order in database
      const response = await createOrder(orderData);
      
      if (response.data.success) {
        // Clear cart after successful order
        await clearCart();
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-toast';
        successDiv.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: #28a745; font-size: 20px;">✓</span>
            Order placed successfully! Order #${response.data.data.orderNumber}
          </div>
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
          
          // Set a flag to refresh orders when user visits profile
          localStorage.setItem('refreshOrders', 'true');
          
          // Refresh user orders if the refresh function is available
          if (window.refreshUserOrders) {
            window.refreshUserOrders();
          }
          
          navigate('/order-confirmation', { 
            state: { 
              orderData: { 
                ...orderData, 
                orderNumber: response.data.data.orderNumber,
                orderId: response.data.data.order.id
              }
            } 
          });
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-toast';
      errorDiv.textContent = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 3000);
    } finally {
      setProcessing(false);
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        return ['shippingAddress', 'shippingCity', 'shippingState', 'shippingZip', 'shippingCountry'];
      case 3:
        return sameAsShipping ? [] : ['billingAddress', 'billingCity', 'billingState', 'billingZip', 'billingCountry'];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p>Loading checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button className="back-btn" onClick={() => navigate('/cart')}>
            <FaArrowLeft /> Back to Cart
          </button>
          <h1>Secure Checkout</h1>
          <p>Complete your purchase safely and securely</p>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <span>Information</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <span>Shipping</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-number">3</div>
              <span>Payment</span>
            </div>
            <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <span>Review</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
          <div className="checkout-content">
            {/* Left Column - Forms */}
            <div className="checkout-forms">
              
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div className="form-section">
                  <div className="section-header">
                    <h2><FaUser /> Customer Information</h2>
                    <p>We'll use this information to contact you about your order</p>
                  </div>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>First Name *</label>
                      <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          className={`checkout-input ${errors.firstName ? 'error' : ''}`}
                          placeholder="Enter first name"
                          {...register('firstName', { 
                            required: 'First name is required',
                            minLength: { value: 2, message: 'First name must be at least 2 characters' }
                          })}
                        />
                      </div>
                      {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>Last Name *</label>
                      <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          className={`checkout-input ${errors.lastName ? 'error' : ''}`}
                          placeholder="Enter last name"
                          {...register('lastName', { 
                            required: 'Last name is required',
                            minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                          })}
                        />
                      </div>
                      {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>Email Address *</label>
                      <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input
                          type="email"
                          className={`checkout-input ${errors.email ? 'error' : ''}`}
                          placeholder="Enter email address"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                        />
                      </div>
                      {errors.email && <span className="error-message">{errors.email.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>Phone Number *</label>
                      <div className="input-wrapper">
                        <FaPhone className="input-icon" />
                        <input
                          type="tel"
                          className={`checkout-input ${errors.phone ? 'error' : ''}`}
                          placeholder="Enter phone number"
                          {...register('phone', { 
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9+\-\s()]+$/,
                              message: 'Invalid phone number'
                            }
                          })}
                        />
                      </div>
                      {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                    </div>
                  </div>
                  
                  <div className="step-buttons">
                    <button type="button" className="next-btn" onClick={nextStep}>
                      Continue to Shipping <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div className="form-section">
                  <div className="section-header">
                    <h2><FaMapMarkerAlt /> Shipping Address</h2>
                    <p>Where should we deliver your order?</p>
                  </div>
                  <div className="form-grid">
                    <div className="input-group full-width">
                      <label>Street Address *</label>
                      <div className="input-wrapper">
                        <FaMapMarkerAlt className="input-icon" />
                        <input
                          type="text"
                          className={`checkout-input ${errors.shippingAddress ? 'error' : ''}`}
                          placeholder="Enter street address"
                          {...register('shippingAddress', { required: 'Shipping address is required' })}
                        />
                      </div>
                      {errors.shippingAddress && <span className="error-message">{errors.shippingAddress.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>City *</label>
                      <input
                        type="text"
                        className={`checkout-input ${errors.shippingCity ? 'error' : ''}`}
                        placeholder="Enter city"
                        {...register('shippingCity', { required: 'City is required' })}
                      />
                      {errors.shippingCity && <span className="error-message">{errors.shippingCity.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>State/Province *</label>
                      <input
                        type="text"
                        className={`checkout-input ${errors.shippingState ? 'error' : ''}`}
                        placeholder="Enter state/province"
                        {...register('shippingState', { required: 'State/Province is required' })}
                      />
                      {errors.shippingState && <span className="error-message">{errors.shippingState.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>ZIP/Postal Code *</label>
                      <input
                        type="text"
                        className={`checkout-input ${errors.shippingZip ? 'error' : ''}`}
                        placeholder="Enter ZIP/postal code"
                        {...register('shippingZip', { required: 'ZIP/Postal code is required' })}
                      />
                      {errors.shippingZip && <span className="error-message">{errors.shippingZip.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>Country *</label>
                      <select
                        className={`checkout-input ${errors.shippingCountry ? 'error' : ''}`}
                        {...register('shippingCountry', { required: 'Country is required' })}
                      >
                        <option value="">Select Country</option>
                        <option value="NP">Nepal</option>
                        <option value="IN">India</option>
                        <option value="BD">Bangladesh</option>
                        <option value="LK">Sri Lanka</option>
                        <option value="BT">Bhutan</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                      {errors.shippingCountry && <span className="error-message">{errors.shippingCountry.message}</span>}
                    </div>
                  </div>
                  
                  <div className="step-buttons">
                    <button type="button" className="prev-btn" onClick={prevStep}>
                      <FaArrowLeft /> Back
                    </button>
                    <button type="button" className="next-btn" onClick={nextStep}>
                      Continue to Payment <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
                    </button>
                  </div>
                </div>
              )}
                      <input
                        type="text"
                        className={`checkout-input ${errors.lastName ? 'error' : ''}`}
                        placeholder="Enter last name"
                        {...register('lastName', { required: 'Last name is required' })}
                      />
                    </div>
                    {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
                  </div>

                  <div className="input-group full-width">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        className={`checkout-input ${errors.email ? 'error' : ''}`}
                        placeholder="Enter email address"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>

                  <div className="input-group full-width">
                    <label>Phone Number</label>
                    <div className="input-wrapper">
                      <FaPhone className="input-icon" />
                      <input
                        type="tel"
                        className={`checkout-input ${errors.phone ? 'error' : ''}`}
                        placeholder="Enter phone number"
                        {...register('phone', { required: 'Phone number is required' })}
                      />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone.message}</span>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="form-section">
                <h2>Shipping Address</h2>
                <div className="form-grid">
                  <div className="input-group full-width">
                    <label>Street Address</label>
                    <div className="input-wrapper">
                      <FaMapMarkerAlt className="input-icon" />
                      <input
                        type="text"
                        className={`checkout-input ${errors.shippingAddress ? 'error' : ''}`}
                        placeholder="Enter street address"
                        {...register('shippingAddress', { required: 'Address is required' })}
                      />
                    </div>
                    {errors.shippingAddress && <span className="error-message">{errors.shippingAddress.message}</span>}
                  </div>

                  <div className="input-group">
                    <label>City</label>
                    <input
                      type="text"
                      className={`checkout-input ${errors.shippingCity ? 'error' : ''}`}
                      placeholder="Enter city"
                      {...register('shippingCity', { required: 'City is required' })}
                    />
                    {errors.shippingCity && <span className="error-message">{errors.shippingCity.message}</span>}
                  </div>

                  <div className="input-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      className={`checkout-input ${errors.shippingState ? 'error' : ''}`}
                      placeholder="Enter state"
                      {...register('shippingState', { required: 'State is required' })}
                    />
                    {errors.shippingState && <span className="error-message">{errors.shippingState.message}</span>}
                  </div>

                  <div className="input-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      className={`checkout-input ${errors.shippingZip ? 'error' : ''}`}
                      placeholder="Enter postal code"
                      {...register('shippingZip', { required: 'Postal code is required' })}
                    />
                    {errors.shippingZip && <span className="error-message">{errors.shippingZip.message}</span>}
                  </div>

                  <div className="input-group">
                    <label>Country</label>
                    <select
                      className={`checkout-input ${errors.shippingCountry ? 'error' : ''}`}
                      {...register('shippingCountry', { required: 'Country is required' })}
                    >
                      <option value="">Select Country</option>
                      <option value="NP">Nepal</option>
                      <option value="IN">India</option>
                      <option value="BD">Bangladesh</option>
                      <option value="LK">Sri Lanka</option>
                      <option value="BT">Bhutan</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                    {errors.shippingCountry && <span className="error-message">{errors.shippingCountry.message}</span>}
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="form-section">
                <div className="billing-header">
                  <h2>Billing Address</h2>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                    />
                    <span>Same as shipping address</span>
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="form-grid">
                    <div className="input-group full-width">
                      <label>Street Address</label>
                      <div className="input-wrapper">
                        <FaMapMarkerAlt className="input-icon" />
                        <input
                          type="text"
                          className={`checkout-input ${errors.billingAddress ? 'error' : ''}`}
                          placeholder="Enter street address"
                          {...register('billingAddress', { 
                            required: !sameAsShipping ? 'Billing address is required' : false 
                          })}
                        />
                      </div>
                      {errors.billingAddress && <span className="error-message">{errors.billingAddress.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>City</label>
                      <input
                        type="text"
                        className={`checkout-input ${errors.billingCity ? 'error' : ''}`}
                        placeholder="Enter city"
                        {...register('billingCity', { 
                          required: !sameAsShipping ? 'City is required' : false 
                        })}
                      />
                      {errors.billingCity && <span className="error-message">{errors.billingCity.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>State/Province</label>
                      <input
                        type="text"
                        className={`checkout-input ${errors.billingState ? 'error' : ''}`}
                        placeholder="Enter state"
                        {...register('billingState', { 
                          required: !sameAsShipping ? 'State is required' : false 
                        })}
                      />
                      {errors.billingState && <span className="error-message">{errors.billingState.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        className={`checkout-input ${errors.billingZip ? 'error' : ''}`}
                        placeholder="Enter postal code"
                        {...register('billingZip', { 
                          required: !sameAsShipping ? 'Postal code is required' : false 
                        })}
                      />
                      {errors.billingZip && <span className="error-message">{errors.billingZip.message}</span>}
                    </div>

                    <div className="input-group">
                      <label>Country</label>
                      <select
                        className={`checkout-input ${errors.billingCountry ? 'error' : ''}`}
                        {...register('billingCountry', { 
                          required: !sameAsShipping ? 'Country is required' : false 
                        })}
                      >
                        <option value="">Select Country</option>
                        <option value="NP">Nepal</option>
                        <option value="IN">India</option>
                        <option value="BD">Bangladesh</option>
                        <option value="LK">Sri Lanka</option>
                        <option value="BT">Bhutan</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                      {errors.billingCountry && <span className="error-message">{errors.billingCountry.message}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  <label className={`payment-option ${paymentMethod === 'esewa' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={paymentMethod === 'esewa'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <span style={{ color: '#60bb46', fontWeight: 'bold', fontSize: '16px' }}>eSewa</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'khalti' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      checked={paymentMethod === 'khalti'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <span style={{ color: '#5d2d91', fontWeight: 'bold', fontSize: '16px' }}>Khalti</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'imepay' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="imepay"
                      checked={paymentMethod === 'imepay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <span style={{ color: '#ed1c24', fontWeight: 'bold', fontSize: '16px' }}>IME Pay</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <span>Cash on Delivery</span>
                    </div>
                  </label>
                </div>

                {(paymentMethod === 'esewa' || paymentMethod === 'khalti' || paymentMethod === 'imepay') && (
                  <div className="digital-wallet-info">
                    <div className="wallet-notice">
                      <div className="notice-content">
                        <h4>Digital Wallet Payment</h4>
                        <p>You will be redirected to {
                          paymentMethod === 'esewa' ? 'eSewa' :
                          paymentMethod === 'khalti' ? 'Khalti' : 'IME Pay'
                        } to complete your payment securely.</p>
                        <div className="wallet-features">
                          <div className="feature">✓ Secure payment processing</div>
                          <div className="feature">✓ Instant payment confirmation</div>
                          <div className="feature">✓ No card details required</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-main-content">
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
                    </div>
                    <div className="item-price">
                      ${(item.Product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{calculateShipping() === 0 ? 'Free' : `$${calculateShipping().toFixed(2)}`}</span>
                </div>
                <div className="total-row">
                  <span>Tax</span>
                  <span>₹{calculateTax().toFixed(2)}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className={`checkout-btn ${processing ? 'processing' : ''}`}
                disabled={processing}
              >
                {processing ? (
                  <div className="processing-content">
                    <div className="loading-spinner"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <FaLock />
                    <span>Place Order - ₹{calculateTotal().toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="security-notice">
                <FaLock />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
  