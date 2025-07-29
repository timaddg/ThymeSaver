import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  hideLogo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideLogo }) => {
  const { user, logout, login, updateActivity } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState<null | 'login' | 'signup'>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(3600); // 1 hour in seconds
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Session timer effect
  useEffect(() => {
    if (!user) {
      setSessionTimeLeft(3600);
      return;
    }

    const lastActivity = localStorage.getItem('last_activity');
    if (!lastActivity) return;

    const updateSessionTime = () => {
      const lastActivityTime = parseInt(lastActivity);
      const timeSinceLastActivity = Date.now() - lastActivityTime;
      const timeLeft = Math.max(0, 3600 - Math.floor(timeSinceLastActivity / 1000));
      setSessionTimeLeft(timeLeft);
    };

    updateSessionTime();
    const interval = setInterval(updateSessionTime, 1000);

    return () => clearInterval(interval);
  }, [user]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
        <li><a href="#" className="nav-link">Recipes</a></li>
        <li><Link to="/grocery" className="nav-link">Grocery</Link></li>
        <li><a href="#" className="nav-link">Our Story</a></li>
      </ul>
      <div className="navbar-actions">
        {!user ? (
          <>
            <button className="btn-outline" onClick={() => setShowAuthModal('signup')}>Sign Up</button>
            <button className="btn-solid" onClick={() => setShowAuthModal('login')}>Login</button>
          </>
        ) : (
          <>
            <div className="session-timer">
              <span className="session-time-label">Session:</span>
              <span className={`session-time ${sessionTimeLeft < 300 ? 'session-time-warning' : ''}`}>
                {formatTime(sessionTimeLeft)}
              </span>
            </div>
            <button className="search-icon-btn" aria-label="Search">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <button className="user-icon-btn" aria-label="User" onClick={() => setDropdownOpen((open) => !open)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
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
    </nav>
  );
};

export default Navbar; 