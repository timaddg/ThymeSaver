import React, { useState } from 'react';
import './AuthModal.css';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onAuth: (data: { username: string; email?: string; password: string }, mode: 'login' | 'signup') => Promise<void>;
}

const AuthModal: React.FC<AuthModalProps> = ({ mode: initialMode, onClose, onAuth }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onAuth({ username, email, password }, mode);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-backdrop">
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        <h2>{mode === 'signup' ? 'Create your account' : 'Welcome back!'}</h2>
        <div className="auth-modal-subtext">
          {mode === 'signup'
            ? 'Sign up to save your favorite recipes, ingredients, and meal plans.'
            : 'Sign in to access your personalized cooking experience.'}
        </div>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' ? (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
          ) : null}
          {mode === 'login' || mode === 'signup' ? (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus={mode === 'login'}
            />
          ) : null}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="auth-modal-error">{error}</div>}
          <button type="submit" className="auth-modal-btn" disabled={loading}>
            {loading ? (mode === 'signup' ? 'Signing Up...' : 'Logging In...') : (mode === 'signup' ? 'Sign Up' : 'Log In')}
          </button>
        </form>
        <div className="auth-modal-switch">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')}>Login</button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setMode('signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 