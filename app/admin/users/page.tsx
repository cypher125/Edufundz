"use client"

import { useState, useEffect } from 'react'
import { withAdminAuth } from '@/lib/admin-auth'

interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
}

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get the backend URL from env or use default
  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setIsLoading(true);
      
      // Get the access token from storage
      const accessToken = localStorage.getItem('adminAccessToken');
      const tokenType = localStorage.getItem('adminTokenType') || 'Bearer';
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      // Fetch users data
      const response = await fetch(`${BACKEND_URL}/api/admin/users/`, {
        headers: {
          'Authorization': `${tokenType} ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
      
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function toggleUserStatus(userId: number, isActive: boolean) {
    try {
      // Get the access token from storage
      const accessToken = localStorage.getItem('adminAccessToken');
      const tokenType = localStorage.getItem('adminTokenType') || 'Bearer';
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      // Update user status
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `${tokenType} ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !isActive })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user status');
      }
      
      // Refetch users
      fetchUsers();
      
    } catch (err: any) {
      console.error('Error updating user status:', err);
      setError(err.message || 'Failed to update user');
    }
  }

  async function deleteUser(userId: number) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Get the access token from storage
      const accessToken = localStorage.getItem('adminAccessToken');
      const tokenType = localStorage.getItem('adminTokenType') || 'Bearer';
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      // Delete user
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${tokenType} ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Refetch users
      fetchUsers();
      
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    }
  }

  function handleViewDetails(user: User) {
    setSelectedUser(user);
    setShowModal(true);
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add New User
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading users...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.is_superuser 
                      ? 'Admin' 
                      : user.is_staff 
                      ? 'Staff' 
                      : 'User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p>{selectedUser.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p>{selectedUser.username}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{selectedUser.is_active ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p>
                  {selectedUser.is_superuser 
                    ? 'Admin' 
                    : selectedUser.is_staff 
                    ? 'Staff' 
                    : 'User'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Joined</p>
                <p>{new Date(selectedUser.date_joined).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
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

export default withAdminAuth(UserManagement);

