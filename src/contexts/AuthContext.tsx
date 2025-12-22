import React, { createContext, useContext, useEffect, useState } from 'react';
import { sampleDoctor } from '../lib/sampleData';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored mock session
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful login
    const mockUser: User = {
      id: sampleDoctor.id,
      email: email,
      phone: sampleDoctor.phone,
      user_metadata: {
        full_name: sampleDoctor.full_name,
        avatar_url: sampleDoctor.avatar_url
      },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };

    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockUser: User = {
      id: 'new-doctor-' + Date.now(),
      email: email,
      phone: phone,
      user_metadata: {
        full_name: fullName,
      },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };

    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem('mock_user');
    setLoading(false);
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

