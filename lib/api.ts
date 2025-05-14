'use client';

// import { getSession } from 'next-auth/react';
import { getAuthToken } from './authHelpers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Base API client for making requests to the backend
 */
export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
) {
  // const session = await getSession();
  
  const headers = new Headers(options.headers);
  
  // Add Authorization header if token exists
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Token ${token}`);
  }
  
  // Default to JSON content type
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Handle non-JSON responses
  if (response.status === 204) {
    return null;
  }
  
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    const error = new Error(data.detail || 'An error occurred');
    throw Object.assign(error, { data, status: response.status });
  }
  
  return data;
}

/**
 * Helper function to make requests to Next.js API routes
 */
export async function fetchNextApi(
  endpoint: string,
  options: RequestInit = {}
) {
  const headers = new Headers(options.headers);
  
  // Default to JSON content type
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(endpoint, {
    ...options,
    headers,
  });
  
  // Handle non-JSON responses
  if (response.status === 204) {
    return null;
  }
  
  const data = await response.json();
  
  // Handle error responses
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    throw Object.assign(error, { data, status: response.status });
  }
  
  return data;
}

/**
 * User API endpoints
 */
export const userApi = {
  register: (userData: any) => 
    fetchApi('/users/register/', { method: 'POST', body: JSON.stringify(userData) }),
  
  login: (credentials: { email: string; password: string }) => 
    fetchApi('/users/login/', { method: 'POST', body: JSON.stringify(credentials) }),
  
  logout: () => 
    fetchApi('/users/logout/', { method: 'POST' }),
  
  getProfile: () => 
    fetchApi('/users/profile/'),
    
  getCurrentUser: () => 
    fetchApi('/users/me/'),
};

/**
 * Loan API endpoints
 */
export const loanApi = {
  getApplications: () => 
    fetchApi('/loans/applications/'),
  
  createApplication: (applicationData: any) => 
    fetchApi('/loans/applications/', { method: 'POST', body: JSON.stringify(applicationData) }),
  
  getLoans: () => 
    fetchApi('/loans/loans/'),
  
  getLoanSchedule: (loanId: number) =>
    fetchApi(`/loans/loans/${loanId}/schedule/`),
    
  getRemainingBalance: (loanId: number) =>
    fetchApi(`/loans/loans/${loanId}/remaining_balance/`),
  
  getRepayments: () => 
    fetchApi('/loans/repayments/'),
  
  makeRepayment: (repaymentId: string) => 
    fetchApi(`/loans/repayments/${repaymentId}/pay/`, { method: 'POST' }),
};

/**
 * Wallet API endpoints
 */
export const walletApi = {
  getWallet: () => 
    fetchApi('/wallet/wallet/'),
  
  deposit: (amount: number) => 
    fetchApi('/wallet/wallet/deposit/', { method: 'POST', body: JSON.stringify({ amount }) }),
  
  getTransactions: () => 
    fetchApi('/wallet/transactions/'),
  
  verifyPayment: (reference: string) => 
    fetchApi(`/wallet/verify-payment/${reference}/`),

  // Virtual account endpoints
  getVirtualAccount: () => 
    fetchApi('/wallet/wallet/virtual_account/'),
  
  createVirtualAccount: () => 
    fetchApi('/wallet/wallet/virtual_account/', { method: 'POST' }),
  
  getAllVirtualAccounts: () => 
    fetchApi('/wallet/virtual-accounts/'),
};

/**
 * Admin API endpoints
 */
export const adminApi = {
  // Admin Authentication
  adminLogin: (credentials: { email: string; password: string }) => 
    fetchNextApi('/api/admin/login', { method: 'POST', body: JSON.stringify(credentials) }),
  
  adminLogout: () => 
    fetchApi('/admin_api/logout/', { method: 'POST' }),
  
  getAdminProfile: () => 
    fetchApi('/admin_api/me/'),
  
  // User management
  getUsers: () => 
    fetchApi('/admin_api/users/'),
  
  getUserStats: () => 
    fetchApi('/admin_api/users/stats/'),
  
  // Loan management
  getAdminLoans: () => 
    fetchApi('/admin_api/loans/'),
  
  getLoanStats: () => 
    fetchApi('/admin_api/loans/stats/'),
  
  // Loan application management
  getLoanApplications: () => 
    fetchApi('/admin_api/loan-applications/'),
  
  approveLoanApplication: (id: number, data: any = {}) => 
    fetchApi(`/admin_api/loan-applications/${id}/approve/`, { 
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  rejectLoanApplication: (id: number) => 
    fetchApi(`/admin_api/loan-applications/${id}/reject/`, { 
      method: 'POST' 
    }),
  
  // Repayment management
  getRepayments: () => 
    fetchApi('/admin_api/repayments/'),
  
  // Wallet management
  getWallets: () => 
    fetchApi('/admin_api/wallets/'),
  
  getWalletStats: () => 
    fetchApi('/admin_api/wallets/stats/'),
  
  // Transaction management
  getTransactions: () => 
    fetchApi('/admin_api/transactions/'),
  
  getTransactionStats: () => 
    fetchApi('/admin_api/transactions/stats/'),
  
  // Virtual account management
  getVirtualAccounts: () => 
    fetchApi('/admin_api/virtual-accounts/'),
}; 