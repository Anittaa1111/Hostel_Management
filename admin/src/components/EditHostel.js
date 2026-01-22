import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './HostelForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EditHostel({ user, onLogout }) {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHostel();
  }, [id]);

  const fetchHostel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/hostels/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hostel');
      }

      const hostel = await response.json();
      
      setFormData({
        name: hostel.name,
        location: hostel.location,
        address: hostel.address,
        gender: hostel.gender,
        price: hostel.price,
        description: hostel.description,
        amenities: hostel.amenities.join(', '),
        images: hostel.images.join(', '),
        distance: hostel.distance || '',
        totalRooms: hostel.totalRooms || '',
        availableRooms: hostel.availableRooms || ''
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

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

      const response = await fetch(`${API_URL}/hostels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(hostelData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update hostel');
      }

      alert('Hostel updated successfully!');
      navigate('/hostels');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
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
      <Navbar user={user} onLogout={onLogout} />
      <div className="hostel-form-page">
        <div className="container">
          <div className="form-header">
            <h1>Edit Hostel</h1>
            <p>Update hostel information</p>
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
                />
                <small className="form-help">Separate each image URL with a comma</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Updating...' : 'Update Hostel'}
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

export default EditHostel;
