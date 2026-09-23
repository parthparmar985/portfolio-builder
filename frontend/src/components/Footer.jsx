import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="brand">✨ PortfolioBuilder</Link>
          <p>Build, share, and launch your professional portfolio in minutes.</p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Platform</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PortfolioBuilder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
