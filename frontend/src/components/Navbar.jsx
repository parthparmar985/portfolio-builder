import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-nav">
      <div className="nav-container">
        <Link to="/" className="brand">
          <span className="brand-icon">✨</span> PortfolioBuilder
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-greeting">Hi, {user.name}</span>
              {user.role === 'admin' ? (
                <Link to="/admin" className="nav-link dashboard-link">Dashboard</Link>
              ) : (
                <Link to="/dashboard" className="nav-link dashboard-link">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="btn-outline logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ marginLeft: '1rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
