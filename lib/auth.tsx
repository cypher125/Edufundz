'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api';
import { getAuthToken, setAuthToken, removeAuthToken } from './authHelpers';

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Clear token from localStorage and cookies
    removeAuthToken();
    localStorage.removeItem('user');
    
    // Call logout API if needed
    try {
      userApi.logout().catch(() => {
        // Ignore logout failures, we're still clearing client-side state
      });
    } catch (e) {
      // Ignore errors
    }
    
    router.push('/auth/login');
  };

  useEffect(() => {
    // Check for token in localStorage and cookies
    const storedToken = getAuthToken();
    
    if (storedToken) {
      setToken(storedToken);
      
      // Ensure token is stored in both places
      setAuthToken(storedToken);
      
      // Fetch current user data if token exists
      const fetchUser = async () => {
        try {
          const userData = await userApi.getCurrentUser();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // If token is invalid, clear it
          logout();
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    
    // Store token in localStorage and cookies
    setAuthToken(newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading,
        login, 
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 