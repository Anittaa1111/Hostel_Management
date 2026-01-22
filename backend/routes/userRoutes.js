const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  toggleUserActive,
  toggleUserVerification,
  deleteUser
} = require('../controllers/userController');
const { protect, centralAuthority } = require('../middleware/auth');

// All routes are for Central Authority only
router.use(protect, centralAuthority);

router.get('/', getAllUsers);
router.put('/:id/toggle-active', toggleUserActive);
router.put('/:id/verify', toggleUserVerification);
router.delete('/:id', deleteUser);

module.exports = router;
