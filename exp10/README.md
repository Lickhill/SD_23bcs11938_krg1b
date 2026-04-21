# 🛍️ Lickhill E-Commerce Platform

A full-stack e-commerce application built with **React**, **Node.js**, **Express**, and **PostgreSQL (Prisma ORM)**. Features include product catalog, shopping cart, orders, admin dashboard, and user authentication.

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Project Overview](#project-overview)
   - [Backend](#backend)
   - [Frontend](#frontend)
   - [Admin Dashboard](#admin-dashboard)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Features](#features)
11. [Troubleshooting](#troubleshooting)

---

## 📁 Project Structure

```
scalarAI/
├── backend/                 # Node.js Express API server
│   ├── config/             # Configuration files (DB, Email, Cloudinary)
│   ├── controllers/        # Business logic handlers
│   ├── middleware/         # Authentication, multer file uploads
│   ├── prisma/             # Database schema & migrations
│   ├── routes/             # API route definitions
│   ├── server.js           # Express server
│   ├── start.js            # Production start script
│   └── package.json
├── frontend/               # React customer application (Vite)
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components (Home, Collection, Cart, etc)
│   │   ├── context/       # ShopContext (global state)
│   │   ├── assets/        # Images & icons
│   │   ├── data/          # Categories, static data
│   │   ├── App.jsx        # Main app component
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # Entry point
│   ├── vite.config.js
│   └── package.json
├── admin/                  # React admin dashboard (Vite)
│   ├── src/
│   │   ├── components/    # Admin components
│   │   ├── pages/         # Admin pages (Add, List, Orders)
│   │   ├── assets/        # Admin assets
│   │   └── App.jsx        # Admin app
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ✅ Prerequisites

Before installing, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)
- **Git** - [Download](https://git-scm.com/)
- **Cloudinary Account** (for image uploads) - [Sign up](https://cloudinary.com/)

### Verify Installation

```bash
node --version
npm --version
psql --version
```

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Lickhill/scalarAIEcom.git
cd scalarAI
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

#### Admin
```bash
cd ../admin
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/lickhill_db"

# JWT Secret (for authentication)
JWT_SECRET="your_super_secret_jwt_key_here_at_least_32_chars"

# Cloudinary Configuration (Image uploads)
CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Email Configuration (for order notifications - optional)
EMAIL_USER="your_email@gmail.com"
EMAIL_PASSWORD="your_email_password_or_app_password"

# Server Port
PORT=4000

# Admin Authentication Token (for admin routes)
ADMIN_EMAIL="admin@lickhill.com"
```

**How to get these?**

- **Database URL**: Created when you set up PostgreSQL
- **JWT Secret**: Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com/) → Dashboard → API Keys
- **Email credentials**: Use Gmail app password (2FA required)

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
# Backend API URL
VITE_BACKEND_URL="http://localhost:4000"
```

### Admin (.env)

Create a `.env` file in the `admin/` directory:

```env
# Backend API URL
VITE_BACKEND_URL="http://localhost:4000"
```

---

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

```bash
# Open PostgreSQL shell
psql -U postgres

# Create database
CREATE DATABASE lickhill_db;

# Exit
\q
```

### 2. Run Prisma Migrations

```bash
cd backend

# Create tables based on schema
npx prisma migrate deploy

# (Optional) Seed database with sample data
npx prisma db seed
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. View Database (Optional)

```bash
# Open Prisma Studio GUI
npx prisma studio
```

---

## 🚀 Running the Application

### Option 1: Run All Services (Recommended for Development)

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:4000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

#### Terminal 3 - Admin
```bash
cd admin
npm run dev
```
Admin runs on `http://localhost:5174`

### Option 2: Production Build

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Build Admin
```bash
cd admin
npm run build
```

#### Start Backend (Production)
```bash
cd backend
npm start
```

---

## 📖 Project Overview

### Backend (Node.js + Express)

**Purpose**: REST API server handling all business logic

**Key Features**:
- User authentication (JWT)
- Product management (CRUD operations)
- Shopping cart management
- Order processing
- Admin authentication
- Image uploads to Cloudinary

**Key Files**:
```
backend/
├── server.js              # Express app setup
├── controllers/
│   ├── userController.js  # User auth & profile
│   ├── productController.js # Product CRUD
│   ├── cartController.js  # Cart operations
│   └── orderController.js # Order processing
├── routes/
│   ├── userRoute.js
│   ├── productRoute.js
│   ├── cartRoute.js
│   └── orderRoutes.js
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── adminAuth.js       # Admin verification
│   └── multer.js          # File upload config
└── prisma/
    ├── schema.prisma      # Database schema
    └── migrations/        # DB version history
```

**API Endpoints**:
```
Authentication:
  POST /api/user/register
  POST /api/user/login
  POST /api/user/logout

Products:
  GET  /api/product/list
  POST /api/product/add (admin)
  POST /api/product/remove (admin)
  POST /api/product/single

Cart:
  POST /api/cart/add
  POST /api/cart/get
  POST /api/cart/update

Orders:
  POST /api/orders/place
  GET  /api/orders/list
  POST /api/orders/status (admin)
```

---

### Frontend (React + Vite)

**Purpose**: Customer-facing e-commerce web application

**Key Features**:
- Browse products by category
- Search functionality
- Shopping cart
- User authentication
- Order placement (Cash on Delivery)
- Order history
- Wishlist
- Responsive mobile design

**Key Components**:
```
frontend/src/
├── pages/
│   ├── Home.jsx         # Landing page with banners
│   ├── Collection.jsx   # Product listing with filters
│   ├── Product.jsx      # Product detail page
│   ├── Cart.jsx         # Shopping cart
│   ├── PlaceOrder.jsx   # Checkout page
│   ├── Orders.jsx       # Order history
│   ├── Wishlist.jsx     # Saved items
│   └── Login.jsx        # Auth page
├── components/
│   ├── Navbar.jsx       # Header with search & categories
│   ├── SearchBar.jsx    # Search functionality
│   ├── ProductItem.jsx  # Product card
│   ├── CartTotal.jsx    # Cart summary
│   └── Footer.jsx       # Footer
├── context/
│   └── ShopContext.jsx  # Global state (cart, user, products)
└── assets/
    └── categories.js    # Category data
```

**State Management**:
- Uses React Context API (`ShopContext`)
- Manages: products, cart, user auth, search

**Styling**:
- Tailwind CSS for responsive design
- Mobile-first approach
- Categories & search bar accessible on mobile

---

### Admin Dashboard (React + Vite)

**Purpose**: Administrative interface for managing products, orders, and users

**Key Features**:
- Add/Edit/Delete products with image uploads
- View all products
- Manage orders (view status, update status)
- View sales analytics
- Admin authentication

**Key Pages**:
```
admin/src/pages/
├── Add.jsx          # Add new products
├── List.jsx         # View all products with edit/delete
├── Orders.jsx       # Manage customer orders
└── Login.jsx        # Admin login
```

**Admin Routes**:
- Protected with admin authentication
- Admin token in JWT payload
- Access via: `http://localhost:5174`

**Default Admin Credentials** (set in .env):
```
Email: admin@lickhill.com
Password: (set during first registration or in database)
```

---

## 🗄️ Database Schema

### User Table
```prisma
model User {
  id        String   @id @default(cuid())      # Unique ID
  name      String                             # Full name
  email     String   @unique                   # Unique email
  password  String                             # Hashed password
  cartData  Json     @default("{}")            # Cart items (flexible JSON)
  wishlist  String[] @default([])              # Array of product IDs
  orders    Order[]                            # Related orders
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Product Table
```prisma
model Product {
  id            String   @id @default(cuid())
  name          String                         # Product name
  description   String                         # Detailed description
  price         Int                            # Price in rupees
  image         String[]                       # Array of image URLs
  category      String                         # Category (Fashion, Mobiles, etc)
  subcategory   String                         # Subcategory (Standard, Premium, etc)
  sizes         String[]                       # Available sizes (S, M, L, etc)
  bestseller    Boolean  @default(false)       # Is bestseller?
  stock         Int      @default(0)           # Inventory count
  specification String   @default("")          # Product specifications
  date          BigInt                         # Created timestamp (milliseconds)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Order Table
```prisma
model Order {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(...)        # Link to user
  items         Json                           # Order items (flexible JSON)
  amount        Int                            # Total amount
  address       Json                           # Delivery address (flexible)
  status        String   @default("Order Placed")
  paymentMethod String                         # Payment type (COD)
  payment       Boolean  @default(false)       # Payment status
  date          BigInt                         # Order timestamp
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

**Key Design Decisions**:
- JSON fields for flexibility (cart, address, items)
- Array fields for lists (sizes, images, wishlist)
- BigInt for timestamps (milliseconds from Date.now())
- Cascade delete: deleting user auto-deletes their orders

---

## ✨ Features

### Customer Features
✅ User registration & login  
✅ Browse products by category  
✅ Search products  
✅ Add to cart & manage quantities  
✅ Wishlist functionality  
✅ Checkout with delivery address  
✅ Cash on Delivery payment  
✅ View order history  
✅ Responsive mobile design  

### Admin Features
✅ Add/Edit/Delete products  
✅ Upload product images to Cloudinary  
✅ Manage product categories  
✅ View all orders  
✅ Update order status  
✅ Admin authentication  

### Technical Features
✅ JWT authentication  
✅ Password hashing with bcrypt  
✅ Image uploads with Cloudinary  
✅ PostgreSQL database with Prisma ORM  
✅ REST API with Express  
✅ React Context for state management  
✅ Tailwind CSS for styling  
✅ Mobile-responsive design  

---

## 🐛 Troubleshooting

### "Connection refused" - Database Error

**Problem**: Backend can't connect to PostgreSQL

**Solution**:
```bash
# Check PostgreSQL service
# Windows: Services app → Search "PostgreSQL"
# Mac: brew services list | grep postgres
# Linux: sudo systemctl status postgresql

# Verify credentials in .env
# Test connection:
psql -U postgres -d lickhill_db
```

### "PORT 4000 already in use"

```bash
# Windows: Find and kill process
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :4000
kill -9 <PID>
```

### Cloudinary Upload Error

**Problem**: Images not uploading

**Solution**:
- Verify Cloudinary credentials in .env
- Check `backend/config/cloudinary.js` configuration
- Ensure file size < 2MB
- Use supported formats (jpg, png, webp)

### Module Not Found Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or regenerate Prisma client
cd backend
npx prisma generate
```

### Prisma Migration Failed

```bash
# Check migration status
npx prisma migrate status

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or manually resolve
npx prisma migrate resolve --rolled-back <migration_name>
```

---

## 📝 Development Tips

### Common npm Commands

**Backend**:
```bash
npm run dev          # Start with nodemon
npm run build        # Generate Prisma client
npm start            # Production start
```

**Frontend & Admin**:
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code quality
npm run preview      # Preview production build
```

### Adding New Features

**Adding a new product field**:
1. Update `backend/prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name add_new_field`
3. Update controllers to handle new field
4. Update frontend components

**Adding new API route**:
1. Create controller function in `backend/controllers/`
2. Create route in `backend/routes/`
3. Register in `backend/server.js`
4. Use in frontend with axios

**Adding Cloudinary upload**:
1. Add multer middleware to route
2. Controller automatically uploads with cloudinary config
3. Returns secure_url for database storage

---

## 🚀 Deployment

### Deploy Backend (Vercel/Railway/Render)

```bash
# Ensure vercel.json exists
# Push to GitHub → Connect repo → Deploy
```

### Deploy Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Ensure .env Variables in Production

Set all environment variables in your deployment platform's dashboard.

---

## 📞 Support & Contact

For issues, questions, or contributions:
- GitHub Issues: [Report a bug](https://github.com/Lickhill/scalarAIEcom/issues)
- Email: support@lickhill.com

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### MIT License Summary
You are free to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute the software
- ✅ Use privately

With only one condition:
- 📝 Include the license and copyright notice

---

**Last Updated**: March 30, 2026  
**Version**: 2.0.0
