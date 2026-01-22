import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './HostelList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function HostelList({ user, onLogout }) {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = user.role === 'central_authority' 
        ? `${API_URL}/hostels` 
        : `${API_URL}/hostels/my/hostels`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      setHostels(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hostel?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/hostels/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setHostels(hostels.filter(h => h._id !== id));
        alert('Hostel deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting hostel:', error);
      alert('Failed to delete hostel');
    }
  };

  const handleToggleVerify = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/hostels/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedHostel = await response.json();
        setHostels(hostels.map(h => h._id === id ? updatedHostel : h));
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/hostels/${id}/featured`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedHostel = await response.json();
        setHostels(hostels.map(h => h._id === id ? updatedHostel : h));
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/hostels/${id}/toggle-active`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedHostel = await response.json();
        setHostels(hostels.map(h => h._id === id ? updatedHostel : h));
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const filteredHostels = hostels.filter(hostel => {
    if (filter === 'active') return hostel.isActive;
    if (filter === 'inactive') return !hostel.isActive;
    if (filter === 'verified') return hostel.verified;
    if (filter === 'unverified') return !hostel.verified;
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
      <div className="hostel-list-page">
        <div className="container">
          <div className="page-header">
            <h1>My Hostels</h1>
            <Link to="/hostels/add" className="btn btn-primary">+ Add New Hostel</Link>
          </div>

          <div className="filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({hostels.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({hostels.filter(h => h.isActive).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive ({hostels.filter(h => !h.isActive).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'verified' ? 'active' : ''}`}
              onClick={() => setFilter('verified')}
            >
              Verified ({hostels.filter(h => h.verified).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'unverified' ? 'active' : ''}`}
              onClick={() => setFilter('unverified')}
            >
              Unverified ({hostels.filter(h => !h.verified).length})
            </button>
          </div>

          {filteredHostels.length === 0 ? (
            <div className="card text-center">
              <h3>No hostels found</h3>
              <p>Add your first hostel to get started</p>
              <Link to="/hostels/add" className="btn btn-primary mt-20">Add Hostel</Link>
            </div>
          ) : (
            <div className="hostels-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Gender</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHostels.map(hostel => (
                    <tr key={hostel._id}>
                      <td>
                        <div className="hostel-name">
                          <strong>{hostel.name}</strong>
                          {hostel.featured && <span className="badge badge-warning">Featured</span>}
                        </div>
                      </td>
                      <td>{hostel.location}</td>
                      <td>{hostel.gender}</td>
                      <td>₹{hostel.price.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${hostel.verified ? 'badge-success' : 'badge-warning'}`}>
                          {hostel.verified ? 'Verified' : 'Pending'}
                        </span>
                        <span className={`badge ${hostel.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {hostel.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/hostels/edit/${hostel._id}`} className="btn btn-sm btn-primary">
                            Edit
                          </Link>
                          {user.role === 'central_authority' && (
                            <>
                              <button 
                                onClick={() => handleToggleVerify(hostel._id)}
                                className="btn btn-sm btn-success"
                              >
                                {hostel.verified ? 'Unverify' : 'Verify'}
                              </button>
                              <button 
                                onClick={() => handleToggleFeatured(hostel._id)}
                                className="btn btn-sm btn-warning"
                              >
                                {hostel.featured ? 'Unfeature' : 'Feature'}
                              </button>
                              <button 
                                onClick={() => handleToggleActive(hostel._id)}
                                className="btn btn-sm btn-secondary"
                              >
                                {hostel.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDelete(hostel._id)}
                            className="btn btn-sm btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HostelList;
