'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminUser {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initial check for auth data in localStorage - only runs once on mount
  useEffect(() => {
    // Check if user is logged in when component mounts
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('adminUser');
        const accessToken = localStorage.getItem('adminAccessToken');
        const expiresAt = localStorage.getItem('adminTokenExpiresAt');
        
        console.log('Admin auth initial check:', {
          hasUser: !!storedUser,
          hasToken: !!accessToken,
          pathname
        });
        
        if (!storedUser || !accessToken || !expiresAt) {
          // No user or tokens found
          console.log('No admin auth data found, not authenticated');
          handleUnauthenticated(false); // Don't redirect on initial load
          return;
        }
        
        // Check if token is expired
        const now = new Date().getTime();
        const expiry = parseInt(expiresAt, 10);
        
        if (now >= expiry) {
          console.log('Admin token expired, attempting refresh');
          // Token expired, try to refresh
          const refreshed = await refreshAccessToken();
          
          if (!refreshed) {
            // Refresh failed
            console.log('Token refresh failed');
            handleUnauthenticated(false); // Don't redirect on initial load
            return;
          }
        }
        
        // Valid auth data
        console.log('Admin auth data found, setting authenticated state');
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error('Error checking auth status:', error);
        handleUnauthenticated(false); // Don't redirect on initial load
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Only run once on mount, not on every pathname change

  // Handle unauthenticated state
  const handleUnauthenticated = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear stored auth data
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminTokenExpiresAt');
    localStorage.removeItem('adminTokenType');
    setIsLoading(false);
    
    // Redirect to login if on admin page and shouldRedirect is true
    if (shouldRedirect && pathname?.startsWith('/admin') && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Making login request to /api/admin/login');
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Authentication failed');
      }

      // Store tokens and user data
      localStorage.setItem('adminAccessToken', data.access_token);
      localStorage.setItem('adminRefreshToken', data.refresh_token);
      
      const expiresAt = new Date().getTime() + (data.expires_in * 1000);
      localStorage.setItem('adminTokenExpiresAt', expiresAt.toString());
      
      localStorage.setItem('adminTokenType', data.token_type);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      setIsAuthenticated(true);
      
      console.log('Admin authenticated successfully, auth state updated');
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    handleUnauthenticated();
    router.push('/admin/login');
  };

  // Function to refresh access token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('adminRefreshToken');
      
      if (!refreshToken) {
        return false;
      }
      
      const response = await fetch('/api/admin/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      
      // Update tokens in storage
      localStorage.setItem('adminAccessToken', data.access_token);
      
      const expiresAt = new Date().getTime() + (data.expires_in * 1000);
      localStorage.setItem('adminTokenExpiresAt', expiresAt.toString());
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Add a request interceptor that adds auth headers and handles token refresh
  useEffect(() => {
    // Create a proxy for the fetch API to add auth headers
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // Get the URL as a string
      const url = input.toString();
      
      // Only intercept requests to the admin API
      // Check both frontend and backend admin API patterns
      const isAdminFrontendAPI = url.includes('/api/admin');
      const isAdminBackendAPI = url.includes('/api/admin/') && !url.includes('/api/admin/login') && !url.includes('/api/admin/refresh-token');
      
      if (!isAdminFrontendAPI && !isAdminBackendAPI) {
        return originalFetch(input, init);
      }
      
      // Skip auth header for login and refresh-token endpoints
      if (url.includes('/api/admin/login') || url.includes('/api/admin/refresh-token')) {
        return originalFetch(input, init);
      }
      
      // Check if token is expired
      const expiresAt = localStorage.getItem('adminTokenExpiresAt');
      if (expiresAt) {
        const now = new Date().getTime();
        const expiry = parseInt(expiresAt, 10);
        
        if (now >= expiry) {
          // Token expired, try to refresh
          const refreshed = await refreshAccessToken();
          
          if (!refreshed) {
            // Refresh failed, logout
            handleUnauthenticated();
            throw new Error('Session expired. Please login again.');
          }
        }
      }
      
      // Add auth header to request
      const accessToken = localStorage.getItem('adminAccessToken');
      const tokenType = localStorage.getItem('adminTokenType') || 'Bearer';
      
      if (accessToken) {
        const headers = new Headers(init?.headers || {});
        headers.set('Authorization', `${tokenType} ${accessToken}`);
        
        init = {
          ...init,
          headers,
        };
      }
      
      // Make request
      const response = await originalFetch(input, init);
      
      // Handle 401 responses (unauthorized)
      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await refreshAccessToken();
        
        if (refreshed) {
          // Retry request with new token
          const accessToken = localStorage.getItem('adminAccessToken');
          const tokenType = localStorage.getItem('adminTokenType') || 'Bearer';
          
          const headers = new Headers(init?.headers || {});
          headers.set('Authorization', `${tokenType} ${accessToken}`);
          
          init = {
            ...init,
            headers,
          };
          
          return originalFetch(input, init);
        } else {
          // Refresh failed, logout
          handleUnauthenticated();
          throw new Error('Session expired. Please login again.');
        }
      }
      
      return response;
    };
    
    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAccessToken,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
}

// Create a higher-order component for protected admin routes
export function withAdminAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { isAuthenticated, isLoading, user } = useAdminAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [hasRedirected, setHasRedirected] = useState(false);
    const [shouldBypassAuth, setShouldBypassAuth] = useState(false);
    
    // Perform a direct check on localStorage on mount
    useEffect(() => {
      // Check localStorage directly
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('adminAccessToken');
        const storedUser = localStorage.getItem('adminUser');
        const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
        const loginTimestamp = sessionStorage.getItem('loginTimestamp');
        
        // If we've just logged in within the last 10 seconds, bypass auth checks
        const isRecentLogin = loginTimestamp && 
          (Date.now() - parseInt(loginTimestamp, 10)) < 10000;
        
        const hasLocalAuth = storedToken && storedUser;
        
        console.log('Direct localStorage check in HOC:', { 
          hasLocalAuth,
          justLoggedIn,
          isRecentLogin,
          pathname
        });
        
        // If we have tokens in localStorage or just logged in, bypass normal auth flow
        if (hasLocalAuth || justLoggedIn || isRecentLogin) {
          setShouldBypassAuth(true);
        }
      }
    }, []);
    
    // Check if we've just navigated from login page
    const isComingFromLogin = typeof window !== 'undefined' && 
      sessionStorage.getItem('justLoggedIn') === 'true';
    
    useEffect(() => {
      console.log('Protected route check:', { 
        isAuthenticated, 
        isLoading, 
        pathname,
        hasUser: !!user,
        isComingFromLogin,
        hasRedirected,
        shouldBypassAuth
      });
      
      // Clear the "just logged in" flag if we're on the admin dashboard
      if (pathname === '/admin' && isComingFromLogin) {
        console.log('Clearing just logged in flag');
        // Only clear after some time to ensure it's used by all components
        setTimeout(() => {
          sessionStorage.removeItem('justLoggedIn');
          sessionStorage.removeItem('loginTimestamp');
        }, 5000);
        return; // Skip redirect check if we just logged in
      }
      
      // Only redirect if:
      // 1. Not loading
      // 2. Not authenticated according to context
      // 3. Not on login page
      // 4. We haven't already redirected
      // 5. Not coming from login
      // 6. Not bypassing auth based on direct localStorage check
      if (!isLoading && 
          !isAuthenticated && 
          pathname !== '/admin/login' && 
          !hasRedirected && 
          !isComingFromLogin && 
          !shouldBypassAuth) {
        console.log('Not authenticated, redirecting to login');
        setHasRedirected(true); // Prevent multiple redirects
        router.push('/admin/login');
      }
    }, [isAuthenticated, isLoading, router, pathname, user, hasRedirected, isComingFromLogin, shouldBypassAuth]);
    
    if (isLoading && !shouldBypassAuth) {
      console.log('Auth is still loading, showing loading state');
      return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading admin dashboard...</div>;
    }
    
    // Skip the auth check in any of these cases:
    // 1. Coming from login and heading to dashboard
    // 2. We have determined we should bypass auth from direct localStorage check
    if ((isComingFromLogin && pathname === '/admin') || shouldBypassAuth) {
      console.log('Bypassing auth check, rendering protected component');
      return <Component {...props} />;
    }
    
    if (!isAuthenticated && pathname !== '/admin/login' && !isComingFromLogin && !shouldBypassAuth) {
      console.log('Not authenticated and not on login page, returning null');
      return null;
    }
    
    console.log('Auth check passed, rendering protected component');
    return <Component {...props} />;
  };
} 