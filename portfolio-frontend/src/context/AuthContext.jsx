import React, { createContext, useState, useEffect } from 'react';
import { login as apiLogin, getUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser()
        .then(response => {
          console.log('User fetched:', response.data);
          setUser(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Calling apiLogin with:', { username, password });
      const response = await apiLogin({ username, password });
      console.log('apiLogin response:', response.data);
      localStorage.setItem('token', response.data.token);
      const userResponse = await getUser();
      console.log('getUser response:', userResponse.data);
      setUser(userResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error during login:', err);
      const errorMessage = err.response?.data?.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught in Login.jsx
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};