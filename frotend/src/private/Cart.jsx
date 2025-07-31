import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../services/cartApi';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCartItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(cartItemId, newQuantity);
      // Update local state
      const updatedCart = cartItems.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      // Update local state
      const updatedCart = cartItems.filter(item => item.id !== cartItemId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.Product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.13; // 13% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Here you would typically redirect to a checkout page
    // For now, we'll just show an alert
    alert('Proceeding to checkout...');
  };

  const continueShopping = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="loading-spinner-container">
            <div className="spinner"></div>
            <p>Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
              <div className="empty-cart-message">
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <button className="continue-shopping-btn" onClick={continueShopping}>
                  <FaArrowLeft /> Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img src={`/uploads/${item.Product.image}`} alt={item.Product.name} />
                      </div>
                      
                      <div className="item-details">
                        <h3>{item.Product.name}</h3>
                        <p className="item-description">{item.Product.description}</p>
                        <div className="item-variants">
                          {item.size && <span className="variant">Size: {item.size}</span>}
                          {item.color && <span className="variant">Color: {item.color}</span>}
                        </div>
                      </div>

                      <div className="item-price">
                        ${(item.Product.price * item.quantity).toFixed(2)}
                      </div>

                      <div className="item-quantity">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-actions">
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary">
                  <h3>Order Summary</h3>
                  
                  <div className="summary-row">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Tax (13%)</span>
                    <span>${calculateTax().toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>

                  <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>

                  <button 
                    className="continue-shopping-btn"
                    onClick={continueShopping}
                  >
                    <FaArrowLeft /> Continue Shopping
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

export default Cart; 