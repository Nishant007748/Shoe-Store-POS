# ⚡ Quick Start Guide (5 Minutes)

Follow these steps to get your Shoe Store POS system running in 5 minutes!

## Step 1: Prerequisites Check ✓

Make sure you have installed:
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community))
- A code editor (VS Code recommended)

## Step 2: Backend Setup (2 minutes) 🔧

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shoe-store-pos
JWT_SECRET=my-super-secret-jwt-key-please-change-in-production-min-32-chars
NODE_ENV=development
EOF

# Start MongoDB (choose your OS)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB

# Seed the database with demo data
npm run seed

# Start the backend server
npm run dev
```

✅ Backend should now be running at http://localhost:5000

## Step 3: Frontend Setup (2 minutes) 🎨

Open a NEW terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

# Start the frontend
npm run dev
```

✅ Frontend should now be running at http://localhost:5173

## Step 4: Login & Explore (1 minute) 🎉

Open your browser and go to: **http://localhost:5173**

### Demo Accounts:

**👑 Owner Account (Full Access)**
- Email: `owner@shoestore.com`
- Password: `Owner@123`

**👤 Staff Account (Sales Only)**
- Email: `staff@shoestore.com`
- Password: `Staff@123`

## What's Included? 📦

After seeding, you'll have:
- ✅ 5 shoe brands (Nike, Adidas, Puma, Reebok, New Balance)
- ✅ 25 different shoe types
- ✅ 20 sample shoes with complete details
- ✅ 3 demo customers with purchase history
- ✅ 2 user accounts (owner and staff)

## First Steps 🚀

### As Owner:
1. Go to **Dashboard** - See sales analytics
2. Go to **Inventory** - View all shoes
3. Go to **POS** - Try making a sale
4. Go to **Reports** - See comprehensive analytics

### As Staff:
1. Go to **Dashboard** - View today's stats
2. Go to **POS** - Process sales
3. Go to **Customers** - Manage customer database

## Quick Features Test 🧪

### Test the POS:
1. Go to POS page
2. Search for "Nike" 
3. Click on a shoe to add to cart
4. Adjust quantity
5. Apply discount
6. Click "Checkout"
7. ✅ Sale complete!

### Test Inventory (Owner only):
1. Go to Inventory page
2. Use search to find shoes
3. Filter by brand
4. See stock levels

### Test Dashboard:
1. View today's revenue
2. See monthly stats
3. Check sales trend chart
4. View top selling shoes

## Troubleshooting 🔧

### MongoDB not connecting?
```bash
# Check if MongoDB is running
mongosh

# If not, start it:
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port already in use?
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill

# Kill process on port 5173
lsof -ti:5173 | xargs kill
```

### Can't login?
```bash
# Re-seed the database
cd backend
npm run seed
```

### See errors in browser?
- Open browser console (F12)
- Check for any error messages
- Make sure backend is running

## Next Steps 📚

- Read `FEATURES.md` for complete feature list
- Read `README.md` for detailed documentation
- Explore the code in `backend/` and `frontend/`
- Deploy to production (see README.md)

## Need Help? 💬

1. Check all terminals are running
2. Verify MongoDB is connected
3. Look at browser console for errors
4. Check backend terminal for error logs

## Production Deployment 🚀

Ready to deploy? See the "Production Deployment" section in README.md

---

**Enjoy your new Shoe Store POS System! 👟**
