import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './UserManagement.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function UserManagement({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}/toggle-active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: updatedUser.isActive } : u));
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u._id === userId ? { ...u, isVerified: updatedUser.isVerified } : u));
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId));
        alert('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'central') return u.role === 'central_authority';
    if (filter === 'hostel') return u.role === 'hostel_authority';
    if (filter === 'active') return u.isActive;
    if (filter === 'inactive') return !u.isActive;
    return true;
  });

  if (loading) {
    return (
      <>
        <Navbar user={user} onLogout={onLogout} />
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="user-management-page">
        <div className="container">
          <div className="page-header">
            <h1>User Management</h1>
          </div>

          <div className="filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Users ({users.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'central' ? 'active' : ''}`}
              onClick={() => setFilter('central')}
            >
              Central Authority ({users.filter(u => u.role === 'central_authority').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'hostel' ? 'active' : ''}`}
              onClick={() => setFilter('hostel')}
            >
              Hostel Authority ({users.filter(u => u.role === 'hostel_authority').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({users.filter(u => u.isActive).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive ({users.filter(u => !u.isActive).length})
            </button>
          </div>

          <div className="users-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      <span className={`badge ${u.role === 'central_authority' ? 'badge-warning' : 'badge-info'}`}>
                        {u.role === 'central_authority' ? 'Central Authority' : 'Hostel Authority'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`badge ${u.isVerified ? 'badge-success' : 'badge-warning'}`}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleToggleActive(u._id)}
                          className={`btn btn-sm ${u.isActive ? 'btn-warning' : 'btn-success'}`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleToggleVerify(u._id)}
                          className="btn btn-sm btn-primary"
                        >
                          {u.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        {u._id !== user._id && (
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserManagement;
