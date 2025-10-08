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
    try {
      const storedUser = localStorage.getItem('cryptonexus_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Check if trial has expired
        if (userData.trialExpiresAt && new Date() > new Date(userData.trialExpiresAt)) {
          // Trial expired, clear user data
          localStorage.removeItem('cryptonexus_user');
          setUser(null);
        } else {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      localStorage.removeItem('cryptonexus_user');
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('cryptonexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cryptonexus_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      // Simulate API call - in real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage (for returning users)
      const existingUsers = JSON.parse(localStorage.getItem('cryptonexus_users') || '[]');
      const existingUser = existingUsers.find(u => u.email === email);
      
      if (existingUser && existingUser.password === password) {
        setUser(existingUser);
        return { success: true, user: existingUser };
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { email, password, name } = userData;
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('cryptonexus_users') || '[]');
      if (existingUsers.find(u => u.email === email)) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user with 7-day trial
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7);
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In real app, this would be hashed
        createdAt: trialStartDate.toISOString(),
        trialStartedAt: trialStartDate.toISOString(),
        trialExpiresAt: trialEndDate.toISOString(),
        isTrialActive: true,
        isPremium: false,
        preferences: {
          darkMode: true,
          notifications: true,
          defaultAgent: 'Wallet Analyst'
        }
      };
      
      // Save to users list
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('cryptonexus_users', JSON.stringify(updatedUsers));
      
      // Set current user
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
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
    
    // Update in users list as well
    const existingUsers = JSON.parse(localStorage.getItem('cryptonexus_users') || '[]');
    const updatedUsers = existingUsers.map(u => 
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('cryptonexus_users', JSON.stringify(updatedUsers));
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
