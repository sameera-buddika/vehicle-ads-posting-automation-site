# 🚀 Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Checklist
- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] PostgreSQL running
- [ ] Git installed

## 1️⃣ Backend Setup (5 steps)

```bash
# Step 1: Navigate to backend
cd vehicle_posting_site_backend

# Step 2: Create virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Update database settings in settings.py
# Edit: vehicle_posting_site_backend/settings.py
# Update DATABASES section with your PostgreSQL credentials

# Step 5: Run migrations and start server
python manage.py migrate
python manage.py runserver
```

✅ Backend running at: http://localhost:8000

## 2️⃣ Frontend Setup (4 steps)

```bash
# Step 1: Open new terminal and navigate to frontend
cd vehicle-posting-site

# Step 2: Install dependencies
npm install

# Step 3: Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Step 4: Start development server
npm run dev
```

✅ Frontend running at: http://localhost:3000

## 3️⃣ Test the Application

1. Open browser: http://localhost:3000
2. Click "Register" to create account
3. Login with your credentials
4. Click "Post Your Vehicle" to create ad
5. Browse vehicles and test filtering

## 🎯 Default URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Admin Panel | http://localhost:8000/admin |

## 🔑 Create Admin User (Optional)

```bash
cd vehicle_posting_site_backend
python manage.py createsuperuser
```

## 🐛 Common Issues

### "Connection refused" error
- Ensure PostgreSQL is running
- Check database credentials in settings.py

### "Module not found" error
- Run `pip install -r requirements.txt` again
- Check virtual environment is activated

### "CORS error" in browser
- Ensure backend is running
- Check CORS_ALLOWED_ORIGINS in settings.py

### Frontend shows "Failed to fetch"
- Verify backend is running on port 8000
- Check .env.local has correct API URL

## 📱 Test Features

- ✅ User Registration
- ✅ User Login
- ✅ Post Vehicle Ad
- ✅ Browse All Vehicles
- ✅ Filter Vehicles
- ✅ View Vehicle Details
- ✅ Edit Own Vehicles
- ✅ Delete Own Vehicles
- ✅ My Ads Dashboard

## 🎨 Screenshots

After setup, you should see:
- Modern homepage with hero section
- Vehicle listing page with filters
- Detailed vehicle view
- User dashboard with posted ads

## 📞 Need Help?

Check the main [README.md](README.md) for detailed documentation!

---

**Ready to go! Start browsing and posting vehicles! 🚗**

