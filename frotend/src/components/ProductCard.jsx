import React, { useState } from 'react';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.size || 'M');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity
    };
    onAddToCart(cartItem);
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        <img 
          src={`http://localhost:3000/uploads/${product.image}`} 
          alt={product.name} 
          className="product-image"
          onError={(e) => {
            e.target.src = '/src/assets/logo.png'; // Fallback image
          }}
        />
        <div className={`product-overlay ${isHovered ? 'active' : ''}`}>
          <button className="wishlist-btn">
            <FaHeart />
          </button>
          <button 
            className="quick-view-btn"
            onClick={() => onQuickView && onQuickView(product)}
          >
            Quick View
          </button>
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <span className="low-stock-badge">Only {product.stock} left!</span>
        )}
        {product.stock === 0 && (
          <span className="out-of-stock-badge">Out of Stock</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        


        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>

        {product.stock > 0 && (
          <div className="product-options">
            <div className="size-selector">
              <label>Size:</label>
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="quantity-selector">
              <label>Qty:</label>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button 
          className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <FaShoppingCart />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 