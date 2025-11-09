# 🚗 Vehicle Ads Posting Automation Site

A full-stack web application for posting and browsing vehicle advertisements. Built with Django REST Framework (Backend) and Next.js (Frontend).

## 📋 Features

### User Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Post Vehicle Ads**: Create detailed vehicle listings with images
- **Browse Vehicles**: Search and filter through available vehicles
- **Manage Ads**: Edit and delete your own vehicle listings
- **Responsive Design**: Modern UI that works on all devices

### Vehicle Categories
- Cars
- SUVs
- Vans
- Bikes
- Three-Wheelers
- Trucks
- Lorries

### Technical Features
- **RESTful API**: Clean API design with Django REST Framework
- **JWT Authentication**: Secure token-based authentication
- **Image Upload**: Support for vehicle images
- **Advanced Filtering**: Search by manufacturer, model, price range, vehicle type
- **Protected Routes**: Authentication-based access control
- **CORS Enabled**: Seamless frontend-backend communication

## 🛠️ Technology Stack

### Backend
- **Django 4.2+**: Python web framework
- **Django REST Framework**: API development
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Pillow**: Image processing

### Frontend
- **Next.js 15**: React framework
- **React 19**: UI library
- **Tailwind CSS 4**: Styling
- **TypeScript**: Type safety

## 📁 Project Structure

```
vehicle-ads-posting-automation-site/
├── vehicle_posting_site_backend/     # Django Backend
│   ├── ads_post/                     # Vehicle ads app
│   ├── users/                        # User authentication app
│   ├── vehicle_posting_site_backend/ # Main project settings
│   ├── media/                        # Uploaded images
│   ├── manage.py
│   └── requirements.txt
│
└── vehicle-posting-site/             # Next.js Frontend
    ├── app/                          # Next.js app directory
    │   ├── components/               # Reusable components
    │   ├── vehicles/                 # Vehicle pages
    │   ├── my-ads/                   # User's ads page
    │   ├── post/                     # Post vehicle page
    │   ├── login/                    # Login page
    │   └── register/                 # Registration page
    ├── contexts/                     # React contexts
    ├── lib/                          # API services
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd vehicle_posting_site_backend
   ```

2. **Create and activate virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Database**
   
   Update `vehicle_posting_site_backend/settings.py` with your PostgreSQL credentials:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'your_database_name',
           'USER': 'your_username',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd vehicle-posting-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API URL**
   
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Frontend will be available at: `http://localhost:3000`

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/user` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Vehicle Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles/` | Get all vehicles |
| GET | `/api/vehicles/?mine=true` | Get user's vehicles |
| GET | `/api/vehicles/{id}/` | Get single vehicle |
| POST | `/api/vehicles/` | Create vehicle ad |
| PUT | `/api/vehicles/{id}/` | Update vehicle ad |
| DELETE | `/api/vehicles/{id}/` | Delete vehicle ad |
| GET | `/api/vehicles/categories/` | Get vehicle categories |

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns JWT token
3. Token is stored in HTTP-only cookie
4. Token is sent with each request
5. Server validates token before processing requests

## 📝 Usage Guide

### For Buyers
1. Visit the homepage
2. Browse vehicles or use filters
3. Click on a vehicle to view details
4. Contact seller (requires login)

### For Sellers
1. Register/Login to your account
2. Click "Post Your Vehicle"
3. Fill in vehicle details and upload image
4. Submit to publish your ad
5. Manage your ads from "My Ads" page

## 🎨 Key Features Explained

### Vehicle Filtering
- Search by manufacturer, model, or city
- Filter by vehicle type
- Set price range (min/max)
- Real-time filtering without page reload

### Image Upload
- Support for vehicle images
- Preview before upload
- Automatic image URL generation
- Stored in Django media folder

### User Dashboard
- View all your posted vehicles
- Edit vehicle details
- Delete vehicles
- Quick statistics

## 🔧 Configuration

### Django Settings

Key settings in `settings.py`:

```python
# CORS Configuration
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# JWT Secret
JWT_SECRET = SECRET_KEY
```

### Next.js Configuration

API integration in `lib/api.js`:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error**
- Ensure PostgreSQL is running
- Check database credentials in settings.py
- Verify database exists

**CORS Errors**
- Check CORS_ALLOWED_ORIGINS in settings.py
- Ensure frontend URL is included

**Image Upload Issues**
- Check MEDIA_ROOT and MEDIA_URL settings
- Ensure media folder has write permissions

### Frontend Issues

**API Connection Failed**
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Inspect browser console for errors

**Authentication Not Working**
- Clear browser cookies
- Check JWT_SECRET in Django settings
- Ensure credentials: 'include' in API calls

## 📦 Deployment

### Backend Deployment

1. Set DEBUG=False in production
2. Configure proper SECRET_KEY
3. Set up static/media file serving
4. Use production database
5. Configure ALLOWED_HOSTS

### Frontend Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Update API URL for production
3. Deploy to Vercel, Netlify, or similar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer Notes

### Adding New Vehicle Fields

1. Update model in `ads_post/models.py`
2. Create migration: `python manage.py makemigrations`
3. Apply migration: `python manage.py migrate`
4. Update serializer in `ads_post/serializers.py`
5. Update frontend forms

### Adding New Features

Backend:
1. Create new views in respective app
2. Add URL patterns
3. Update serializers if needed

Frontend:
1. Create new page in `app/` directory
2. Update API service in `lib/api.js`
3. Add navigation links if needed

## 📞 Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include error messages and steps to reproduce

## 🎉 Acknowledgments

- Django REST Framework documentation
- Next.js documentation
- Tailwind CSS team
- Open source community

---

**Happy Vehicle Trading! 🚗💨**

