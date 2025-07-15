import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  hideLogo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideLogo }) => {
  const { user, logout, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState<null | 'login' | 'signup'>(null);
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
    login(result.user, result.token);
  };

  return (
    <>
      <nav className="navbar">
        {!hideLogo && (
          <div className="navbar-logo">
            <span className="logo-text">ThymeSaver</span>
          </div>
        )}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <ul className="navbar-menu" style={{ margin: 0, marginRight: '1.5rem' }}>
              <li>
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li>Meals</li>
              <li>
                <Link to="/grocery" className="grocery-link">Grocery</Link>
              </li>
            </ul>
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button
                className="user-icon-btn"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="User menu"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Simple SVG person icon */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <button className="dropdown-item">Profile</button>
                  <button className="dropdown-item">Settings</button>
                  <button className="dropdown-item" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <ul className="navbar-menu">
              <li>Home</li>
              <li>Meals</li>
              <li>Grocery</li>
            </ul>
            <div className="navbar-actions">
              <button className="btn-outline" onClick={() => setShowAuthModal('signup')}>Sign Up</button>
              <button className="btn-solid" onClick={() => setShowAuthModal('login')}>Login</button>
            </div>
          </>
        )}
      </nav>
      {showAuthModal && (
        <AuthModal
          mode={showAuthModal}
          onClose={() => setShowAuthModal(null)}
          onAuth={handleAuth}
        />
      )}
    </>
  );
};

export default Navbar; 