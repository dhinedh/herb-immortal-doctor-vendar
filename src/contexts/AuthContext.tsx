import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock User type to replace Supabase User
export interface User {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  aud: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

import api from '../lib/api';

// ... (imports remain)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user and token
    const storedUser = localStorage.getItem('mock_user');
    const token = localStorage.getItem('auth_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Optionally verify token with backend here
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem('mock_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
        fullName,
        phone
      });
      const { user, token } = response.data;

      setUser(user);
      localStorage.setItem('mock_user', JSON.stringify(user));
      localStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('signOut called');
    setLoading(true);
    try {
      // await api.post('/auth/logout'); // If backend has logout
    } finally {
      console.log('clearing user session');
      setUser(null);
      localStorage.removeItem('mock_user');
      localStorage.removeItem('auth_token');
      setLoading(false);
    }
  };

  const sendOTP = async (email: string) => {
    console.log(`Mock OTP sent to ${email}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const verifyOTP = async (email: string, token: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (token === '123456') { // Mock valid token
      // Mock login via OTP
      await signIn(email, 'password');
    } else {
      throw new Error('Invalid OTP');
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    sendOTP,
    verifyOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

