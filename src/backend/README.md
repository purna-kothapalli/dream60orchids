# Dream60 Backend - Admin Panel

## Setup Instructions

### 1. Install Dependencies
```bash
cd src/backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `src/backend` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/dream60

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# Client URLs (for CORS)
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS (using Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB service from Services panel or run mongod.exe
```

### 4. Start the Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:5000`

### 5. Access API Documentation
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

## Admin Panel Access

### Admin Credentials
- **Email:** `dream60@gmail.com`
- **Password:** `Dharsh@2003`

### Admin Features
1. **User Statistics Dashboard**
   - Total users, active users, deleted users
   - Total auctions and wins
   - Financial statistics (amount spent/won)
   - Recent users list
   - Top spenders and winners

2. **User Management**
   - View all users with pagination
   - Search users by username, email, mobile, or user code
   - View detailed user information

3. **Master Auction Management**
   - Create new master auctions
   - View all master auctions
   - Update existing auctions
   - Delete auctions
   - Set active/inactive status

## API Endpoints

### Admin Routes
- `POST /admin/login` - Admin login
- `GET /admin/statistics` - Get user statistics (requires admin user_id)
- `GET /admin/users` - Get all users (requires admin user_id)
- `GET /admin/master-auctions` - Get all master auctions (requires admin user_id)
- `POST /admin/master-auctions` - Create master auction (requires admin user_id)
- `PUT /admin/master-auctions/:master_id` - Update master auction (requires admin user_id)
- `DELETE /admin/master-auctions/:master_id` - Delete master auction (requires admin user_id)

### Testing Admin APIs

#### 1. Login as Admin
```bash
curl -X POST http://localhost:5000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dream60@gmail.com",
    "password": "Dharsh@2003"
  }'
```

#### 2. Get Statistics (use user_id from login response)
```bash
curl -X GET "http://localhost:5000/admin/statistics?user_id=YOUR_ADMIN_USER_ID"
```

#### 3. Get All Users
```bash
curl -X GET "http://localhost:5000/admin/users?user_id=YOUR_ADMIN_USER_ID&page=1&limit=20"
```

#### 4. Create Master Auction
```bash
curl -X POST "http://localhost:5000/admin/master-auctions?user_id=YOUR_ADMIN_USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "totalAuctionsPerDay": 10,
    "isActive": true,
    "dailyAuctionConfig": [
      {
        "auctionNumber": 1,
        "TimeSlot": "09:00",
        "auctionName": "Morning Auction",
        "prizeValue": 50000,
        "Status": "UPCOMING",
        "EntryFee": "RANDOM",
        "minEntryFee": 1000,
        "maxEntryFee": 3500
      }
    ]
  }'
```

## Frontend Integration

### Accessing Admin Panel from Frontend
1. Navigate to the login page
2. Click the "Admin" button in the top-right corner
3. Login with admin credentials
4. You'll be redirected to the admin dashboard

### Admin Panel Features in Frontend
- **Overview Tab**: View statistics and top performers
- **Users Tab**: Search and view all users
- **Master Auctions Tab**: Create and manage master auctions

## Database Schema

### User Model (with Admin Support)
```javascript
{
  user_id: String (UUID),
  username: String,
  email: String,
  mobile: String,
  password: String (hashed),
  userType: "USER" | "ADMIN",  // Admin type
  userCode: String,
  totalAuctions: Number,
  totalWins: Number,
  totalAmountSpent: Number,
  totalAmountWon: Number,
  isDeleted: Boolean,
  preferences: Object
}
```

## Security Notes
1. Admin credentials are hardcoded for the specific user `dream60@gmail.com`
2. All admin routes check for admin user_id in query parameters
3. All admin routes verify userType === 'ADMIN' in the database
4. Passwords are hashed using bcrypt
5. CORS is configured to allow localhost:3000 in development

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists with correct configuration
- Check if port 5000 is available

### Admin login fails
- Verify backend is running on http://localhost:5000
- Check MongoDB connection
- Admin user will be created automatically on first login attempt

### CORS errors
- Make sure CLIENT_URL in `.env` matches your frontend URL
- Default is http://localhost:3000

## Project Structure
```
src/backend/
├── src/
│   ├── controllers/
│   │   ├── adminController.js      # Admin logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── ...
│   ├── models/
│   │   ├── User.js                 # User model (supports admin)
│   │   ├── MasterAuction.js
│   │   └── ...
│   ├── routes/
│   │   ├── adminRoutes.js          # Admin routes
│   │   ├── authRoutes.js
│   │   └── ...
├── server.js                       # Main server file
├── package.json
└── .env                           # Environment variables
```

## Support
For issues or questions, contact the development team.
