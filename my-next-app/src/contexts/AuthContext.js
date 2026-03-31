'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    // Clear any old localStorage data to ensure we use backend auth
    localStorage.removeItem('cryptonexus_user');
    localStorage.removeItem('cryptonexus_users');
    setIsLoading(false);
  }, []);

  // Don't save user to localStorage for backend auth
  useEffect(() => {
    // We're using backend auth now, no localStorage needed
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      console.log('Backend login response:', data); // Debug log
      
      if (response.ok && data.token && data.user) {
        const user = {
          ...data.user,
          token: data.token
        };
        console.log('User object after processing:', user); // Debug log
        setUser(user);
        return { success: true, user };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      console.log('Backend signup response:', data); // Debug log
      
      if (response.ok && data.user) {
        console.log('User object from signup:', data.user); // Debug log
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    // Don't remove from users list, just clear current session
  };

  const updateUser = (updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    // No localStorage updates needed for backend auth
  };

  const getRemainingTrialDays = () => {
    if (!user || !user.trialExpiresAt) return 0;
    
    const now = new Date();
    const expiryDate = new Date(user.trialExpiresAt);
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const isTrialExpired = () => {
    if (!user || !user.trialExpiresAt) return true;
    return new Date() > new Date(user.trialExpiresAt);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
    getRemainingTrialDays,
    isTrialExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
