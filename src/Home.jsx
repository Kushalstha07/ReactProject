import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

import logo from './images/logo.png';
import womensImage from './images/womens.png';
import kidsImage from './images/kids.png';
import homeLinensImage from './images/homelines.png';
import facebookIcon from './images/facebook.png';
import instagramIcon from './images/insta.png';
import tiktokIcon from './images/tiktok.png';

function Homepage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="homepage-mainbody">
        <div className="homepage-header">
          <img src={logo} className="homepage-resize-image" alt="Logo" />
          <div className="homepage-navigation">
            <button className="homepage-nav" onClick={() => handleNavigation('/catalogue')}>Catalogue</button>
            <button className="homepage-nav" onClick={() => handleNavigation('/shop')}>Shop</button>
            <button className="homepage-nav" onClick={() => handleNavigation('/cart')}>Cart</button>
            <button className="homepage-nav" onClick={() => handleNavigation('/support')}>Support</button>
            <button className="homepage-signup" onClick={() => handleNavigation('/login')}>Signup</button>
          </div>
        </div>

        <div className="homepage-main-photo">
          <p className="homepage-L1">Feel the comfort of Cotton</p>
          <p className="homepage-L2">100% cotton, Crafted in Nepal</p>
        </div>

        <div className="homepage-cont">
          <p>
            At CottonCo, we believe in the beauty of simplicity and the strength of natural fibers.
            Every piece we create is crafted from 100% pure cotton, thoughtfully sourced and lovingly made in Nepal.
            Whether you're dressing for a quiet morning or a festive gathering, we’re here to wrap you in softness,
            style, and a story that’s truly Nepali.
          </p>
        </div>

        <div className="homepage-section">
          <button onClick={() => handleNavigation('/women')}>
            <img src={womensImage} width="100%" alt="Women" />
          </button>
          <button onClick={() => handleNavigation('/kids')}>
            <img src={kidsImage} width="100%" alt="Kids" />
          </button>
          <button onClick={() => handleNavigation('/homelinens')}>
            <img src={homeLinensImage} width="100%" alt="Home Linens" />
          </button>
        </div>

        <div className="homepage-buttons">
          <a href="#">Women</a>
          <a href="#">Kids</a>
          <a href="#">Home Linens</a>
        </div>

        <div className="homepage-nuga">
          <p>Nugaa by Cotton Co.</p>
        </div>

        <div className="homepage-thirdimage">
          <button className="homepage-L4" onClick={() => handleNavigation('/about')}>
            The people Behind the prints
          </button>
        </div>
      </div>

      <div className="homepage-footer">
        <img src={logo} width="80px" height="80px" alt="Footer Logo" />
        <div className="homepage-conclusion">
          <a href="#">About us</a>
          <a href="#">Careers</a>
          <a href="#">Contact us</a>
          <span>Follow us:</span>
        </div>
        <div className="homepage-media">
          <a href="https://facebook.com"><img src={facebookIcon} alt="Facebook" /></a>
          <a href="https://instagram.com"><img src={instagramIcon} alt="Instagram" /></a>
          <a href="https://tiktok.com"><img src={tiktokIcon} alt="TikTok" /></a>
        </div>
      </div>
    </>
  );
}

export default Homepage;
