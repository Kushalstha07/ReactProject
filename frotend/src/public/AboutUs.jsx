import React from 'react';
import './AboutUs.css';
import asimage from '../assets/asimage.jpeg';

function AboutUs() {

  return (
    <div className='mainbody'>
      <div className='central'>
          <div className="p1">
            <p className="para1">Your</p>
            <p style={{fontFamily: 'Freestyle Script', fontSize: '50px', paddingLeft: '4%', color:'black'}}>
               Boutique</p>
            <p className="paragraph">Welcome to CottonCo, where fashion meets self-expression. We're passionate about 
              curating timeless yet modern clothing that helps you look and feel your best. From elegant everyday
              wear to standout pieces for special occasions, our collections are handpicked to suit your unique 
                style. We believe in quality, ethical fashion, and confidence through personal style. Whether you're
                refreshing your wardrobe or searching for that perfect piece, we're here to make your style journey effortless
                and inspiring.
              </p>
            </div>
            <img src={asimage} alt="CottonCo Boutique Interior" style={{borderRadius: '50px', width: "550px"}} />
      </div>
    </div>
  );
}

export default AboutUs;