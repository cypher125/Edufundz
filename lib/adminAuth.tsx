'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminAuthToken, setAdminAuthToken, removeAdminAuthToken } from '@/lib/authHelpers';

// Admin user interface
interface AdminUser {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

// Admin auth context type
interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, adminData: AdminUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the admin auth context
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Admin auth provider component
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Logout function for admin
  const logout = () => {
    setToken(null);
    setAdmin(null);
    
    // Clear admin token and user data
    removeAdminAuthToken();
    localStorage.removeItem('adminUser');
    
    // Redirect to admin login
    router.push('/admin/login');
  };

  // Effect to check for stored admin token on page load
  useEffect(() => {
    const storedToken = getAdminAuthToken();
    
    if (storedToken) {
      setToken(storedToken);
      
      // For demo purposes, get admin user from localStorage instead of API
      const storedAdminUser = localStorage.getItem('adminUser');
      if (storedAdminUser) {
        try {
          const parsedUser = JSON.parse(storedAdminUser) as AdminUser;
          
          // Verify the user is actually an admin
          if (parsedUser.is_staff || parsedUser.is_superuser) {
            setAdmin(parsedUser);
          } else {
            // Not an admin, log them out
            console.error('User is not an admin');
            logout();
          }
        } catch (error) {
          console.error('Failed to parse admin user data:', error);
          logout();
        }
      } else {
        // For demo, create a default admin user if token exists but no user data
        const defaultAdmin: AdminUser = {
          id: 1,
          email: 'admin@example.com',
          username: 'admin',
          is_staff: true,
          is_superuser: true
        };
        setAdmin(defaultAdmin);
        localStorage.setItem('adminUser', JSON.stringify(defaultAdmin));
      }
      
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);  // Remove router dependency to avoid circular dependency warning

  // Login function for admin
  const login = (newToken: string, adminData: AdminUser) => {
    // Verify the user is an admin
    if (!adminData.is_staff && !adminData.is_superuser) {
      throw new Error('User is not authorized for admin access');
    }
    
    setToken(newToken);
    setAdmin(adminData);
    
    // Store admin token and data
    setAdminAuthToken(newToken);
    localStorage.setItem('adminUser', JSON.stringify(adminData));
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        admin, 
        token, 
        isLoading,
        login, 
        logout,
        isAuthenticated: !!token && !!admin
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

// Hook to use admin auth context
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
} 