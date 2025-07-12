import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">ThymeSaver</span>
      </div>
      <ul className="navbar-menu">
        <li>Home</li>
        <li>Meals</li>
        <li>Grocery</li>
      </ul>
      <div className="navbar-actions">
        <button className="btn-outline">Sign Up</button>
        <button className="btn-solid">Login</button>
      </div>
    </nav>
  );
};

export default Navbar; 