import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const userData = saveAuthenticatedUser(response.data);
    setNotification({ message: 'Login successful', variant: 'success' });
    return userData;
  };

  const saveAuthenticatedUser = (responseData) => {
    const userData = {
      _id: responseData._id,
      name: responseData.name,
      email: responseData.email,
      role: responseData.role,
    };

    localStorage.setItem('token', responseData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(responseData.token);
    setUser(userData);

    return userData;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return saveAuthenticatedUser(response.data);
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setNotification({ message: 'Logout successful', variant: 'success' });
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    notification,
    dismissNotification: () => setNotification(null),
    isAuthenticated: !!token && !!user,
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
