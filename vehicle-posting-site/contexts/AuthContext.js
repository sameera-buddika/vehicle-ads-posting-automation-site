'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Only check auth if there's a JWT cookie
      if (typeof window !== 'undefined') {
        const hasCookie = document.cookie.includes('jwt=');
        if (!hasCookie) {
          setUser(null);
          setLoading(false);
          return;
        }
      }
      
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // Silently handle auth errors - user is just not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Wait a bit for cookie to be set, then fetch user data
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Fetch user data after login
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        return { success: true, user: userData };
      } catch (authError) {
        // If getCurrentUser fails, still return success if login worked
        // The cookie is set, so user is logged in
        console.warn('Could not fetch user data immediately:', authError);
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed. Please check your credentials.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      // Backend returns message about verification email
      return { success: true, message: response?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      // Navigate immediately - loading bar will show
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

