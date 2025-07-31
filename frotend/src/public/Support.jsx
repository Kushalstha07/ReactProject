import React from 'react';
import './Support.css';

function Support() {

  return (
    <div className="mainbody">
      <div className="support-header">
        <h1>How Can We Help?</h1>
        <p>Find answers to frequently asked questions about our products and services.</p>
      </div>

      <div className="faq-container">
        <div className="faq-item">
          <div className="faq-question">Is shopping on your website secure?</div>
          <div className="faq-answer">
            Yes, our website uses SSL encryption and secure payment gateways to ensure your personal and 
            payment information is fully protected.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">Can I change or cancel my order after placing it?</div>
          <div className="faq-answer">
            We process orders quickly, but if you contact us within 2 hours of placing your order, we'll do our
            best to make changes or cancel it before it ships.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">Do your dresses shrink after washing?</div>
          <div className="faq-answer">
            No, our dresses are made from pre-shrunk or shrink-resistant fabrics. Please follow the
            care instructions to keep your garment looking its best.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">What sizes do you offer?</div>
          <div className="faq-answer">
            We offer a wide range of sizes from XS to 3XL. Please check our size guide on each product
            page to find your perfect fit.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">Do you offer alterations or custom sizing?</div>
          <div className="faq-answer">
            At the moment, we don't offer custom sizing. However, we provide detailed measurements 
            to help you find your best fit. For minor alterations, we suggest consulting a local tailor.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">Are your throw pillows machine washable?</div>
          <div className="faq-answer">
            Most of our pillow covers are removable and machine washable. Please check the product 
            care instructions for specific washing guidelines.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">How accurate are the colors in the product photos?</div>
          <div className="faq-answer">
            We do our best to ensure accurate color representation, but slight variations may occur
            due to screen settings. You can always request additional photos or video previews from our 
            customer service.
          </div>
        </div>
      </div>
          
      <div className="support-contact">
        <div className="contact-section">
          <h3>Still Need Help?</h3>
          <p>If you couldn't find the answer to your question, our customer service team is here to help!</p>
          <div className="contact-methods">
            <div className="contact-item">
              <strong>Email</strong>
              support@cottonco.com
            </div>
            <div className="contact-item">
              <strong>Phone</strong>
              +977-98-12345678
            </div>
            <div className="contact-item">
              <strong>Hours</strong>
              Monday - Friday, 9 AM - 6 PM (NPT)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;