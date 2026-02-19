# 👟 Shoe Store POS System

A full-stack, modern Point of Sale (POS) system built specifically for shoe stores with comprehensive inventory management, role-based authentication, and real-time stock tracking.

## 🚀 Features

### Authentication & Roles
- **User (Sales Staff)**: Access to POS, read-only inventory, customer management
- **Owner**: Full CRUD operations, reports, new arrivals, feature additions
- JWT-based authentication with bcrypt password hashing

### Inventory Management
- **Hierarchical Structure**: Brands → Shoe Types → Individual Shoes
- **Detailed Specs**: Size, Color, Quantity, Material, Price (MRP & Selling), Images
- **CRUD Operations**: Add/Edit/Delete at any level
- **Smart Search**: Filter by brand, type, size, color, stock level
- **Real-time Updates**: Automatic stock deduction on sales
- **Low Stock Alerts**: Visual warnings for products below threshold

### POS Interface
- Quick product search and barcode scanning
- Shopping cart with totals, discounts, taxes
- Multiple payment methods (Cash/Card/UPI)
- PDF invoice generation
- Trial room feature with temporary holds

### Advanced Features
- **New Arrivals**: Pre-add upcoming stock with expected dates
- **Customer Management**: Track purchase history, loyalty points
- **Dashboard Analytics**: Sales stats, revenue charts, inventory insights
- **Reports**: Daily/monthly sales, inventory reports (CSV/PDF export)
- **Trial Room**: Temporary inventory holds for customer trials

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- Chart.js
- React Icons
- jsPDF (invoice generation)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (image uploads)
- Bcrypt (password hashing)
- Express Validator

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shoe-store-pos
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

3. Seed database with demo data:
```bash
npm run seed
```

4. Start backend server:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 👤 Demo Credentials

### Owner Account
- **Email**: owner@shoestore.com
- **Password**: Owner@123

### Sales Staff Account
- **Email**: staff@shoestore.com
- **Password**: Staff@123

## 📁 Project Structure

```
shoe-store-pos/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Brand.js
│   │   ├── ShoeType.js
│   │   ├── Shoe.js
│   │   ├── Customer.js
│   │   ├── Sale.js
│   │   └── NewArrival.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── brands.js
│   │   ├── shoes.js
│   │   ├── customers.js
│   │   ├── sales.js
│   │   └── reports.js
│   ├── utils/
│   │   └── seedData.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── pos/
│   │   │   ├── customers/
│   │   │   └── reports/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── POS.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── NewArrivals.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🎨 Key Features Explained

### Inventory Hierarchy
The system organizes inventory in a three-level structure:
1. **Brands** (Nike, Adidas, etc.)
2. **Shoe Types** (Sports, Formal, Casual, etc.)
3. **Individual Shoes** (with size, color, quantity, specs)

### Trial Room Feature
- Mark shoes as "In Trial" to temporarily hold inventory
- Set trial duration
- Convert to sale or return to available stock
- Prevents overselling during customer trials

### New Arrivals
- Pre-register upcoming inventory
- Set expected arrival dates
- Automatic conversion to active inventory on arrival date
- Notification system for staff

### Customer Management
- Track customer purchase history
- Loyalty points system
- Quick customer lookup during checkout
- Export customer data

## 🚀 Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set build output: `dist`
5. Add environment variables
6. Deploy

## 🔒 Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure file upload validation

## 📊 Reports Available
- Daily/Monthly sales reports
- Inventory levels and valuation
- Low stock alerts
- Top-selling products
- Customer purchase patterns
- Revenue analytics

## 🎯 Future Enhancements
- Barcode/QR code scanning
- SMS/Email notifications
- Multi-store support
- Advanced analytics dashboard
- Supplier management
- Purchase order system
- Return/exchange management

## 📝 License
MIT

## 👥 Support
For issues or questions, please create an issue in the repository.

---

Built with ❤️ for shoe store owners and retail management
