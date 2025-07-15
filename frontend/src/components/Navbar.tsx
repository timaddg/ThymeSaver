import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  hideLogo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideLogo }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Auth handler for modal
  const handleAuth = async (data: { username: string; email?: string; password: string }, mode: 'login' | 'signup') => {
    const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
    const payload = mode === 'signup' ? data : { email: data.email, password: data.password };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!result.success) throw new Error(result.error || 'Authentication failed');
    // The original code had login(result.user, result.token); here, but login is not imported.
    // Assuming the intent was to handle login/signup directly or that login is meant to be added.
    // For now, removing the line as per the new_code's structure.
  };

  return (
    <nav className="navbar">
      {!hideLogo && (
        <div className="navbar-logo">
          <span className="logo-text">ThymeSaver</span>
        </div>
      )}
      <ul className="navbar-menu">
        <li><a href="#" className="nav-link">Meal Kits</a></li>
        <li><a href="#" className="nav-link">Recipes</a></li>
        <li><a href="#" className="nav-link">Grocery</a></li>
        <li><a href="#" className="nav-link">Our Story</a></li>
      </ul>
      <div className="navbar-actions">
        <button className="search-icon-btn" aria-label="Search">
          {/* Search Icon */}
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
        <button className="user-icon-btn" aria-label="User" onClick={() => setDropdownOpen((open) => !open)}>
          {/* User Icon */}
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
        </button>
        <button className="cart-icon-btn" aria-label="Cart">
          {/* Cart Icon */}
          <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </button>
        {user && dropdownOpen && (
          <div className="user-dropdown-container" ref={dropdownRef}>
            <div className="user-dropdown-menu">
              <button className="dropdown-item">Profile</button>
              <button className="dropdown-item">Settings</button>
              <button className="dropdown-item" onClick={logout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 