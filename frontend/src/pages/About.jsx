import React from 'react';
import './PageStyles.css';

const About = () => {
  return (
    <div className="page-wrapper">
      <div className="glass-card about-hero text-center content-section">
        <h1 className="gradient-text gradient-primary text-4xl font-bold mb-4">About PortfolioBuilder</h1>
        <p className="subtitle text-lg text-muted max-w-2xl mx-auto">
          We believe that everybody should have a stunning professional presence online. 
          Our tool simplifies the portfolio creation process without sacrificing quality.
        </p>
      </div>

      <div className="grid grid-cols-2 mt-8">
        <div className="glass-card content-card interactive-card">
          <div className="icon-wrapper">🚀</div>
          <h3 className="section-title">Our Mission</h3>
          <p className="text-muted">
            To empower developers, designers, and professionals to build a beautiful 
            portfolio in minutes, letting their work speak for itself.
          </p>
        </div>
        <div className="glass-card content-card interactive-card">
          <div className="icon-wrapper">💎</div>
          <h3 className="section-title">Premium Quality</h3>
          <p className="text-muted">
            With modern aesthetics, dynamic designs, and responsive layouts, we ensure your 
            first impression is always perfect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
