# Shoe-Store-POS

# 👟 Shoe Store POS System

A modern full-stack Point of Sale (POS) system designed for shoe retail businesses. This application allows store owners and staff to manage inventory, process sales, track customers, and monitor business performance efficiently.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* Secure login system using JWT
* Role-based access (Owner and Staff)
* Persistent login with localStorage

### 📦 Inventory Management

* Add, edit, delete shoes
* Track stock levels
* Brand management
* Low-stock monitoring

### 💳 Point of Sale (POS)

* Process customer purchases
* Real-time stock updates
* Invoice generation ready structure

### 👥 Customer Management

* Add and manage customer records
* Track purchase history

### 📊 Dashboard & Reports

* Sales overview
* Inventory insights
* Business performance monitoring

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt password hashing

### Database

* MongoDB (Local or Atlas)

---

## 📁 Project Structure

```
shoe-store-pos/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/shoe-store-pos.git
cd shoe-store-pos
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/shoe-store-pos
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open in browser:

http://localhost:5173


---

## 👤 Demo Accounts

Create manually using register API or database:

**Owner**


Email: owner@shoestore.com
Password: Owner@123
Role: owner


**Staff**


Email: staff@shoestore.com
Password: Staff@123
Role: user


---

## 🔐 Environment Variables

Backend `.env`

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

---

## 📡 API Base URL

```
http://localhost:5000/api
```

---

## 🧪 Future Improvements

* PDF invoice generation
* Sales analytics charts
* Low stock alerts
* Online deployment
* Multi-store support

---

## 👨‍💻 Author

Developed by Nishant Savaliya

---

## 📄 License

This project is licensed for educational and personal use.


