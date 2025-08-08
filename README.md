# Cargo Stream Delivery App

A comprehensive delivery management system with dynamic fare calculation, booking management, and role-based access control.

## Features

### 🔐 Authentication
- JWT-based login/signup
- Role-based access (Customer, Admin, Dispatcher)
- Password hashing with bcrypt
- Form validation with express-validator

### 💰 Dynamic Fare Calculation
- OpenCage Geocoding API integration
- Real-time distance calculation using Haversine formula
- Admin-controlled pricing rules
- Fare breakdown (base fare + distance + weight)

### 📦 Booking System
- Create new bookings
- Assign dispatchers (Admin only)
- Status tracking (Pending → Scheduled → In Transit → Delivered)
- Booking history and tracking

### 👥 Admin Features
- User management
- Booking filters
- Pricing rule management
- Report generation

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Geolocation**: OpenCage Geocoding API
- **Security**: Helmet, CORS, Morgan

### Frontend
- **Framework**: React + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **State Management**: React Context

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenCage API key

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd cargo-stream-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd delivery-backend
npm install
```

### 2. Backend Setup

#### Environment Variables
Create a `.env` file in the `delivery-backend` directory:

```env
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=mongodb://localhost:27017/cargo-stream
PORT=5000
OPENCAGE_API_KEY=your_opencage_api_key_here
NODE_ENV=development
```

#### OpenCage API Setup
1. Go to [OpenCage Data](https://opencagedata.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add the API key to your `.env` file
5. Free tier includes 2,500 requests per day

#### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGO_URI` in your `.env` file
3. The database will be created automatically when you first run the app

#### Start Backend Server
```bash
cd delivery-backend
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

#### Start Frontend Development Server
```bash
# From the root directory
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Initial Setup

#### Create Admin User
1. Register a new user with role "Admin"
2. Or manually update a user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "Admin" } }
)
```

#### Set Up Pricing Rules
Add initial pricing rules to MongoDB:
```javascript
db.pricingrules.insertMany([
  {
    modeOfTransport: "train",
    baseFare: 15,
    perKmRate: 2.5,
    perKgRate: 1.5,
    isActive: true
  },
  {
    modeOfTransport: "truck",
    baseFare: 25,
    perKmRate: 4,
    perKgRate: 2,
    isActive: true
  }
])
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Fare Calculation
- `POST /api/fare/calculate` - Calculate delivery fare

### Bookings
- `POST /api/bookings` - Create new booking
- `POST /api/bookings/assign-dispatcher` - Assign dispatcher (Admin)
- `POST /api/bookings/update-status` - Update booking status
- `GET /api/bookings/history/:id` - Get booking history
- `GET /api/bookings/my` - Get user's bookings

## Usage

### Customer Flow
1. Register/Login as Customer
2. Use Fare Calculator to estimate cost
3. Create booking with pickup/delivery details
4. Track booking status

### Admin Flow
1. Login as Admin
2. Manage users and roles
3. Set pricing rules
4. Assign dispatchers to bookings
5. Generate reports

### Dispatcher Flow
1. Login as Dispatcher
2. View assigned deliveries
3. Update delivery status
4. Track delivery progress

## File Structure

```
cargo-stream-app/
├── delivery-backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── fareController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   └── PricingRule.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── fareRoutes.js
│   ├── utils/
│   │   └── calculateFare.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthContainer.tsx
│   │   ├── booking/
│   │   │   ├── FareCalculator.tsx
│   │   │   └── BookingForm.tsx
│   │   └── Dashboard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   └── App.tsx
└── README.md
```

## Next Steps

1. **Admin Dashboard**: Complete user management interface
2. **Booking Management**: Add booking listing and filtering
3. **Real-time Updates**: Implement WebSocket for live status updates
4. **Payment Integration**: Add payment processing
5. **Mobile App**: Create React Native mobile app
6. **Advanced Features**: 
   - Route optimization
   - Driver tracking
   - Push notifications
   - Analytics dashboard

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Google Maps API Error**
   - Verify API key is correct
   - Ensure Distance Matrix API is enabled
   - Check billing is set up

3. **CORS Issues**
   - Backend CORS is configured for development
   - Update CORS settings for production

4. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
