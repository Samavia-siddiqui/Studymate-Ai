import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: userToken, ...userData } = response.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || 'Login failed. Please try again.';
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const { token: userToken, ...userData } = response.data;

      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || 'Registration failed. Please try again.';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
