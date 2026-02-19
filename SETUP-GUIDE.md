# 🚀 Complete Setup Guide - Shoe Store POS System

## Prerequisites
- Node.js 18+ installed
- MongoDB installed (local or Atlas URI)
- Git (optional, for cloning)

## Quick Start (5 minutes)

### Step 1: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shoe-store-pos
JWT_SECRET=your-secure-random-string-here-min-32-characters
NODE_ENV=development
```

Start MongoDB (if local):
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

Seed the database:
```bash
npm run seed
```

Start backend server:
```bash
npm run dev
```

Backend will run on: http://localhost:5000

### Step 2: Frontend Setup
Open new terminal:
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend will run on: http://localhost:5173

### Step 3: Login
Open browser: http://localhost:5173

**Owner Account:**
- Email: owner@shoestore.com
- Password: Owner@123

**Staff Account:**
- Email: staff@shoestore.com
- Password: Staff@123

## Features Available

### For All Users (Owner + Staff):
✅ Dashboard with sales analytics
✅ POS/Sales interface with cart
✅ Inventory viewing (read-only for staff)
✅ Customer management
✅ Invoice generation (PDF)

### Owner Only:
✅ Full inventory CRUD operations
✅ Add/Edit/Delete shoes, brands, types
✅ Stock quantity management
✅ New arrivals management
✅ Comprehensive reports
✅ Sales & performance analytics

## Production Deployment

### Backend (Railway/Render)
1. Push to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect to Vercel/Netlify
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set VITE_API_URL to backend URL
6. Deploy

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running
- Verify MONGODB_URI in .env
- For Atlas, whitelist your IP

### Port Already in Use
- Change PORT in backend .env
- Update VITE_API_URL in frontend .env

### Login Not Working
- Run `npm run seed` again
- Clear browser cache
- Check browser console for errors

## Support
For issues, check console logs in both terminal windows.
