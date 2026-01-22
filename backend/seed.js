const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Hostel = require('./models/Hostel');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Hostel.deleteMany({});
    console.log('Cleared existing data');

    // Create Central Authority
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const centralAuthority = await User.create({
      name: 'Central Admin',
      email: 'admin@hostel.com',
      password: hashedPassword,
      role: 'central_authority',
      phone: '9876543210',
      isActive: true,
      isVerified: true
    });

    console.log('✓ Created Central Authority user');

    // Create Hostel Authority
    const hostelAuthority = await User.create({
      name: 'Hostel Owner',
      email: 'owner@hostel.com',
      password: hashedPassword,
      role: 'hostel_authority',
      phone: '9876543211',
      isActive: true,
      isVerified: true
    });

    console.log('✓ Created Hostel Authority user');

    // Create Sample Hostels
    const hostels = [
      {
        name: 'Sunshine Hostel',
        location: 'Boring Road, Patna',
        address: '123, Boring Road, Near Patna Junction, Patna - 800001',
        gender: 'Co-ed',
        price: 8000,
        description: 'A premium hostel with modern amenities and excellent connectivity. Perfect for students and working professionals.',
        amenities: ['WiFi', 'AC', 'Laundry', 'Mess', 'TV', 'Gym'],
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'
        ],
        distance: '1 km from Patna Junction',
        totalRooms: 50,
        availableRooms: 12,
        rating: 4.5,
        reviews: 89,
        featured: true,
        verified: true,
        owner: hostelAuthority._id
      },
      {
        name: 'Green Valley Hostel',
        location: 'Kankarbagh, Patna',
        address: '456, Main Road, Kankarbagh, Patna - 800020',
        gender: 'Boys Only',
        price: 6500,
        description: 'Comfortable and affordable hostel for boys with 24/7 security and good food.',
        amenities: ['WiFi', 'Mess', 'Parking', 'Security', 'Common Room'],
        images: [
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'
        ],
        distance: '3 km from Patna Junction',
        totalRooms: 30,
        availableRooms: 8,
        rating: 4.2,
        reviews: 56,
        featured: true,
        verified: true,
        owner: hostelAuthority._id
      },
      {
        name: 'Rose Garden Hostel',
        location: 'Patliputra Colony, Patna',
        address: '789, Patliputra Colony, Patna - 800013',
        gender: 'Girls Only',
        price: 9000,
        description: 'Safe and secure hostel for girls with strict security measures and home-like atmosphere.',
        amenities: ['WiFi', 'AC', 'Laundry', 'Mess', 'CCTV', 'Security Guard'],
        images: [
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
        ],
        distance: '2.5 km from Patna Junction',
        totalRooms: 40,
        availableRooms: 15,
        rating: 4.7,
        reviews: 123,
        featured: true,
        verified: true,
        owner: hostelAuthority._id
      },
      {
        name: 'Student Paradise',
        location: 'Rajendra Nagar, Patna',
        address: '321, Rajendra Nagar, Near IT Park, Patna - 800016',
        gender: 'Co-ed',
        price: 7500,
        description: 'Modern hostel near IT companies and colleges with excellent facilities.',
        amenities: ['WiFi', 'Mess', 'Study Room', 'Parking', 'Power Backup'],
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'
        ],
        distance: '4 km from Patna Junction',
        totalRooms: 35,
        availableRooms: 10,
        rating: 4.3,
        reviews: 67,
        featured: false,
        verified: true,
        owner: hostelAuthority._id
      },
      {
        name: 'Budget Hostel',
        location: 'Gandhi Maidan, Patna',
        address: '654, Gandhi Maidan Area, Patna - 800004',
        gender: 'Boys Only',
        price: 5000,
        description: 'Affordable hostel with basic amenities for budget-conscious students.',
        amenities: ['WiFi', 'Mess', 'Common Room'],
        images: [
          'https://images.unsplash.com/photo-1564501049412-61c2a3083791'
        ],
        distance: '1.5 km from Patna Junction',
        totalRooms: 25,
        availableRooms: 5,
        rating: 3.8,
        reviews: 34,
        featured: false,
        verified: false,
        owner: hostelAuthority._id
      },
      {
        name: 'Luxury Stay Hostel',
        location: 'Bailey Road, Patna',
        address: '987, Bailey Road, Near Market, Patna - 800014',
        gender: 'Co-ed',
        price: 12000,
        description: 'Premium hostel with luxury amenities and excellent service.',
        amenities: ['WiFi', 'AC', 'Laundry', 'Mess', 'Gym', 'Swimming Pool', 'Gaming Room'],
        images: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'
        ],
        distance: '2 km from Patna Junction',
        totalRooms: 60,
        availableRooms: 20,
        rating: 4.8,
        reviews: 156,
        featured: true,
        verified: true,
        owner: hostelAuthority._id
      }
    ];

    await Hostel.insertMany(hostels);
    console.log(`✓ Created ${hostels.length} sample hostels`);

    console.log('\n========================================');
    console.log('Sample Data Seeded Successfully!');
    console.log('========================================\n');
    console.log('Login Credentials:');
    console.log('\nCentral Authority:');
    console.log('  Email: admin@hostel.com');
    console.log('  Password: admin123\n');
    console.log('Hostel Authority:');
    console.log('  Email: owner@hostel.com');
    console.log('  Password: admin123\n');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(seedData);
