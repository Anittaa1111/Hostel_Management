# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "hostel_authority",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "hostel_authority",
  "phone": "1234567890",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login User
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "hostel_authority",
  "phone": "1234567890",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "hostel_authority",
  "phone": "1234567890",
  "isActive": true,
  "isVerified": true,
  "createdAt": "2024-01-20T10:30:00.000Z"
}
```

---

### Update Profile
**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "9876543210",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe Updated",
  "email": "john@example.com",
  "role": "hostel_authority",
  "phone": "9876543210",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Hostel Endpoints (Public)

### Get All Hostels
**GET** `/hostels`

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Sunshine Hostel",
    "slug": "sunshine-hostel-1705748400000",
    "location": "Boring Road, Patna",
    "address": "123, Boring Road, Near Patna Junction, Patna - 800001",
    "gender": "Co-ed",
    "price": 8000,
    "description": "A premium hostel with modern amenities...",
    "amenities": ["WiFi", "AC", "Laundry", "Mess"],
    "images": ["https://example.com/image1.jpg"],
    "rating": 4.5,
    "reviews": 89,
    "distance": "1 km from Patna Junction",
    "totalRooms": 50,
    "availableRooms": 12,
    "featured": true,
    "verified": true,
    "isActive": true,
    "owner": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Hostel Owner",
      "email": "owner@hostel.com",
      "phone": "9876543211"
    },
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
]
```

---

### Get Hostel by Slug
**GET** `/hostels/slug/:slug`

**Example:** `/hostels/slug/sunshine-hostel-1705748400000`

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Sunshine Hostel",
  "slug": "sunshine-hostel-1705748400000",
  "location": "Boring Road, Patna",
  "address": "123, Boring Road, Near Patna Junction, Patna - 800001",
  "gender": "Co-ed",
  "price": 8000,
  "description": "A premium hostel with modern amenities...",
  "amenities": ["WiFi", "AC", "Laundry", "Mess"],
  "images": ["https://example.com/image1.jpg"],
  "rating": 4.5,
  "reviews": 89,
  "distance": "1 km from Patna Junction",
  "totalRooms": 50,
  "availableRooms": 12,
  "featured": true,
  "verified": true,
  "isActive": true,
  "owner": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Hostel Owner",
    "email": "owner@hostel.com",
    "phone": "9876543211"
  },
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}
```

---

### Get Hostel by ID
**GET** `/hostels/:id`

**Example:** `/hostels/507f1f77bcf86cd799439011`

**Response:** Same as Get by Slug

---

## Hostel Endpoints (Protected)

### Get My Hostels
**GET** `/hostels/my/hostels`

**Headers:** `Authorization: Bearer <token>`

**Access:** Hostel Authority or Central Authority

**Response:** Array of hostels owned by the authenticated user

---

### Create Hostel
**POST** `/hostels`

**Headers:** `Authorization: Bearer <token>`

**Access:** Hostel Authority or Central Authority

**Body:**
```json
{
  "name": "New Hostel",
  "location": "Patna",
  "address": "Full address here",
  "gender": "Co-ed",
  "price": 8000,
  "description": "Detailed description...",
  "amenities": ["WiFi", "Mess", "AC"],
  "images": ["https://example.com/image1.jpg"],
  "distance": "2 km from station",
  "totalRooms": 30,
  "availableRooms": 10
}
```

**Response:** Created hostel object (automatically verified if created by Central Authority)

---

### Update Hostel
**PUT** `/hostels/:id`

**Headers:** `Authorization: Bearer <token>`

**Access:** Hostel Authority (own hostels) or Central Authority (all hostels)

**Body:** Same as Create Hostel (all fields optional)

**Response:** Updated hostel object

---

### Delete Hostel
**DELETE** `/hostels/:id`

**Headers:** `Authorization: Bearer <token>`

**Access:** Hostel Authority (own hostels) or Central Authority (all hostels)

**Response:**
```json
{
  "message": "Hostel deleted successfully"
}
```

---

## Hostel Endpoints (Central Authority Only)

### Toggle Verification
**PUT** `/hostels/:id/verify`

**Headers:** `Authorization: Bearer <token>`

**Access:** Central Authority only

**Response:** Updated hostel with toggled `verified` status

---

### Toggle Featured
**PUT** `/hostels/:id/featured`

**Headers:** `Authorization: Bearer <token>`

**Access:** Central Authority only

**Response:** Updated hostel with toggled `featured` status

---

### Toggle Active Status
**PUT** `/hostels/:id/toggle-active`

**Headers:** `Authorization: Bearer <token>`

**Access:** Central Authority only

**Response:** Updated hostel with toggled `isActive` status

---

## User Management Endpoints (Central Authority Only)

### Get All Users
**GET** `/users`

**Headers:** `Authorization: Bearer <token>`

**Access:** Central Authority only

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "hostel_authority",
    "phone": "1234567890",
    "isActive": true,
    "isVerified": true,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
]
```

---

### Toggle User Active Status
**PUT** `/users/:id/toggle-active`

**Headers:** `Authorization: Bearer <token>`

**Access:** Central Authority only

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "hostel_authority",
  "isActive": false
}
```

---

### Toggle User Verification
**PUT** `/users/:id/verify`

**Headers:** `Authorization: Bearer <token>`

**Access:** Central Authority only

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "hostel_authority",
  "isVerified": true
}
```

---

### Delete User
**DELETE** `/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Access:** Central Authority only

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Central authority only."
}
```

### 404 Not Found
```json
{
  "message": "Hostel not found"
}
```

### 500 Server Error
```json
{
  "message": "Something went wrong!"
}
```

---

## User Roles

### Central Authority
- Full access to all endpoints
- Can verify/feature hostels
- Can manage all users
- Can edit/delete any hostel
- Auto-verified hostels when created

### Hostel Authority
- Can create hostels
- Can edit/delete own hostels only
- Cannot verify/feature hostels
- No access to user management
- Hostels require verification by Central Authority

---

## Rate Limiting

Currently, there are no rate limits implemented. For production, consider:
- 100 requests per 15 minutes per IP for public endpoints
- 1000 requests per 15 minutes for authenticated users

---

## Pagination

Currently, all endpoints return full results. For large datasets, consider implementing:
- Query parameters: `?page=1&limit=10`
- Response format:
```json
{
  "data": [...],
  "page": 1,
  "totalPages": 5,
  "total": 50
}
```

---

## Postman Collection

Import this collection to test all endpoints:

1. Create new collection "Hostel Management API"
2. Add environment variables:
   - `baseUrl`: http://localhost:5000/api
   - `token`: (will be set after login)
3. Add all endpoints listed above
4. Use `{{baseUrl}}` and `{{token}}` in requests

---

## WebSocket Support

Not implemented. For real-time features (e.g., room availability updates), consider:
- Socket.io integration
- Real-time notifications
- Live booking updates
