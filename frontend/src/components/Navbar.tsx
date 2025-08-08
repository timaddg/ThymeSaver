import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  hideLogo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideLogo }) => {
  const { user, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState<null | 'login' | 'signup'>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);



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
    if (result.user && result.token) {
      login(result.user, result.token);
    }
  };

  return (
    <nav className="navbar">
      {!hideLogo && (
        <div className="navbar-logo">
          <span className="logo-text">ThymeSaver</span>
        </div>
      )}
      <ul className="navbar-menu">
        <li><Link to="/" className="nav-link">Home</Link></li>
        <li><Link to="/recipes" className="nav-link">Recipes</Link></li>
        <li><Link to="/grocery" className="nav-link">Grocery</Link></li>
        <li><Link to="/our-story" className="nav-link">Our Story</Link></li>
      </ul>
      <div className="navbar-actions">
        {!user ? (
          <>
            <button className="btn-outline" onClick={() => setShowAuthModal('signup')}>Sign Up</button>
            <button className="btn-solid" onClick={() => setShowAuthModal('login')}>Login</button>
          </>
        ) : (
          <>
            <button className="search-icon-btn" aria-label="Search">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button className="user-icon-btn" aria-label="User" onClick={() => setShowUserProfile(true)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
            </button>
          </>
        )}
      </div>
      {showAuthModal && (
        <AuthModal
          mode={showAuthModal}
          onClose={() => setShowAuthModal(null)}
          onAuth={handleAuth}
        />
      )}
      {showUserProfile && (
        <UserProfile
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </nav>
  );
};

export default Navbar; 