import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    totalHostels: 0,
    activeHostels: 0,
    totalUsers: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupancyRate: 0,
    verifiedHostels: 0,
    revenue: 0,
    totalStudents: 0,
    pendingRequests: 0
  });
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview'); // overview, rooms, facilities, students, reports
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [showRoomUpdateModal, setShowRoomUpdateModal] = useState(false);
  const [roomUpdate, setRoomUpdate] = useState({ hostelId: '', occupied: 0, available: 0 });
  
  // Mock student data - In production, fetch from API
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch hostels
      const hostelEndpoint = user.role === 'central_authority' 
        ? `${API_URL}/hostels` 
        : `${API_URL}/hostels/my/hostels`;
        
      const hostelsResponse = await fetch(hostelEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const hostelsData = await hostelsResponse.json();
      setHostels(hostelsData);

      // Calculate detailed stats
      const totalRooms = hostelsData.reduce((sum, h) => sum + (h.totalRooms || 0), 0);
      const availableRooms = hostelsData.reduce((sum, h) => sum + (h.availableRooms || 0), 0);
      const occupiedRooms = totalRooms - availableRooms;
      const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;
      const revenue = hostelsData.reduce((sum, h) => sum + (h.price * (h.totalRooms - h.availableRooms || 0)), 0);

      setStats({
        totalHostels: hostelsData.length,
        activeHostels: hostelsData.filter(h => h.isActive).length,
        verifiedHostels: hostelsData.filter(h => h.verified).length,
        totalRooms,
        availableRooms,
        occupancyRate,
        revenue,
        totalStudents: 0, // Will be calculated from enrolled students
        pendingRequests: 0 // Booking requests
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleRoomUpdate = async (hostelId, occupied, available) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/hostels/${hostelId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          totalRooms: occupied + available,
          availableRooms: available
        })
      });
      
      if (response.ok) {
        fetchData(); // Refresh data
        setShowRoomUpdateModal(false);
      }
    } catch (error) {
      console.error('Error updating rooms:', error);
    }
  };

  const openRoomUpdateModal = (hostel) => {
    setSelectedHostel(hostel);
    setRoomUpdate({
      hostelId: hostel._id,
      occupied: (hostel.totalRooms || 0) - (hostel.availableRooms || 0),
      available: hostel.availableRooms || 0
    });
    setShowRoomUpdateModal(true);
  };

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
      <Navbar user={user} onLogout={onLogout} onNavigate={setSelectedView} />
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <div className="header-content">
              <div>
                <h1>Welcome back, {user.name}</h1>
                <p>Hostel Management Dashboard</p>
              </div>
              <div className="header-actions">
                <Link to="/hostels/add" className="btn-primary-gradient">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                  Add New Hostel
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="view-tabs">
            <button 
              className={`tab-btn ${selectedView === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedView('overview')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
              Overview
            </button>
            <button 
              className={`tab-btn ${selectedView === 'rooms' ? 'active' : ''}`}
              onClick={() => setSelectedView('rooms')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
              </svg>
              Rooms
            </button>
            <button 
              className={`tab-btn ${selectedView === 'students' ? 'active' : ''}`}
              onClick={() => setSelectedView('students')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
              </svg>
              Students
            </button>
            <button 
              className={`tab-btn ${selectedView === 'facilities' ? 'active' : ''}`}
              onClick={() => setSelectedView('facilities')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
              Facilities
            </button>
            <button 
              className={`tab-btn ${selectedView === 'reports' ? 'active' : ''}`}
              onClick={() => setSelectedView('reports')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
              </svg>
              Reports
            </button>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card gradient-blue">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-11zm1 .5v10h8V3H4zm1 1a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </div>
                <span className="stat-trend positive">+12%</span>
              </div>
              <div className="stat-content">
                <h3>{stats.totalHostels}</h3>
                <p>Total Hostels</p>
                <div className="stat-footer">
                  <span className="stat-detail">{stats.activeHostels} Active</span>
                </div>
              </div>
            </div>

            <div className="stat-card gradient-green">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 2.5A.5.5 0 0 1 3.5 2h2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-11zm7 0A.5.5 0 0 1 10.5 2h2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-11z"/>
                  </svg>
                </div>
                <span className="stat-trend positive">+8%</span>
              </div>
              <div className="stat-content">
                <h3>{stats.totalRooms}</h3>
                <p>Total Rooms</p>
                <div className="stat-footer">
                  <span className="stat-detail">{stats.availableRooms} Available</span>
                </div>
              </div>
            </div>

            <div className="stat-card gradient-purple">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/>
                  </svg>
                </div>
                <span className="stat-trend positive">+5%</span>
              </div>
              <div className="stat-content">
                <h3>{stats.occupancyRate}%</h3>
                <p>Occupancy Rate</p>
                <div className="stat-footer">
                  <span className="stat-detail">{stats.totalRooms - stats.availableRooms} Occupied</span>
                </div>
              </div>
            </div>

            <div className="stat-card gradient-orange">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                  </svg>
                </div>
                <span className="stat-trend positive">+15%</span>
              </div>
              <div className="stat-content">
                <h3>₹{(stats.revenue / 1000).toFixed(1)}K</h3>
                <p>Monthly Revenue</p>
                <div className="stat-footer">
                  <span className="stat-detail">This month</span>
                </div>
              </div>
            </div>

            <div className="stat-card gradient-teal">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                  </svg>
                </div>
                <span className="stat-badge">Status</span>
              </div>
              <div className="stat-content">
                <h3>{stats.verifiedHostels}</h3>
                <p>Verified Hostels</p>
                <div className="stat-footer">
                  <span className="stat-detail">{stats.totalHostels - stats.verifiedHostels} Pending</span>
                </div>
              </div>
            </div>

            <div className="stat-card gradient-pink">
              <div className="stat-header">
                <div className="stat-icon">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                </div>
                <span className="stat-trend positive">4.5</span>
              </div>
              <div className="stat-content">
                <h3>{hostels.reduce((sum, h) => sum + (h.rating || 0), 0) > 0 ? 
                    (hostels.reduce((sum, h) => sum + (h.rating || 0), 0) / hostels.length).toFixed(1) : '0.0'}</h3>
                <p>Average Rating</p>
                <div className="stat-footer">
                  <span className="stat-detail">{hostels.reduce((sum, h) => sum + (h.reviews || 0), 0)} Reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Based on Selected View */}
          {selectedView === 'overview' && (
            <>
              {/* Quick Actions */}
              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <Link to="/hostels/add" className="action-card modern">
                    <div className="action-icon-modern gradient-blue">
                      <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                      </svg>
                    </div>
                    <h3>Add New Hostel</h3>
                    <p>Register a new hostel property</p>
                    <span className="action-arrow">→</span>
                  </Link>

                  <Link to="/hostels" className="action-card modern">
                    <div className="action-icon-modern gradient-green">
                      <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-11z"/>
                      </svg>
                    </div>
                    <h3>Manage Hostels</h3>
                    <p>View and edit all hostels</p>
                    <span className="action-arrow">→</span>
                  </Link>

                  <div className="action-card modern" onClick={() => setSelectedView('rooms')}>
                    <div className="action-icon-modern gradient-purple">
                      <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
                      </svg>
                    </div>
                    <h3>Room Management</h3>
                    <p>Manage room categories & availability</p>
                    <span className="action-arrow">→</span>
                  </div>

                  <div className="action-card modern" onClick={() => setSelectedView('facilities')}>
                    <div className="action-icon-modern gradient-orange">
                      <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34z"/>
                      </svg>
                    </div>
                    <h3>Facilities Setup</h3>
                    <p>Configure hostel amenities</p>
                    <span className="action-arrow">→</span>
                  </div>

                  {user.role === 'central_authority' && (
                    <Link to="/users" className="action-card modern">
                      <div className="action-icon-modern gradient-teal">
                        <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Z"/>
                          <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                        </svg>
                      </div>
                      <h3>User Management</h3>
                      <p>View and manage users</p>
                      <span className="action-arrow">→</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Recent Hostels */}
              <div className="recent-hostels">
              <div className="section-header-inline">
                  <h2>Your Hostels</h2>
                <Link to="/hostels" className="btn-view-all">View All →</Link>
              </div>
              
              {hostels.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-11z"/>
                  </svg>
                  <h3>No hostels yet</h3>
                  <p>Start by adding your first hostel property</p>
                  <Link to="/hostels/add" className="btn-primary-gradient mt-20">
                    Add Your First Hostel
                  </Link>
                </div>
              ) : (
                <div className="hostels-grid-modern">
                  {hostels.slice(0, 3).map(hostel => (
                    <div key={hostel._id} className="hostel-card-modern">
                      <div className="hostel-card-header">
                        <div>
                          <h3>{hostel.name}</h3>
                          <p className="hostel-location">
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                            </svg>
                            {hostel.location}
                          </p>
                        </div>
                        <div className="hostel-badges">
                          <span className={`badge-modern ${hostel.verified ? 'verified' : 'pending'}`}>
                            {hostel.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="hostel-stats-mini">
                        <div className="mini-stat">
                          <span className="mini-label">Rooms</span>
                          <span className="mini-value">{hostel.totalRooms || 0}</span>
                        </div>
                        <div className="mini-stat">
                          <span className="mini-label">Available</span>
                          <span className="mini-value">{hostel.availableRooms || 0}</span>
                        </div>
                        <div className="mini-stat">
                          <span className="mini-label">Rating</span>
                          <span className="mini-value">{hostel.rating || 0}/5</span>
                        </div>
                      </div>

                      <div className="hostel-amenities-preview">
                        {hostel.amenities?.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="amenity-badge">{amenity}</span>
                        ))}
                        {hostel.amenities?.length > 3 && (
                          <span className="amenity-badge more">+{hostel.amenities.length - 3} more</span>
                        )}
                      </div>

                      <div className="hostel-card-footer">
                        <div className="hostel-price-modern">
                          <span className="price-label">From</span>
                          <span className="price-value">₹{hostel.price?.toLocaleString()}</span>
                          <span className="price-period">/month</span>
                        </div>
                        <Link to={`/hostels/edit/${hostel._id}`} className="btn-edit-modern">
                          Edit Hostel →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </>
          )}

          {selectedView === 'rooms' && (
            <div className="room-management-section">
              <div className="section-header">
                <h2>Room Management</h2>
                <p>Manage room categories, availability, and pricing for all your hostels</p>
              </div>
              
              <div className="management-cards">
                {hostels.map(hostel => (
                  <div key={hostel._id} className="management-card">
                    <div className="card-header">
                      <h3>{hostel.name}</h3>
                      <Link to={`/hostels/edit/${hostel._id}`} className="btn-edit">Edit Details</Link>
                    </div>
                    <div className="card-body">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Total Rooms</span>
                          <span className="info-value">{hostel.totalRooms || 0}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Available</span>
                          <span className="info-value available">{hostel.availableRooms || 0}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Occupied</span>
                          <span className="info-value occupied">{(hostel.totalRooms || 0) - (hostel.availableRooms || 0)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Price/Month</span>
                          <span className="info-value price">₹{hostel.price?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="occupancy-bar">
                        <div className="occupancy-fill" style={{
                          width: `${hostel.totalRooms > 0 ? ((hostel.totalRooms - hostel.availableRooms) / hostel.totalRooms * 100) : 0}%`
                        }}></div>
                      </div>
                      <div className="room-actions">
                        <button 
                          className="btn-update-rooms"
                          onClick={() => openRoomUpdateModal(hostel)}
                        >
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                          </svg>
                          Update Room Status
                        </button>
                      </div>
                      <div className="room-categories">
                        <h4>Room Categories</h4>
                        <div className="category-tags">
                          <span className="category-tag">Single</span>
                          <span className="category-tag">Double</span>
                          <span className="category-tag">Triple</span>
                          <span className="category-tag">Dormitory</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'facilities' && (
            <div className="facilities-section">
              <div className="section-header">
                <h2>Facilities Management</h2>
                <p>Manage amenities and facilities offered at your hostels</p>
              </div>
              
              <div className="management-cards">
                {hostels.map(hostel => (
                  <div key={hostel._id} className="management-card">
                    <div className="card-header">
                      <h3>{hostel.name}</h3>
                      <Link to={`/hostels/edit/${hostel._id}`} className="btn-edit">Edit Facilities</Link>
                    </div>
                    <div className="card-body">
                      <div className="facilities-grid">
                        {hostel.amenities && hostel.amenities.length > 0 ? (
                          hostel.amenities.map((amenity, index) => (
                            <div key={index} className="facility-item">
                              <svg className="facility-icon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                              </svg>
                              <span className="facility-name">{amenity}</span>
                            </div>
                          ))
                        ) : (
                          <p className="no-facilities">No facilities added yet</p>
                        )}
                      </div>
                      <div className="add-facilities-prompt">
                        <p>Add more facilities to attract more students</p>
                        <Link to={`/hostels/edit/${hostel._id}`} className="btn-add-facility">+ Add Facilities</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedView === 'students' && (
            <div className="students-section">
              <div className="section-header">
                <h2>Student Management</h2>
                <p>Manage enrolled students and their hostel information</p>
              </div>
              
              <div className="students-overview">
                <div className="overview-card">
                  <div className="overview-icon">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Z"/>
                      <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    </svg>
                  </div>
                  <div className="overview-content">
                    <h3>{hostels.reduce((sum, h) => sum + ((h.totalRooms || 0) - (h.availableRooms || 0)), 0)}</h3>
                    <p>Total Students Enrolled</p>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-icon">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
                    </svg>
                  </div>
                  <div className="overview-content">
                    <h3>{hostels.length}</h3>
                    <p>Active Properties</p>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-icon">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                      <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                    </svg>
                  </div>
                  <div className="overview-content">
                    <h3>0</h3>
                    <p>Pending Applications</p>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-icon">
                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4z"/>
                    </svg>
                  </div>
                  <div className="overview-content">
                    <h3>₹{(stats.revenue / 1000).toFixed(0)}K</h3>
                    <p>Monthly Collection</p>
                  </div>
                </div>
              </div>

              <div className="students-table-container">
                <div className="table-header-actions">
                  <h3>Student Records</h3>
                  <div className="action-buttons-inline">
                    <input type="text" placeholder="Search students..." className="search-input" />
                    <button className="btn-primary">+ Add Student</button>
                  </div>
                </div>
                
                <div className="professional-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Hostel</th>
                        <th>Room No.</th>
                        <th>Phone</th>
                        <th>Check-in Date</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hostels.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="no-data">
                            <div className="empty-table-state">
                              <svg className="empty-icon" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
                              </svg>
                              <p>No students enrolled yet</p>
                              <small>Add hostels and start enrolling students</small>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        // Sample data - replace with actual student data from API
                        <tr>
                          <td colSpan="8" className="no-data">
                            <div className="empty-table-state">
                              <svg className="empty-icon" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Z"/>
                                <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                              </svg>
                              <p>Student management feature</p>
                              <small>This feature will display enrolled students. Integrate with your student database.</small>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedView === 'reports' && (
            <div className="reports-section">
              <div className="section-header">
                <h2>Analytics & Reports</h2>
                <p>Track performance and generate detailed reports</p>
              </div>
              
              <div className="reports-grid">
                <div className="report-card">
                  <div className="report-header">
                    <h3>Occupancy Trends</h3>
                    <select className="report-filter">
                      <option>Last 7 Days</option>
                      <option>Last Month</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  <div className="report-chart">
                    <div className="chart-placeholder">
                      <div className="chart-bar" style={{height: '60%'}}></div>
                      <div className="chart-bar" style={{height: '75%'}}></div>
                      <div className="chart-bar" style={{height: '80%'}}></div>
                      <div className="chart-bar" style={{height: '70%'}}></div>
                      <div className="chart-bar" style={{height: '85%'}}></div>
                      <div className="chart-bar" style={{height: '90%'}}></div>
                      <div className="chart-bar" style={{height: stats.occupancyRate + '%'}}></div>
                    </div>
                    <p className="chart-label">Current Occupancy: {stats.occupancyRate}%</p>
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-header">
                    <h3>Revenue Overview</h3>
                    <button className="btn-export">Export PDF</button>
                  </div>
                  <div className="revenue-stats">
                    <div className="revenue-item">
                      <span className="revenue-label">This Month</span>
                      <span className="revenue-value">₹{stats.revenue.toLocaleString()}</span>
                    </div>
                    <div className="revenue-item">
                      <span className="revenue-label">Collected</span>
                      <span className="revenue-value success">₹{(stats.revenue * 0.85).toFixed(0).toLocaleString()}</span>
                    </div>
                    <div className="revenue-item">
                      <span className="revenue-label">Pending</span>
                      <span className="revenue-value warning">₹{(stats.revenue * 0.15).toFixed(0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-header">
                    <h3>Top Performing Hostels</h3>
                  </div>
                  <div className="ranking-list">
                    {hostels.slice(0, 3).map((hostel, index) => (
                      <div key={hostel._id} className="ranking-item">
                        <span className="rank">#{index + 1}</span>
                        <div className="rank-info">
                          <strong>{hostel.name}</strong>
                          <small>{hostel.location}</small>
                        </div>
                        <span className="rank-occupancy">{hostel.totalRooms > 0 ? 
                          Math.round(((hostel.totalRooms - hostel.availableRooms) / hostel.totalRooms) * 100) : 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="report-card">
                  <div className="report-header">
                    <h3>Recent Activities</h3>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon success">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                        </svg>
                      </span>
                      <div className="activity-content">
                        <strong>Room Status Updated</strong>
                        <small>2 hours ago</small>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon info">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                        </svg>
                      </span>
                      <div className="activity-content">
                        <strong>New Student Enrolled</strong>
                        <small>5 hours ago</small>
                      </div>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon warning">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>
                      </span>
                      <div className="activity-content">
                        <strong>Payment Reminder Sent</strong>
                        <small>1 day ago</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Room Update Modal */}
          {showRoomUpdateModal && selectedHostel && (
            <div className="modal-overlay" onClick={() => setShowRoomUpdateModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Update Room Status - {selectedHostel.name}</h3>
                  <button className="modal-close" onClick={() => setShowRoomUpdateModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Occupied Rooms</label>
                    <input 
                      type="number" 
                      value={roomUpdate.occupied}
                      onChange={(e) => setRoomUpdate({...roomUpdate, occupied: parseInt(e.target.value) || 0})}
                      className="form-input"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Available Rooms</label>
                    <input 
                      type="number" 
                      value={roomUpdate.available}
                      onChange={(e) => setRoomUpdate({...roomUpdate, available: parseInt(e.target.value) || 0})}
                      className="form-input"
                      min="0"
                    />
                  </div>
                  <div className="info-box">
                    <p><strong>Total Rooms:</strong> {roomUpdate.occupied + roomUpdate.available}</p>
                    <p><strong>Occupancy Rate:</strong> {roomUpdate.occupied + roomUpdate.available > 0 ? 
                      Math.round((roomUpdate.occupied / (roomUpdate.occupied + roomUpdate.available)) * 100) : 0}%</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-secondary" onClick={() => setShowRoomUpdateModal(false)}>Cancel</button>
                  <button 
                    className="btn-primary" 
                    onClick={() => handleRoomUpdate(roomUpdate.hostelId, roomUpdate.occupied, roomUpdate.available)}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
