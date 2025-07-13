import React, { useState } from 'react';
import './Navbar.css';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState<null | 'login' | 'signup'>(null);

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
        <div className="navbar-logo">
          <span className="logo-text">ThymeSaver</span>
        </div>
        <ul className="navbar-menu">
          <li>Home</li>
          <li>Meals</li>
          <li>Grocery</li>
        </ul>
        <div className="navbar-actions">
          {user ? (
            <>
              <span style={{ marginRight: '1rem', fontWeight: 600, color: '#2ecc40' }}>Hi, {user.username}</span>
              <button className="btn-outline" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => setShowAuthModal('signup')}>Sign Up</button>
              <button className="btn-solid" onClick={() => setShowAuthModal('login')}>Login</button>
            </>
          )}
        </div>
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