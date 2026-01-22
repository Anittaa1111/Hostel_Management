# Testing Guide - Hostel Management System

## Quick Start Testing

### 1. Setup and Seed Database

First, make sure MongoDB is running, then seed the database with sample data:

```powershell
cd backend
node seed.js
```

This will create:
- 2 users (Central Authority & Hostel Authority)
- 6 sample hostels with various configurations

**Test Credentials:**
- **Central Authority**: admin@hostel.com / admin123
- **Hostel Authority**: owner@hostel.com / admin123

### 2. Start All Services

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Admin Panel
cd admin
npm start

# Terminal 3 - Website
cd website
npm run dev
```

**Or use the quick start script:**
```powershell
.\start.ps1
```

## Test Scenarios

### A. Admin Panel Testing

#### 1. Registration & Login Flow

**Test New User Registration:**
1. Go to http://localhost:3000/register
2. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 1234567890
   - Role: Hostel Authority
   - Password: test123
   - Confirm Password: test123
3. Click Register
4. Verify success message
5. Redirected to login page
6. Login with test credentials

**Expected Results:**
✓ Registration successful
✓ Redirect to login
✓ Can login with new credentials
✓ Dashboard loads with user data

#### 2. Dashboard Testing

**Login as Central Authority (admin@hostel.com / admin123):**
1. View statistics cards
   - Total Hostels: 6
   - Active Hostels: 6
   - Verified Hostels: 5
2. Check quick actions available
3. View recent hostels (should show 3)

**Expected Results:**
✓ Statistics are correct
✓ All quick action cards visible
✓ Recent hostels displayed
✓ User role shown in navbar

#### 3. Hostel Management Testing

**Create New Hostel:**
1. Click "Add New Hostel"
2. Fill all required fields:
   - Name: Test Hostel
   - Location: Test Area
   - Address: Full address
   - Gender: Co-ed
   - Price: 8000
   - Description: Test description
   - Amenities: WiFi, Mess, AC (comma-separated)
   - Images: Valid image URLs
3. Click "Create Hostel"

**Expected Results:**
✓ Hostel created successfully
✓ Redirected to hostel list
✓ New hostel appears in list
✓ Slug auto-generated

**Edit Existing Hostel:**
1. Go to Hostels page
2. Click "Edit" on any hostel
3. Change price to 9000
4. Update amenities
5. Click "Update Hostel"

**Expected Results:**
✓ Hostel updated successfully
✓ Changes reflected immediately
✓ Slug remains unchanged

**Delete Hostel:**
1. Click "Delete" button
2. Confirm deletion
3. Check hostel list

**Expected Results:**
✓ Confirmation dialog appears
✓ Hostel removed from list
✓ Success message shown

#### 4. Central Authority Features

**Login as Central Authority:**

**Verify/Unverify Hostel:**
1. Go to Hostels page
2. Click "Verify" on unverified hostel
3. Check status badge changes

**Feature/Unfeature Hostel:**
1. Click "Feature" button
2. Verify featured badge appears

**Activate/Deactivate Hostel:**
1. Click "Deactivate" button
2. Status changes to Inactive

**User Management:**
1. Go to Users page
2. View all users
3. Test user filters:
   - All Users
   - Central Authority
   - Hostel Authority
   - Active/Inactive
4. Toggle user active status
5. Verify/unverify users
6. Delete test user (not yourself)

**Expected Results:**
✓ All operations work correctly
✓ Filters work properly
✓ Cannot delete own account
✓ Status changes reflect immediately

#### 5. Hostel Authority Features

**Login as Hostel Authority (owner@hostel.com / admin123):**

**Test Restrictions:**
1. Dashboard shows only their hostels
2. Cannot access Users page (menu item hidden)
3. Can only edit/delete own hostels
4. Cannot verify/feature/deactivate hostels

**Expected Results:**
✓ No access to central authority features
✓ Can manage own hostels only
✓ All other features work normally

### B. Website Testing

#### 1. Homepage Testing

1. Go to http://localhost:3001
2. Check all sections load:
   - Hero section
   - Popular Hostels (Featured ones)
   - Features
   - Stats
   - Why Choose Us
   - Footer
3. Click "View All Hostels"

**Expected Results:**
✓ All sections visible
✓ Featured hostels displayed (max 6)
✓ Images load correctly
✓ Navigation works

#### 2. Browse Hostels Page

**Filtering Tests:**
1. Use search bar: "Sunshine"
2. Filter by gender: "Boys Only"
3. Adjust price range slider
4. Change sort order:
   - Highest Rated
   - Most Reviewed
   - Price: Low to High
   - Price: High to Low

**Expected Results:**
✓ Search filters hostels by name/location
✓ Gender filter works
✓ Price range updates results
✓ Sorting works correctly
✓ Results count updates

#### 3. Hostel Detail Page

1. Click "View Details" on any hostel
2. Check URL has slug: `/hostel/[slug]`
3. Verify all information displays:
   - Images gallery
   - Name, location, rating
   - Description and address
   - Amenities list
   - Room availability
   - Price and owner details
4. Test image gallery (click thumbnails)

**Expected Results:**
✓ Slug-based URL works
✓ All hostel data displays
✓ Image gallery functional
✓ Owner information visible
✓ Buttons present (non-functional for now)

### C. Backend API Testing

Use Postman, Thunder Client, or curl for API testing.

#### 1. Authentication Endpoints

**Register:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "API Test User",
  "email": "apitest@example.com",
  "password": "test123",
  "role": "hostel_authority",
  "phone": "1234567890"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "apitest@example.com",
  "password": "test123"
}
```

**Get Current User:**
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN
```

#### 2. Hostel Endpoints

**Get All Hostels (Public):**
```bash
GET http://localhost:5000/api/hostels
```

**Get Hostel by Slug (Public):**
```bash
GET http://localhost:5000/api/hostels/slug/sunshine-hostel-1234567890
```

**Get My Hostels (Protected):**
```bash
GET http://localhost:5000/api/hostels/my/hostels
Authorization: Bearer YOUR_TOKEN
```

**Create Hostel (Protected):**
```bash
POST http://localhost:5000/api/hostels
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "API Test Hostel",
  "location": "Test Location",
  "address": "123 Test Street",
  "gender": "Co-ed",
  "price": 8000,
  "description": "Test hostel via API",
  "amenities": ["WiFi", "Mess"],
  "images": ["https://example.com/image.jpg"],
  "distance": "2 km",
  "totalRooms": 30,
  "availableRooms": 10
}
```

#### 3. User Management (Central Authority Only)

**Get All Users:**
```bash
GET http://localhost:5000/api/users
Authorization: Bearer CENTRAL_AUTHORITY_TOKEN
```

**Toggle User Active:**
```bash
PUT http://localhost:5000/api/users/:userId/toggle-active
Authorization: Bearer CENTRAL_AUTHORITY_TOKEN
```

### D. Error Handling Testing

#### Test Invalid Inputs:
1. Try to register with existing email
2. Login with wrong password
3. Access protected routes without token
4. Try to edit someone else's hostel (hostel authority)
5. Try to access user management (hostel authority)
6. Try invalid slug in URL

**Expected Results:**
✓ Appropriate error messages
✓ 401 for unauthorized
✓ 403 for forbidden
✓ 404 for not found
✓ 400 for validation errors

### E. Database Testing

**Connect to MongoDB:**
```powershell
mongosh
use hostel_management
```

**Check Collections:**
```javascript
show collections
db.users.find().pretty()
db.hostels.find().pretty()
```

**Verify Data:**
- Check slug generation
- Verify password hashing
- Check user roles
- Verify timestamps

## Common Issues and Solutions

### Issue: MongoDB Connection Error
**Solution:** 
- Check if MongoDB is running: `mongod`
- Verify connection string in .env
- Check port 27017 is not blocked

### Issue: CORS Error
**Solution:**
- Ensure backend is running
- Check API_URL in frontend .env files
- Clear browser cache

### Issue: Token Expired
**Solution:**
- Login again to get new token
- Check JWT_SECRET matches in backend

### Issue: Slug Not Working
**Solution:**
- Verify slug exists in database
- Check slug generation in Hostel model
- Re-seed database if needed

## Performance Testing

### Load Testing:
1. Create 50+ hostels
2. Test search and filter performance
3. Check pagination if implemented
4. Monitor API response times

### Browser Testing:
Test on:
- Chrome
- Firefox
- Edge
- Mobile browsers

## Security Testing

1. Try SQL injection in inputs
2. Test XSS vulnerabilities
3. Check password requirements
4. Verify JWT expiration
5. Test role-based access control

## Checklist

- [ ] All services start without errors
- [ ] Database seeded successfully
- [ ] Registration and login work
- [ ] Dashboard displays correct data
- [ ] CRUD operations work for hostels
- [ ] Role-based access control working
- [ ] Website displays hostels correctly
- [ ] Slug-based routing works
- [ ] Filters and search functional
- [ ] API endpoints respond correctly
- [ ] Error handling works properly
- [ ] All pages responsive

## Next Steps

After testing:
1. Document any bugs found
2. Test on different environments
3. Prepare for production deployment
4. Add additional features as needed
5. Implement booking functionality
6. Add payment integration
