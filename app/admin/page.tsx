"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth, withAdminAuth } from '@/lib/admin-auth'

// Define base URL without /api suffix to avoid duplication
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

// Type definitions for the data
interface Stats {
  totalUsers: number;
  activeLoans: number;
  totalLoanAmount: number;
  repaymentRate: number;
}

interface LoanApplication {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
  };
  amount: number;
  created_at: string;
  status: string;
}

function AdminDashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAdminAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (!isAuthenticated) return;

    // Function to fetch data from backend
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Get the access token from storage
        const accessToken = localStorage.getItem('adminAccessToken')
        const tokenType = localStorage.getItem('adminTokenType') || 'Bearer'
        
        if (!accessToken) {
          throw new Error('No access token found')
        }
        
        // Fetch stats using the dashboard/stats endpoint with correct path
        const statsResponse = await fetch(`${BACKEND_URL}/api/admin/dashboard/stats/`, {
          headers: {
            'Authorization': `${tokenType} ${accessToken}`
          }
        })
        
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const statsData = await statsResponse.json()
        setStats(statsData)
        
        // Fetch recent loan applications with correct path
        const applicationsResponse = await fetch(`${BACKEND_URL}/api/admin/loan-applications/`, {
          headers: {
            'Authorization': `${tokenType} ${accessToken}`
          }
        })
        
        if (!applicationsResponse.ok) {
          throw new Error('Failed to fetch applications')
        }
        
        const applicationsData = await applicationsResponse.json()
        setApplications(applicationsData.slice(0, 5)) // Get only the most recent 5
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          borderRadius: '8px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
        <button 
          onClick={logout}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Welcome, {user?.username}
        </h1>
        
        <button 
          onClick={logout}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          flex: 1
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Total Users</h2>
          <p style={{ fontSize: '24px', color: '#059669' }}>
            {stats ? stats.totalUsers : '—'}
          </p>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          flex: 1
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Active Loans</h2>
          <p style={{ fontSize: '24px', color: '#059669' }}>
            {stats ? `₦${(stats.totalLoanAmount / 1000000).toFixed(1)}M` : '—'}
          </p>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          flex: 1
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '0.5rem' }}>Repayment Rate</h2>
          <p style={{ fontSize: '24px', color: '#059669' }}>
            {stats ? `${stats.repaymentRate}%` : '—'}
          </p>
        </div>
      </div>

      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Applications</h2>
        
        {applications.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Student</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>{app.id}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>{app.user.username}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>₦{app.amount.toLocaleString()}</td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ 
                      backgroundColor: app.status === 'pending' ? '#fef3c7' : app.status === 'approved' ? '#dcfce7' : '#fee2e2',
                      color: app.status === 'pending' ? '#92400e' : app.status === 'approved' ? '#166534' : '#b91c1c',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      textTransform: 'capitalize'
                    }}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>
            No recent applications found.
          </p>
        )}
      </div>
    </div>
  )
}

// Export the protected component
export default withAdminAuth(AdminDashboard)

