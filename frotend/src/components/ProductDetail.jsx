import React, { useState } from 'react';
import { FaStar, FaHeart, FaTimes, FaShoppingCart } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  
  // Mock additional images for gallery (in real app, this would come from backend)
  const productImages = [
    `http://localhost:3000/uploads/${product.image}`,
    `http://localhost:3000/uploads/${product.image}`, // Placeholder - replace with actual gallery images
    `http://localhost:3000/uploads/${product.image}`,
  ];

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity,
      color: product.color || 'Default'
    };
    onAddToCart(cartItem);
  };

  const handleAddToFavorites = () => {
    // Add to favorites logic here
    console.log('Added to favorites:', product.name);
  };

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="product-detail-content">
          {/* Left Side - Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={productImages[selectedImageIndex]} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/src/assets/logo.png';
                }}
              />
            </div>
            <div className="image-thumbnails">
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImageIndex === index ? 'active' : ''}
                  onClick={() => setSelectedImageIndex(index)}
                  onError={(e) => {
                    e.target.src = '/src/assets/logo.png';
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="product-info">
            <div className="product-category">Kurtis</div>
            <h1 className="product-title">{product.name}</h1>
            <div className="product-code">C1006</div>
            
            <div className="product-price">
              <span className="current-price">Nrs. {product.price}</span>
            </div>

            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < 4 ? 'star filled' : 'star'} 
                />
              ))}
              <span className="rating-count">(4.0)</span>
            </div>

            {/* Size Selection */}
            <div className="size-section">
              <h3>Size</h3>
              <div className="size-options">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button className="size-chart-btn">Size Chart</button>
            </div>

            {/* Quantity */}
            <div className="quantity-section">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FaShoppingCart />
                Add to Cart
              </button>
              <button 
                className="add-to-favorites-btn"
                onClick={handleAddToFavorites}
              >
                <FaHeart />
                Add to Favourites
              </button>
            </div>

            {/* Product Details */}
            <div className="product-details">
              <div className="detail-item">
                <button className="detail-toggle">Details and Fit</button>
              </div>
              <div className="detail-item">
                <button className="detail-toggle">Material</button>
              </div>
              <div className="detail-item">
                <button className="detail-toggle">Care Guide</button>
              </div>
              <div className="detail-item">
                <button className="detail-toggle">Shipping and Payment</button>
              </div>
              <div className="detail-item">
                <button className="detail-toggle">Refund Policy</button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="similar-products">
          <h2>Shop Similar Styles</h2>
          <div className="similar-products-grid">
            {/* This would be populated with similar products */}
            <div className="similar-product-placeholder">
              <div className="placeholder-image"></div>
            </div>
            <div className="similar-product-placeholder">
              <div className="placeholder-image"></div>
            </div>
            <div className="similar-product-placeholder">
              <div className="placeholder-image"></div>
            </div>
            <div className="similar-product-placeholder">
              <div className="placeholder-image"></div>
            </div>
            <div className="similar-product-placeholder">
              <div className="placeholder-image"></div>
            </div>
            <div className="similar-product-placeholder">
              <div className="placeholder-image"></div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bottom-banner">
          <div className="banner-content">
            <h3>Summer Collection Live Now</h3>
            <button className="shop-banner-btn">Shop</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
