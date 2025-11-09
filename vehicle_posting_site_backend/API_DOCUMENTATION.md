# 📡 API Documentation

Complete API reference for Vehicle Ads Posting Site

## Base URL
```
http://localhost:8000
```

## Authentication

All endpoints except registration, login, and GET requests to vehicles require JWT authentication.

### Headers
```
Cookie: jwt=<token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone_number": "+94771234567",
  "nic_image_link": "https://example.com/nic.jpg"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+94771234567",
  "nic_image_link": "https://example.com/nic.jpg"
}
```

---

### Login
**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "jwt": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Note:** JWT token is also set as HTTP-only cookie.

---

### Get Current User
**GET** `/api/auth/user`

Get authenticated user's information.

**Headers:** Requires JWT cookie

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "+94771234567",
  "nic_image_link": "https://example.com/nic.jpg"
}
```

---

### Logout
**POST** `/api/auth/logout`

Logout user and clear JWT cookie.

**Headers:** Requires JWT cookie

**Response:** `200 OK`
```json
{
  "message": "success"
}
```

---

### Get All Users
**GET** `/api/auth/register`

Get list of all registered users.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "+94771234567"
  },
  ...
]
```

---

## 🚗 Vehicle Endpoints

### Get All Vehicles
**GET** `/api/vehicles/`

Get list of all vehicles or filter by authenticated user's vehicles.

**Query Parameters:**
- `mine` (optional): Set to `true` to get only your vehicles

**Example:**
```
GET /api/vehicles/
GET /api/vehicles/?mine=true
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "posted_by": 1,
    "category": 2,
    "manufacturer": "Toyota",
    "model": "Corolla",
    "city": "Colombo",
    "plate_number": "ABC-1234",
    "year": 2020,
    "vehicle_type": "Car",
    "engine_capacity": "1500cc",
    "transmission": "Automatic",
    "fuel_type": "Petrol",
    "mileage": "50000",
    "price": "5000000.00",
    "image": "/media/vehicles/car.jpg",
    "image_url": "http://localhost:8000/media/vehicles/car.jpg",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  },
  ...
]
```

---

### Get Single Vehicle
**GET** `/api/vehicles/{id}/`

Get detailed information about a specific vehicle.

**Parameters:**
- `id`: Vehicle ID

**Example:**
```
GET /api/vehicles/1/
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "posted_by": 1,
  "category": 2,
  "manufacturer": "Toyota",
  "model": "Corolla",
  "city": "Colombo",
  "plate_number": "ABC-1234",
  "year": 2020,
  "vehicle_type": "Car",
  "engine_capacity": "1500cc",
  "transmission": "Automatic",
  "fuel_type": "Petrol",
  "mileage": "50000",
  "price": "5000000.00",
  "image": "/media/vehicles/car.jpg",
  "image_url": "http://localhost:8000/media/vehicles/car.jpg",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

### Create Vehicle Ad
**POST** `/api/vehicles/`

Create a new vehicle advertisement.

**Headers:** 
- Requires JWT cookie
- `Content-Type: multipart/form-data`

**Form Data:**
```
manufacturer: "Toyota"
model: "Corolla"
city: "Colombo"
plate_number: "ABC-1234"
year: 2020
vehicle_type: "Car"
engine_capacity: "1500cc"
transmission: "Automatic"
fuel_type: "Petrol"
mileage: "50000"
price: "5000000"
image: [File]
category: 2 (optional)
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "posted_by": 1,
  "manufacturer": "Toyota",
  "model": "Corolla",
  ...
}
```

---

### Update Vehicle Ad
**PUT** `/api/vehicles/{id}/`

Update an existing vehicle advertisement.

**Headers:** 
- Requires JWT cookie
- Must be owner of the vehicle
- `Content-Type: multipart/form-data`

**Parameters:**
- `id`: Vehicle ID

**Form Data:** Same as Create (all fields optional)

**Response:** `200 OK`
```json
{
  "id": 1,
  "posted_by": 1,
  "manufacturer": "Toyota",
  "model": "Camry",
  ...
}
```

**Error Response:** `403 Forbidden`
```json
{
  "detail": "Not allowed"
}
```

---

### Delete Vehicle Ad
**DELETE** `/api/vehicles/{id}/`

Delete a vehicle advertisement.

**Headers:** 
- Requires JWT cookie
- Must be owner of the vehicle

**Parameters:**
- `id`: Vehicle ID

**Response:** `204 No Content`

**Error Response:** `403 Forbidden`
```json
{
  "detail": "Not allowed"
}
```

---

### Get Vehicle Categories
**GET** `/api/vehicles/categories/`

Get list of all vehicle categories.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Car"
  },
  {
    "id": 2,
    "name": "SUV"
  },
  ...
]
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid data provided",
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Unauthenticated!"
}
```

### 403 Forbidden
```json
{
  "detail": "Not allowed"
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## 📝 Notes

### Image Upload
- Supported formats: JPG, PNG, GIF, WEBP
- Max file size: Default Django limit (2.5MB)
- Images stored in: `media/vehicles/`

### Authentication
- JWT expires after 60 minutes
- Token stored in HTTP-only cookie
- Include cookie with all authenticated requests

### Permissions
- Any authenticated user can view all vehicles
- Only vehicle owner can edit/delete their vehicles
- Public can view vehicles without authentication

### Date Format
- ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- All timestamps in UTC

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Vehicles
```bash
curl -X GET http://localhost:8000/api/vehicles/ \
  -b cookies.txt
```

### Create Vehicle
```bash
curl -X POST http://localhost:8000/api/vehicles/ \
  -b cookies.txt \
  -F "manufacturer=Toyota" \
  -F "model=Corolla" \
  -F "price=5000000" \
  -F "image=@/path/to/image.jpg"
```

---

## 🔗 Frontend Integration

Example using JavaScript Fetch API:

```javascript
// Login
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

// Create Vehicle
const formData = new FormData();
formData.append('manufacturer', 'Toyota');
formData.append('model', 'Corolla');
formData.append('price', '5000000');
formData.append('image', imageFile);

const response = await fetch('http://localhost:8000/api/vehicles/', {
  method: 'POST',
  credentials: 'include',
  body: formData
});
```

---

**For more details, check the source code in `views.py` files!**

