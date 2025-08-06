import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API from '../config';

const AuthContext = createContext(null);

export let handleWebSocketUserUpdate = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempToken, setTempToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && token !== 'null' && token !== 'undefined' &&
      storedUser && storedUser !== 'null' && storedUser !== 'undefined') {
      setUser(JSON.parse(storedUser));
      fetchProfile();
    } else {
      setLoading(false);
    }

    // Set up periodic check for user status (every 10 seconds)
    const interval = setInterval(async () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken && user) {
        try {
          const response = await axios.get(`${API}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${currentToken}`
            }
          });
          const userData = response.data;
          
          // Check if user is blocked
          if (userData.blocked) {
            logout();
            // Show notification to user
            if (typeof window !== 'undefined') {
              alert('Your account has been blocked by admin. You have been logged out.');
            }
            window.location.href = '/login';
          } else {
            // Update user data if not blocked
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          // If token is invalid, logout
          if (error.response?.status === 401) {
            logout();
            window.location.href = '/login';
          }
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userData = response.data;
      
      // Check if user is blocked
      if (userData.blocked) {
        logout();
        if (typeof window !== 'undefined') {
          alert('Your account has been blocked by admin. You have been logged out.');
        }
        window.location.href = '/login';
        return;
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, {
        username,
        password
      });
      
      if (response.data.success && response.data.requiresOtp) {
        setTempToken(response.data.token);
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const verifyOtp = async (username, otp) => {
    try {
      const response = await axios.post(`${API}/auth/verify-otp`, {
        username,
        otp
      });

      if (response.data.success) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setTempToken(null);
      }
      
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API}/auth/register`, userData);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const sendResetOtp = async (username) => {
    const res = await axios.post(`${API}/auth/forget-password`, { username });
    return res;
  }

  const resetPassword = async (username, otp, newPassword) => {
    const res = await axios.post(`${API}/auth/reset-password`, {
      username, otp, newPassword,
    });
    return res;
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTempToken(null);
  };

  // Add a handler for WebSocket user/porter updates
  handleWebSocketUserUpdate = (userData) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      // If the update is for the current user and they are blocked, logout
      if (userData.id === currentUser.id && userData.blocked) {
        logout();
        // Show notification to user
        if (typeof window !== 'undefined') {
          alert('Your account has been blocked by admin. You have been logged out.');
        }
        window.location.href = '/login';
      }
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifyOtp,
    sendResetOtp,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 