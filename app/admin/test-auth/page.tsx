'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/admin-auth';

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function testAuthentication() {
    setLoading(true);
    setError(null);
    
    try {
      // Get the access token
      const accessToken = localStorage.getItem('adminAccessToken');
      const tokenType = localStorage.getItem('adminTokenType') || 'Bearer';
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      // Make a request to the test-auth endpoint
      const response = await fetch('/api/admin/test-auth', {
        headers: {
          'Authorization': `${tokenType} ${accessToken}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication test failed');
      }
      
      setTestResult(data);
    } catch (err: any) {
      console.error('Test auth error:', err);
      setError(err.message || 'An error occurred during the test');
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Admin Authentication Test Page</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Auth Context State:</h2>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '0.25rem', 
          overflow: 'auto' 
        }}>
          {JSON.stringify({
            isAuthenticated,
            user,
            accessToken: localStorage.getItem('adminAccessToken') ? '✓ (present)' : '✗ (missing)',
            refreshToken: localStorage.getItem('adminRefreshToken') ? '✓ (present)' : '✗ (missing)',
            tokenExpiry: localStorage.getItem('adminTokenExpiresAt') || 'none'
          }, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={testAuthentication}
          disabled={loading}
          style={{
            background: '#4f46e5',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Testing...' : 'Test Authentication'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          background: '#fee2e2', 
          color: '#b91c1c', 
          padding: '1rem', 
          borderRadius: '0.25rem',
          marginBottom: '2rem'
        }}>
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Test Result:</h2>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '0.25rem', 
            overflow: 'auto' 
          }}>
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
      
      <div>
        <a 
          href="/admin" 
          style={{ 
            color: '#4f46e5', 
            textDecoration: 'none',
            display: 'inline-block',
            marginRight: '1rem'
          }}
        >
          Back to Dashboard
        </a>
        <a 
          href="/admin/login" 
          style={{ 
            color: '#4f46e5', 
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Go to Login
        </a>
      </div>
    </div>
  );
} 