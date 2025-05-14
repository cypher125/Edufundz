'use client';

/**
 * Authentication utility functions to centralize token management
 */

// Simple cookie handler using native browser APIs
const CookieHandler = {
  set: (name: string, value: string, options?: { expires?: number }) => {
    if (typeof window === 'undefined') return;
    
    try {
      const expires = options?.expires ? new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}`;
    } catch (e) {
      console.error('Failed to set cookie:', e);
    }
  },
  
  get: (name: string): string | undefined => {
    if (typeof window === 'undefined') return undefined;
    
    try {
      const cookies = document.cookie.split(';');
      const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));
      return cookie ? cookie.split('=')[1] : undefined;
    } catch (e) {
      console.error('Failed to get cookie:', e);
      return undefined;
    }
  },
  
  remove: (name: string) => {
    if (typeof window === 'undefined') return;
    
    try {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } catch (e) {
      console.error('Failed to remove cookie:', e);
    }
  }
};

/**
 * Set authentication token in both localStorage and cookies
 */
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    CookieHandler.set('authToken', token, { expires: 7 }); // 7 days
  }
};

/**
 * Get authentication token from localStorage or cookies
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('authToken') || CookieHandler.get('authToken') || null;
};

/**
 * Remove authentication token from both localStorage and cookies
 */
export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    CookieHandler.remove('authToken');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Set admin authentication token in both localStorage and cookies
 */
export const setAdminAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminToken', token);
    CookieHandler.set('adminToken', token, { expires: 7 }); // 7 days
  }
};

/**
 * Get admin authentication token from localStorage or cookies
 */
export const getAdminAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('adminToken') || CookieHandler.get('adminToken') || null;
};

/**
 * Remove admin authentication token from both localStorage and cookies
 */
export const removeAdminAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    CookieHandler.remove('adminToken');
  }
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = (): boolean => {
  return !!getAdminAuthToken();
}; 