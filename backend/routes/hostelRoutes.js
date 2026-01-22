const express = require('express');
const router = express.Router();
const {
  getAllHostels,
  getHostelBySlug,
  getHostelById,
  getMyHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  toggleVerification,
  toggleFeatured,
  toggleActive
} = require('../controllers/hostelController');
const { protect, hostelAuthority, centralAuthority } = require('../middleware/auth');

// Public routes
router.get('/', getAllHostels);
router.get('/slug/:slug', getHostelBySlug);
router.get('/:id', getHostelById);

// Protected routes - Hostel Authority
router.get('/my/hostels', protect, hostelAuthority, getMyHostels);
router.post('/', protect, hostelAuthority, createHostel);
router.put('/:id', protect, hostelAuthority, updateHostel);
router.delete('/:id', protect, hostelAuthority, deleteHostel);

// Protected routes - Central Authority only
router.put('/:id/verify', protect, centralAuthority, toggleVerification);
router.put('/:id/featured', protect, centralAuthority, toggleFeatured);
router.put('/:id/toggle-active', protect, centralAuthority, toggleActive);

module.exports = router;
