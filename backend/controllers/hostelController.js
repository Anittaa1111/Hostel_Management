const Hostel = require('../models/Hostel');

// @desc    Get all hostels (public)
// @route   GET /api/hostels
// @access  Public
const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ isActive: true })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hostel by slug
// @route   GET /api/hostels/slug/:slug
// @access  Public
const getHostelBySlug = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ slug: req.params.slug, isActive: true })
      .populate('owner', 'name email phone');
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hostel by ID
// @route   GET /api/hostels/:id
// @access  Public
const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hostels by owner
// @route   GET /api/hostels/my-hostels
// @access  Private (Hostel Authority)
const getMyHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new hostel
// @route   POST /api/hostels
// @access  Private (Hostel Authority)
const createHostel = async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      gender,
      price,
      description,
      amenities,
      images,
      distance,
      totalRooms,
      availableRooms
    } = req.body;

    // Validation
    if (!name || !location || !address || !gender || !price || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const hostel = await Hostel.create({
      name,
      location,
      address,
      gender,
      price,
      description,
      amenities: amenities || [],
      images: images || [],
      distance: distance || '',
      totalRooms: totalRooms || 0,
      availableRooms: availableRooms || 0,
      owner: req.user._id,
      verified: req.user.role === 'central_authority' // Auto-verify if central authority
    });

    res.status(201).json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update hostel
// @route   PUT /api/hostels/:id
// @access  Private (Hostel Authority - own hostels, Central Authority - all)
const updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Check ownership or central authority
    if (hostel.owner.toString() !== req.user._id.toString() && 
        req.user.role !== 'central_authority') {
      return res.status(403).json({ message: 'Not authorized to update this hostel' });
    }

    const updatedHostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedHostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete hostel
// @route   DELETE /api/hostels/:id
// @access  Private (Hostel Authority - own hostels, Central Authority - all)
const deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    // Check ownership or central authority
    if (hostel.owner.toString() !== req.user._id.toString() && 
        req.user.role !== 'central_authority') {
      return res.status(403).json({ message: 'Not authorized to delete this hostel' });
    }

    await Hostel.findByIdAndDelete(req.params.id);

    res.json({ message: 'Hostel deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle hostel verification (Central Authority only)
// @route   PUT /api/hostels/:id/verify
// @access  Private (Central Authority)
const toggleVerification = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    hostel.verified = !hostel.verified;
    await hostel.save();

    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle hostel featured status (Central Authority only)
// @route   PUT /api/hostels/:id/featured
// @access  Private (Central Authority)
const toggleFeatured = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    hostel.featured = !hostel.featured;
    await hostel.save();

    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle hostel active status (Central Authority only)
// @route   PUT /api/hostels/:id/toggle-active
// @access  Private (Central Authority)
const toggleActive = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }

    hostel.isActive = !hostel.isActive;
    await hostel.save();

    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
