import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock authentication for demo purposes
  const login = async (email: string, password: string): Promise<void> => {
    try {
      // In a real app, this would call Firebase Auth
      console.log('Login attempted with:', email, password);
      // We're not actually authenticating with Firebase in this demo
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // In a real app, this would call Firebase Auth
      console.log('Logout attempted');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      // In a real app, this would call Firebase Auth
      console.log('Registration attempted with:', email, password, displayName);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};