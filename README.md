# CottonCo E-commerce Platform

A full-stack e-commerce application built with React, Node.js, Express, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### 1. Database Setup
First, create a PostgreSQL database and update your `.env` file in the backend directory:

```env
DB_NAME=cottonco_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

### 2. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frotend
npm install
```

### 3. Setup Database

```bash
cd backend
npm run setup-db
```

This will:
- Create all database tables
- Create default admin user
- Add sample products

### 4. Start the Application

#### Option A: Use the startup script
```bash
# From the project root
start-project.bat
```

#### Option B: Start manually
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frotend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 👤 Default Credentials

### Admin User
- Email: `admin@cottonco.com`
- Password: `admin123`

## 🛠️ Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run setup-db     # Setup database with sample data
npm run reset-db     # Reset database (preserves data)
npm run force-reset-db # Force reset database (deletes all data)
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📁 Project Structure

```
ReactProject/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controller/     # Route controllers
│   │   ├── models/         # Database models
│   │   ├── route/          # API routes
│   │   ├── middleware/     # Authentication middleware
│   │   ├── scripts/        # Database scripts
│   │   └── database/       # Database configuration
│   └── uploads/            # File uploads
├── frotend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── public/         # Public pages
│   │   ├── private/        # Protected pages
│   │   ├── admin/          # Admin pages
│   │   ├── services/       # API services
│   │   └── routes/         # Routing configuration
└── start-project.bat       # Windows startup script
```

## 🔧 Key Features

### User Features
- ✅ User registration and authentication
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ Secure checkout process
- ✅ Order history and tracking
- ✅ User profile management

### Admin Features
- ✅ Product management (CRUD)
- ✅ User management
- ✅ Order management
- ✅ Dashboard with analytics
- ✅ File upload for product images

### Technical Features
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Database relationships
- ✅ File upload handling
- ✅ Error handling
- ✅ Responsive design

## 🐛 Troubleshooting

### Database Issues
If you encounter database errors:

1. **Reset the database**:
   ```bash
   cd backend
   npm run setup-db
   ```

2. **Check your .env file**:
   Ensure all database credentials are correct

3. **Verify PostgreSQL is running**:
   Make sure your PostgreSQL service is active

### Frontend Issues
If the frontend won't start:

1. **Clear node_modules**:
   ```bash
   cd frotend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check port conflicts**:
   Ensure ports 3000 and 5173 are available

### API Issues
If API calls fail:

1. **Check backend is running**:
   Verify backend is running on port 3000

2. **Check authentication**:
   Ensure you're logged in for protected routes

3. **Check CORS**:
   Verify CORS is properly configured

## 🔒 Security Features

- JWT token authentication
- Password hashing (implement in production)
- Protected admin routes
- Input validation
- SQL injection prevention (Sequelize ORM)

## 📝 Environment Variables

### Backend (.env)
```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use environment variables for sensitive data
3. Set up proper CORS origins
4. Configure database for production

### Frontend Deployment
1. Run `npm run build`
2. Serve the `dist` folder
3. Configure API endpoints for production

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console logs
3. Verify database connectivity
4. Check network requests in browser dev tools

## 🎯 Testing the User ID Fix

To test that the user ID issue is resolved:

1. **Login as a user**
2. **Add items to cart**
3. **Go to checkout**
4. **Place an order**
5. **Check the backend console** - you should see the user ID being logged
6. **Verify in database** - the order should have the correct user ID

The user ID will now be properly saved because:
- Users must be logged in to place orders
- The backend correctly extracts user ID from JWT token
- Authentication is properly enforced 