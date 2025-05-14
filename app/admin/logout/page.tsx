"use client"

import { useEffect } from 'react'
import { useAdminAuth } from '@/lib/admin-auth'
import { useRouter } from 'next/navigation'

export default function AdminLogout() {
  const { logout } = useAdminAuth()
  const router = useRouter()
  
  useEffect(() => {
    // Perform logout and redirect
    const performLogout = async () => {
      try {
        // Call the logout function from auth context
        logout()
        
        // Clear any related session storage
        sessionStorage.removeItem('justLoggedIn')
        sessionStorage.removeItem('loginTimestamp')
        sessionStorage.removeItem('redirectedFrom')
        
        // Redirect to login page
        router.push('/admin/login')
      } catch (error) {
        console.error('Error during logout:', error)
        // Redirect to login page anyway
        router.push('/admin/login')
      }
    }
    
    performLogout()
  }, [logout, router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Logging out...</h1>
        <p className="text-gray-600">Please wait while we securely log you out.</p>
      </div>
    </div>
  )
} 