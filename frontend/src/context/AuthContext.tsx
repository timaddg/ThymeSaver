import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { setLogoutHandler } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inactivity timeout in milliseconds (1 hour)
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    if (user && token) {
      inactivityTimerRef.current = setTimeout(() => {
        console.log('AuthContext: User inactive for 1 hour, logging out');
        logout();
      }, INACTIVITY_TIMEOUT);
    }
  };

  const updateActivity = () => {
    lastActivityRef.current = Date.now();
    resetInactivityTimer();
  };

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('last_activity', Date.now().toString());
    lastActivityRef.current = Date.now();
    resetInactivityTimer();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('last_activity');
    window.location.href = '/';
  };

  // Set up activity listeners
  useEffect(() => {
    if (!user || !token) return;

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, token]);

  // Restore auth state from localStorage on mount and validate token
  React.useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    const lastActivity = localStorage.getItem('last_activity');
    
    console.log('AuthContext: Checking stored token:', !!storedToken);
    
    if (storedToken && storedUser) {
      // Check if user has been inactive for more than 1 hour
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
        if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
          console.log('AuthContext: User inactive for more than 1 hour, logging out');
          logout();
          return;
        }
      }
      
      // Validate token with server
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(response => {
        console.log('AuthContext: Token validation response status:', response.status);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Token invalid');
        }
      })
      .then(data => {
        console.log('AuthContext: Token valid, user logged in:', data.user.username);
        setToken(storedToken);
        setUser(data.user);
        lastActivityRef.current = lastActivity ? parseInt(lastActivity) : Date.now();
        resetInactivityTimer();
      })
      .catch((error) => {
        console.log('AuthContext: Token invalid, logging out:', error.message);
        // Token is invalid, clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('last_activity');
        setToken(null);
        setUser(null);
      });
    }
    
    // Register logout handler for 401 auto-logout
    setLogoutHandler(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateActivity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 