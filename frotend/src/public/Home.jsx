import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaStar, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import './Homepage.css';

import womensImage from '../assets/womens.png';
import kidsImage from '../assets/kids.png';
import homeLinensImage from '../assets/homelines.png';
import mainphoto from '../assets/mainphoto.png';
import nugaImage from '../assets/nuga.png';
import artisanImage from '../assets/model.png';
import handblockImage from '../assets/handblock.png';

function Homepage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const featuredProducts = [
    { id: 1, name: "Premium Cotton Dress", price: 299, image: womensImage, category: "women", rating: 4.8 },
    { id: 2, name: "Kids Cotton Set", price: 149, image: kidsImage, category: "kids", rating: 4.9 },
    { id: 3, name: "Luxury Bed Sheets", price: 199, image: homeLinensImage, category: "home", rating: 4.7 }
  ];

  const testimonials = [
    { name: "Sarah Johnson", text: "The quality of cotton is amazing! So soft and comfortable.", rating: 5 },
    { name: "Mike Chen", text: "Best purchase ever. The fabric feels premium and lasts long.", rating: 5 },
    { name: "Emily Davis", text: "Love the sustainable approach and the beautiful designs.", rating: 4 }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading CottonCo...</p>
        </div>
      )}
      
      <div className={`homepage-container ${isLoading ? 'hidden' : 'visible'}`}>
        {/* Hero Section with Large Banner */}
        <section className="hero-banner">
          <div className="hero-image-container">
            <img src={mainphoto} alt="Cotton comfort lifestyle" className="hero-bg-image" />
            <div className="hero-overlay">
              <div className="hero-content-wrapper">
                <h1 className="hero-main-title">Feel the comfort of Cotton</h1>
                <p className="hero-main-subtitle">100% Cotton, Crafted in Nepal</p>
                <button className="hero-shop-btn" onClick={() => handleNavigation('/products')}>
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="container">
            <h2 className="section-title">Crafted with Love</h2>
            <p className="about-text">
              At CottonCo, we believe in the beauty of simplicity and the strength of natural fibers.
              Every piece we create is crafted from 100% pure cotton, thoughtfully sourced and lovingly 
              made in Nepal. Whether you're dressing for a quiet morning or a festive gathering, we're 
              here to wrap you in softness, style, and a story that's truly Nepali.
            </p>
          </div>
        </section>

        {/* Featured Products */}
        <section className="featured-products">
          <div className="container">
            <h2 className="section-title">Featured Products</h2>
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card-home">
                  <div className="product-image-wrapper">
                    <img 
                      src={`http://localhost:3000/uploads/${product.image}`} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/src/assets/logo.png';
                      }}
                    />
                    <div className="product-overlay">
                      <button className="add-to-cart-btn">
                        <FaShoppingCart /> Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < product.rating ? 'star filled' : 'star'} />
                      ))}
                      <span>({product.rating})</span>
                    </div>
                    <p className="product-price">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="categories-section">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
              <div className="category-card" onClick={() => handleNavigation('/products?category=women')}>
                <div className="category-image">
                  <img src={womensImage} alt="Women's Collection" />
                  <div className="category-overlay">
                    <h3>Women's Collection</h3>
                    <p>Elegant & Comfortable</p>
                    <button className="shop-category-btn">Shop Now</button>
                  </div>
                </div>
              </div>
              
              <div className="category-card" onClick={() => handleNavigation('/products?category=kids')}>
                <div className="category-image">
                  <img src={kidsImage} alt="Kids Collection" />
                  <div className="category-overlay">
                    <h3>Kids Collection</h3>
                    <p>Soft & Playful</p>
                    <button className="shop-category-btn">Shop Now</button>
                  </div>
                </div>
              </div>
              
              <div className="category-card" onClick={() => handleNavigation('/products?category=home-linens')}>
                <div className="category-image">
                  <img src={homeLinensImage} alt="Home Linens" />
                  <div className="category-overlay">
                    <h3>Home Linens</h3>
                    <p>Cozy & Luxurious</p>
                    <button className="shop-category-btn">Shop Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nugaa by Cotton Co. Section */}
        <section className="nugaa-section">
          <div className="nugaa-container">
            <div className="nugaa-image-wrapper">
              <img src={artisanImage} alt="Nugaa Collection" className="nugaa-image" />
              <div className="nugaa-overlay">
                <div className="nugaa-content">
                  <h2 className="nugaa-title">Nugaa</h2>
                  <h3 className="nugaa-subtitle">by Cotton Co.</h3>
                  <p className="nugaa-description">Coming soon...</p>
                </div>
              </div>
            </div>
            <div className="nugaa-side-element">
              <div className="heart-element">
                <FaHeart />
              </div>
            </div>
          </div>
        </section>

        {/* The People Behind the Prints */}
        <section className="artisan-section">
          <div className="artisan-container">
            <div className="artisan-image-wrapper">
              <img src={handblockImage} alt="Artisan hands creating prints" className="artisan-image" />
              <div className="artisan-overlay">
                <button className="artisan-btn" onClick={() => handleNavigation('/aboutus')}>
                  The people Behind the prints
                  <div className="btn-learn-more">Learn More</div>
                </button>
              </div>
            </div>
          </div>
        </section>


      </div>
    </>
  );
}

export default Homepage;
