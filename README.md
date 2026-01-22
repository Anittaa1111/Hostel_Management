# Hostel Management System

A comprehensive hostel management system with a public website, admin panel, and backend API.

## System Architecture

- **Backend**: Express.js + MongoDB + JWT Authentication
- **Admin Panel**: React.js with custom CSS
- **Website**: Next.js 14 with TypeScript and Tailwind CSS

## Features

### Backend API
- JWT-based authentication
- Role-based access control (Central Authority & Hostel Authority)
- RESTful API endpoints for hostels and users
- MongoDB database with Mongoose ODM
- Automatic slug generation for hostels

### Admin Panel
- **Login/Register**: Secure authentication system
- **Dashboard**: Overview of hostels and statistics
- **Hostel Management**: CRUD operations for hostels
- **User Management**: (Central Authority only)
  - View all users
  - Activate/deactivate users
  - Verify users
  - Delete users
- **Role-based Features**:
  - **Central Authority**: Full control over all hostels and users
  - **Hostel Authority**: Manage their own hostels only

### Website
- Browse hostels with advanced filtering
- Individual hostel detail pages with slugs
- Featured hostels showcase
- Responsive design
- Search by name/location
- Filter by gender type and price range

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation)
- npm or yarn

## Installation

### 1. Install MongoDB Locally

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically as a service

**Verify MongoDB is running:**
```powershell
mongod --version
```

### 2. Backend Setup

```powershell
cd backend
npm install
```

Create `.env` file in backend folder (already created):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel_management
JWT_SECRET=your_jwt_secret_key_change_this_in_production_2024
NODE_ENV=development
```

Start the backend server:
```powershell
npm run dev
```

The API will be available at `http://localhost:5000`

### 3. Admin Panel Setup

```powershell
cd admin
npm install
```

The `.env` file is already configured:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the admin panel:
```powershell
npm start
```

The admin panel will be available at `http://localhost:3000`

### 4. Website Setup

```powershell
cd website
npm install
```

The `.env.local` file is already configured:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the website:
```powershell
npm run dev
```

The website will be available at `http://localhost:3001` (or the next available port)

## Usage

### First Time Setup

1. **Start MongoDB**: Ensure MongoDB is running
2. **Start Backend**: `cd backend && npm run dev`
3. **Register Central Authority**:
   - Go to admin panel: `http://localhost:3000/register`
   - Create account with role "Central Authority"
4. **Login and Manage**: Access the dashboard to manage hostels and users

### User Roles

**Central Authority**
- Full access to all features
- Can verify hostels
- Can feature hostels
- Can activate/deactivate hostels
- Can manage all users
- Auto-verified hostels when created

**Hostel Authority**
- Can register and manage their own hostels
- Can edit their hostel information
- Cannot access user management
- Hostels need central authority verification

### API Endpoints

**Authentication**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

**Hostels (Public)**
- GET `/api/hostels` - Get all active hostels
- GET `/api/hostels/slug/:slug` - Get hostel by slug
- GET `/api/hostels/:id` - Get hostel by ID

**Hostels (Protected)**
- GET `/api/hostels/my/hostels` - Get user's hostels
- POST `/api/hostels` - Create hostel
- PUT `/api/hostels/:id` - Update hostel
- DELETE `/api/hostels/:id` - Delete hostel

**Hostels (Central Authority Only)**
- PUT `/api/hostels/:id/verify` - Toggle verification
- PUT `/api/hostels/:id/featured` - Toggle featured status
- PUT `/api/hostels/:id/toggle-active` - Toggle active status

**Users (Central Authority Only)**
- GET `/api/users` - Get all users
- PUT `/api/users/:id/toggle-active` - Toggle user active status
- PUT `/api/users/:id/verify` - Toggle user verification
- DELETE `/api/users/:id` - Delete user

## Project Structure

```
hostel-management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── hostelController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Hostel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hostelRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── admin/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Navbar.js
│   │   │   ├── HostelList.js
│   │   │   ├── AddHostel.js
│   │   │   ├── EditHostel.js
│   │   │   └── UserManagement.js
│   │   ├── App.js
│   │   └── App.css
│   ├── .env
│   └── package.json
└── website/
    ├── app/
    │   ├── hostel/
    │   │   └── [slug]/
    │   │       └── page.tsx
    │   ├── browsehostel/
    │   │   └── page.tsx
    │   └── page.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Hero.tsx
    │   ├── PopularHostels.tsx
    │   └── Footer.tsx
    ├── .env.local
    └── package.json
```

## Technologies Used

**Backend**
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing
- CORS - Cross-origin resource sharing
- slugify - URL slug generation

**Admin Panel**
- React.js - UI library
- React Router DOM - Routing
- Custom CSS - Styling

**Website**
- Next.js 14 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Framer Motion - Animations

## Default Login Credentials

After registering, use your credentials to login.

**Recommended First User:**
- Email: admin@hostel.com
- Password: admin123
- Role: Central Authority

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check if port 27017 is available
- Verify MONGODB_URI in backend/.env

**CORS Error:**
- Backend CORS is configured for all origins in development
- Check if backend is running on port 5000

**API Not Found:**
- Verify all three services are running
- Check environment variables in .env files
- Ensure correct ports are being used

## Development

**Backend Development:**
```powershell
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Admin Panel Development:**
```powershell
cd admin
npm start  # React development server
```

**Website Development:**
```powershell
cd website
npm run dev  # Next.js development server
```

## Production Deployment

1. Update JWT_SECRET in backend/.env to a secure random string
2. Update NODE_ENV to 'production'
3. Configure MongoDB connection for production
4. Build admin panel: `cd admin && npm run build`
5. Build website: `cd website && npm run build`
6. Use PM2 or similar for backend process management
7. Configure reverse proxy (nginx) for routing

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
