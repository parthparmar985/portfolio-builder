import React from 'react';
import './PageStyles.css';

const ContactUs = () => {
  return (
    <div className="page-wrapper">
      <div className="glass-card content-section text-center max-w-2xl mx-auto">
        <h1 className="gradient-text gradient-secondary text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="subtitle text-muted mb-8">
          Have a question or want to work together? Leave us a message!
        </p>
        
        <form className="contact-form glass-form text-left" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group mb-4">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="John Doe" required />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="john@example.com" required />
          </div>
          <div className="form-group mb-6">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" placeholder="How can we help you?" required></textarea>
          </div>
          <button type="submit" className="btn btn-primary btn-full hover-lift">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
