import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import facebookIcon from '../assets/facebook.png';
import instagramIcon from '../assets/insta.png';
import tiktokIcon from '../assets/tiktok.png';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logo} alt="CottonCo" className="footer-logo" />
            <p>Crafting comfort with 100% pure cotton, made in Nepal with love.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><button onClick={() => handleNavigation('/aboutus')}>About Us</button></li>
                <li><button onClick={() => handleNavigation('/products')}>Products</button></li>
                <li><button onClick={() => handleNavigation('/contactus')}>Contact</button></li>
                <li><button onClick={() => handleNavigation('/support')}>Support</button></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Categories</h4>
              <ul>
                <li><button onClick={() => handleNavigation('/products?category=women')}>Women</button></li>
                <li><button onClick={() => handleNavigation('/products?category=kids')}>Kids</button></li>
                <li><button onClick={() => handleNavigation('/products?category=home-linens')}>Home Linens</button></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <img src={facebookIcon} alt="Facebook" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <img src={instagramIcon} alt="Instagram" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                  <img src={tiktokIcon} alt="TikTok" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 CottonCo. All rights reserved. Made with ❤️ in Nepal.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
