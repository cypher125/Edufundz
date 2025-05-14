'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login, isLoading } = useAdminAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      console.log('Attempting admin login with:', email);
      
      // Login and wait for it to complete
      await login(email, password);
      console.log('Login completed successfully, updating UI');
      setSuccessMessage('Login successful! Redirecting to dashboard...');
      
      // Set a flag in sessionStorage to indicate we just logged in
      sessionStorage.setItem('justLoggedIn', 'true');
      console.log('Set justLoggedIn flag in session');
      
      // Also set a timestamp to track login time
      sessionStorage.setItem('loginTimestamp', Date.now().toString());
      
      // Use a longer delay to ensure everything is saved
      setTimeout(() => {
        console.log('Forcing direct navigation to admin dashboard');
        // Save current path in case we need to come back
        sessionStorage.setItem('redirectedFrom', window.location.pathname);
        // Navigate to admin dashboard with cache-busting query param
        window.location.href = `/admin?t=${Date.now()}`;
      }, 3000);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6' 
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '24px', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Admin Login</h1>
          <p style={{ color: '#6b7280' }}>Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            backgroundColor: '#fee2e2', 
            border: '1px solid #ef4444', 
            color: '#b91c1c', 
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            backgroundColor: '#d1fae5', 
            border: '1px solid #10b981', 
            color: '#047857', 
            borderRadius: '4px' 
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="email" style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '4px' 
            }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                outline: 'none'
              }}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '4px' 
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                outline: 'none'
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px 16px', 
              borderRadius: '4px', 
              backgroundColor: '#059669', 
              color: 'white', 
              border: 'none', 
              cursor: isLoading ? 'default' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in to Admin Panel'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/auth/login" style={{ fontSize: '14px', color: '#059669', textDecoration: 'none' }}>
            Return to student login
          </a>
        </div>
      </div>
    </div>
  );
} 