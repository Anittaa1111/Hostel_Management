import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './HostelForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AddHostel({ user, onLogout }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    gender: 'Boys Only',
    price: '',
    description: '',
    amenities: '',
    images: '',
    distance: '',
    totalRooms: '',
    availableRooms: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Process amenities and images
      const amenitiesArray = formData.amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      const imagesArray = formData.images
        .split(',')
        .map(item => item.trim())
        .filter(item => item);

      const hostelData = {
        name: formData.name,
        location: formData.location,
        address: formData.address,
        gender: formData.gender,
        price: parseFloat(formData.price),
        description: formData.description,
        amenities: amenitiesArray,
        images: imagesArray,
        distance: formData.distance,
        totalRooms: parseInt(formData.totalRooms) || 0,
        availableRooms: parseInt(formData.availableRooms) || 0
      };

      const response = await fetch(`${API_URL}/hostels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(hostelData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create hostel');
      }

      alert('Hostel created successfully!');
      navigate('/hostels');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <div className="hostel-form-page">
        <div className="container">
          <div className="form-header">
            <h1>Add New Hostel</h1>
            <p>Fill in the details to register a new hostel</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="name">Hostel Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Patna"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Full Address *</label>
                <textarea
                  id="address"
                  name="address"
                  className="form-control textarea"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-3">
                <div className="form-group">
                  <label htmlFor="gender">Gender Type *</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-control"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Boys Only">Boys Only</option>
                    <option value="Girls Only">Girls Only</option>
                    <option value="Co-ed">Co-ed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price per Month (₹) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="distance">Distance from Main Area</label>
                  <input
                    type="text"
                    id="distance"
                    name="distance"
                    className="form-control"
                    value={formData.distance}
                    onChange={handleChange}
                    placeholder="e.g., 2 km from station"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="totalRooms">Total Rooms</label>
                  <input
                    type="number"
                    id="totalRooms"
                    name="totalRooms"
                    className="form-control"
                    value={formData.totalRooms}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="availableRooms">Available Rooms</label>
                  <input
                    type="number"
                    id="availableRooms"
                    name="availableRooms"
                    className="form-control"
                    value={formData.availableRooms}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control textarea"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your hostel..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="amenities">Amenities (comma-separated)</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  className="form-control"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="WiFi, Laundry, Mess, AC, etc."
                />
                <small className="form-help">Separate each amenity with a comma</small>
              </div>

              <div className="form-group">
                <label htmlFor="images">Image URLs (comma-separated)</label>
                <textarea
                  id="images"
                  name="images"
                  className="form-control textarea"
                  value={formData.images}
                  onChange={handleChange}
                  rows="3"
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
                <small className="form-help">Separate each image URL with a comma</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Hostel'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/hostels')}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddHostel;
