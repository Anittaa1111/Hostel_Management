import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <h2>Hostel Management</h2>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/hostels" className="nav-link">My Hostels</Link>
          {user.role === 'central_authority' && (
            <Link to="/users" className="nav-link">Users</Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-name">{user.name}</span>
          <span className="user-role">({user.role === 'central_authority' ? 'Central Authority' : 'Hostel Authority'})</span>
          <button onClick={onLogout} className="btn btn-secondary btn-sm">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
