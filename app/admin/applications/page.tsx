"use client"

import { useState, useEffect } from 'react'
import { withAdminAuth } from '@/lib/admin-auth'

interface LoanApplication {
  id: number;
  user: {
    id: number;
    email: string;
    username: string;
  };
  amount: number;
  purpose: string;
  duration: number;
  status: string;
  created_at: string;
}

function ApplicationsManagement() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get the backend URL from env or use default
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setIsLoading(true);
      
      // Get the access token from storage
      const accessToken = localStorage.getItem('adminAccessToken');
      const tokenType = localStorage.getItem('adminTokenType') || 'Bearer';
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      // Fetch applications data
      const response = await fetch(`${BACKEND_URL}/api/admin/loan-applications/`, {
        headers: {
          'Authorization': `${tokenType} ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data);
      
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredApplications = applications.filter(app => {
    // Filter by status
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term (username or email)
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        app.user.username.toLowerCase().includes(searchTermLower) ||
        app.user.email.toLowerCase().includes(searchTermLower) ||
        app.id.toString().includes(searchTermLower)
      );
    }
    
    return true;
  });

  async function updateApplicationStatus(applicationId: number, status: string) {
    try {
      // Get the access token from storage
      const accessToken = localStorage.getItem('adminAccessToken');
      const tokenType = localStorage.getItem('adminTokenType') || 'Bearer';
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      // Update application status
      const response = await fetch(`${BACKEND_URL}/api/admin/loan-applications/${applicationId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `${tokenType} ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      // Refetch applications
      fetchApplications();
      
    } catch (err: any) {
      console.error('Error updating application status:', err);
      setError(err.message || 'Failed to update application');
    }
  }

  function handleViewDetails(application: LoanApplication) {
    setSelectedApplication(application);
    setShowModal(true);
  }

  async function handleApprove(applicationId: number) {
    if (confirm('Are you sure you want to approve this application?')) {
      await updateApplicationStatus(applicationId, 'approved');
    }
  }

  async function handleReject(applicationId: number) {
    if (confirm('Are you sure you want to reject this application?')) {
      await updateApplicationStatus(applicationId, 'rejected');
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Loan Applications</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading applications...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map(app => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{app.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.user.username || app.user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₦{app.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : app.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(app)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(app.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(app.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredApplications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Application Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Application ID</p>
                <p>{selectedApplication.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p>{selectedApplication.user.username} ({selectedApplication.user.email})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p>₦{selectedApplication.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Purpose</p>
                <p>{selectedApplication.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p>{selectedApplication.duration} {selectedApplication.duration === 1 ? 'month' : 'months'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`${
                  selectedApplication.status === 'pending' 
                    ? 'text-yellow-600' 
                    : selectedApplication.status === 'approved'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Date</p>
                <p>{new Date(selectedApplication.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              {selectedApplication.status === 'pending' && (
                <>
                  <button 
                    onClick={() => {
                      handleApprove(selectedApplication.id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => {
                      handleReject(selectedApplication.id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(ApplicationsManagement); 