import React from 'react';
import './ContactUs.css';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import csimage from '../assets/csimage.jpeg';

function ContactUs() {

  return (
    <div className="mainbody">
      <div className="major">
        <div className="first">
          <p className="subtitle">How can we help you?</p>
          <h1>Contact Us</h1>
          <p className="description">
            We are here to help and answer any question you might have. 
            We look forward to hearing from you.
          </p>
        </div>
        <div className="contact-image">
          <img src={csimage} alt="Customer Service Representative" />
        </div>
      </div>

      <div className="mid">
        <h2 className="contact-info-title">Get In Touch</h2>
        <div className="contact-methods">
          <div className="middle">
            <FaMapMarkerAlt style={{fontSize:"30px", color:"blueviolet"}} />
            <p>New Baneshwor, Kathmandu, Nepal</p>
          </div>

          <div className="middle1">
            <FaPhone style={{fontSize:"30px", color:"blueviolet"}} />
            <p>+977-98-12345678</p>
          </div>
          
          <div className="middle2">
            <FaEnvelope style={{fontSize:"30px", color:"blueviolet"}} />
            <p>info@cottonco.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;