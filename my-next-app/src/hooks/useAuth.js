
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

console.log('🟡 useAuth hook loaded');

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('cryptonexus_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      localStorage.removeItem('cryptonexus_user');
    }
    setIsLoading(false);
  }, []);

  const signup = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 201) {
        const userData = {
          ...response.data.user, // Use the user data from backend
          token: response.data.token // Make sure token is included
        };
        
        console.log('🔑 Saving signup user data with token:', userData);
        
        setUser(userData);
        localStorage.setItem('cryptonexus_user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      // Fallback for unexpected status codes
      return { success: false, error: 'Unexpected response from server' };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      if (response.status === 200) {
        const userData = {
          ...response.data.user, // Use backend user data
          token: response.data.token // Make sure token is included
        };
        
        console.log('🔑 Saving user data with token:', userData);
        
        setUser(userData);
        localStorage.setItem('cryptonexus_user', JSON.stringify(userData));
        
        const result = { success: true, user: userData };
        return result;
      }
      
      // Fallback for unexpected status codes
      return { success: false, error: 'Login failed. Please try again.' };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (redirectCallback) => {
    console.log('🚪 Logging out user...');
    setUser(null);
    localStorage.removeItem('cryptonexus_user');
    
    // Call redirect callback if provided
    if (redirectCallback) {
      redirectCallback();
    }
  };

  const getUserProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('cryptonexus_user'));
      const token = userData?.token;
      
      if (!token) {
        throw new Error('Please login again');
      }

      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        return { success: true, profile: response.data };
      }
    } catch (error) {
      // Handle token expiry gracefully
      if (error.response?.status === 401) {
        logout(); // Auto logout on token expiry
        return { success: false, error: 'Your session has expired. Please login again.' };
      }
      return { 
        success: false, 
        error: 'Unable to load profile. Please try again.' 
      };
    }
  };

  const updateUser = async (updateData) => {
    setIsLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('cryptonexus_user'));
      const token = userData?.token;
      
      console.log('🔑 Token from localStorage:', token ? 'Found' : 'Not found');
      console.log('📝 Update data:', updateData);
      
      if (!token) {
        throw new Error('Please login again');
      }

      console.log('🚀 Making API call to:', `${API_URL}/update`);
      
      const response = await axios.put(`${API_URL}/update`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📝 API Response:', response.status, response.data);

      if (response.status === 200) {
        const updatedUser = {
          ...userData,
          ...response.data.user,
          token: userData.token // Keep the existing token
        };
        
        setUser(updatedUser);
        localStorage.setItem('cryptonexus_user', JSON.stringify(updatedUser));
        
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('❌ Update error:', error);
      if (error.response?.status === 401) {
        logout();
        return { success: false, error: 'Your session has expired. Please login again.' };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update user' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async () => {
    setIsLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('cryptonexus_user'));
      const token = userData?.token;
      
      if (!token) {
        throw new Error('Please login again');
      }

      const response = await axios.delete(`${API_URL}/deleteuser`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Auto logout after successful deletion
        logout();
        return { success: true, message: 'Account deleted successfully' };
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        return { success: false, error: 'Your session has expired. Please login again.' };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete account' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signup,
    login,
    logout,
    getUserProfile,
    updateUser,
    deleteUser
  };
};
