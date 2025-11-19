# Dream60 Backend - Auction Scheduler

## Automatic Auction Scheduling System

This backend implements an automatic daily auction scheduling system that manages auction creation and progression throughout the day.

## Features

### 🚀 Automatic Scheduling
- **Daily Start**: 9:00 AM every day
- **Initial Creation**: Creates first 3 auctions at 9 AM (1 LIVE + 2 UPCOMING)
- **Auto-Progression**: Every hour, advances auctions and creates new ones
- **Auto-Reset**: Resets at midnight for the next day

### 📊 Auction States
- **LIVE**: Currently active auction
- **UPCOMING**: Scheduled future auctions
- **COMPLETED**: Past auctions
- **CANCELLED**: Manually cancelled auctions

### ⚙️ Configuration
All auction details are pulled from the **Master Auction** configuration:
- Prize values
- Entry fees
- Round counts
- Round configurations
- Time slots
- Images and names

## API Endpoints

### 1. Initialize Daily Auctions
```bash
POST /api/scheduler/initialize
Content-Type: application/json

{
  "masterAuctionId": "master-auction-mongodb-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Daily auctions initialized successfully",
  "auctions": [...]
}
```

### 2. Progress Auctions
```bash
POST /api/scheduler/progress
Content-Type: application/json

{
  "masterAuctionId": "master-auction-mongodb-id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auctions progressed successfully",
  "updates": [...],
  "newAuctionCreated": true,
  "currentTime": "10:00"
}
```

### 3. Get Current Status
```bash
GET /api/scheduler/status/:masterAuctionId
```

**Response:**
```json
{
  "success": true,
  "currentTime": "10:00",
  "date": "2024-01-15",
  "auctions": {
    "live": [...],
    "upcoming": [...],
    "completed": [...]
  },
  "counts": {
    "total": 5,
    "live": 1,
    "upcoming": 2,
    "completed": 2
  }
}
```

### 4. Get Current Auctions
```bash
GET /api/scheduler/current/:masterAuctionId
```

**Response:**
```json
{
  "success": true,
  "live": [...],
  "upcoming": [...],
  "currentTime": "10:00",
  "date": "2024-01-15"
}
```

### 5. Reset Daily Auctions
```bash
POST /api/scheduler/reset
Content-Type: application/json

{
  "masterAuctionId": "master-auction-mongodb-id"
}
```

### 6. Start Scheduler
```bash
POST /api/scheduler/start
Content-Type: application/json

{
  "masterAuctionId": "master-auction-mongodb-id",
  "intervalMinutes": 1
}
```

### 7. Stop Scheduler
```bash
POST /api/scheduler/stop
```

## Daily Workflow

### 9:00 AM - Day Start
```
System creates:
├── 9:00 AM  → LIVE
├── 10:00 AM → UPCOMING
└── 11:00 AM → UPCOMING
```

### 10:00 AM - First Progression
```
System updates:
├── 9:00 AM  → COMPLETED
├── 10:00 AM → LIVE
├── 11:00 AM → UPCOMING
└── 12:00 PM → UPCOMING (newly created)
```

### 11:00 AM - Second Progression
```
System updates:
├── 9:00 AM  → COMPLETED
├── 10:00 AM → COMPLETED
├── 11:00 AM → LIVE
├── 12:00 PM → UPCOMING
└── 1:00 PM  → UPCOMING (newly created)
```

This pattern continues throughout the day until all configured auctions are created.

### 12:00 AM (Midnight) - Day Reset
```
System clears all auctions for a fresh start at 9:00 AM
```

## Database Models

### DailyAuction Schema
```javascript
{
  auctionId: String (UUID),
  masterAuctionId: ObjectId (ref: MasterAuction),
  auctionNumber: Number,
  date: String (YYYY-MM-DD),
  TimeSlot: String (HH:MM),
  auctionName: String,
  imageUrl: String,
  prizeValue: Number,
  Status: String (LIVE|UPCOMING|COMPLETED|CANCELLED),
  maxDiscount: Number,
  EntryFee: String (RANDOM|MANUAL),
  minEntryFee: Number,
  maxEntryFee: Number,
  FeeSplits: { BoxA: Number, BoxB: Number },
  roundCount: Number,
  roundConfig: Array,
  created_at: Date,
  updated_at: Date
}
```

## Integration

### Server Initialization
Add to your main server file (e.g., `server.js` or `app.js`):

```javascript
const { initializeScheduler, shutdownScheduler } = require('./config/scheduler');

// Start scheduler when server starts
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeScheduler();
});

// Gracefully shutdown on exit
process.on('SIGTERM', () => {
  shutdownScheduler();
  process.exit(0);
});

process.on('SIGINT', () => {
  shutdownScheduler();
  process.exit(0);
});
```

### Add Routes
Add to your main routes file:

```javascript
const schedulerRoutes = require('./routes/schedulerRoutes');

app.use('/api/scheduler', schedulerRoutes);
```

## Testing

### Manual Testing
1. **Initialize auctions:**
   ```bash
   curl -X POST http://localhost:3000/api/scheduler/initialize \
     -H "Content-Type: application/json" \
     -d '{"masterAuctionId": "your-master-auction-id"}'
   ```

2. **Check status:**
   ```bash
   curl http://localhost:3000/api/scheduler/status/your-master-auction-id
   ```

3. **Progress manually:**
   ```bash
   curl -X POST http://localhost:3000/api/scheduler/progress \
     -H "Content-Type: application/json" \
     -d '{"masterAuctionId": "your-master-auction-id"}'
   ```

4. **Reset for testing:**
   ```bash
   curl -X POST http://localhost:3000/api/scheduler/reset \
     -H "Content-Type: application/json" \
     -d '{"masterAuctionId": "your-master-auction-id"}'
   ```

## Configuration

### Scheduler Settings
Edit `src/services/auctionScheduler.js`:

```javascript
this.WINDOW_SIZE = 3;        // Number of auctions to maintain
this.DAILY_START_HOUR = 9;   // Start time (24-hour format)
```

### Interval
Default check interval is 1 minute. Can be changed when starting:

```javascript
auctionScheduler.startScheduler(masterAuctionId, 5); // Check every 5 minutes
```

## Error Handling

The scheduler includes comprehensive error handling:
- Database connection failures
- Missing master auction configurations
- Invalid time slots
- Duplicate auction prevention

All errors are logged to console with context for debugging.

## Monitoring

Monitor scheduler activity through logs:
```bash
# Starting scheduler
Starting auction scheduler for master: 507f1f77bcf86cd799439011

# Hourly checks
Checking auctions at 10:00:0
Progressing auctions...
Updated auction abc-123 to COMPLETED
Saved 1 auctions to database

# Daily reset
Resetting for new day...
Cleared 10 auctions for today
```

## File Structure

```
src/backend/
├── src/
│   ├── config/
│   │   └── scheduler.js          # Scheduler initialization
│   ├── controllers/
│   │   └── schedulerController.js # API endpoint handlers
│   ├── models/
│   │   ├── DailyAuction.js       # Daily auction schema
│   │   ├── MasterAuction.js      # Master configuration schema
│   │   └── MasterBid.js          # Platform config schema
│   ├── routes/
│   │   └── schedulerRoutes.js    # Scheduler API routes
│   └── services/
│       └── auctionScheduler.js   # Core scheduling logic
└── README.md
```

## Notes

- Scheduler runs every minute to check for hour transitions
- Only one auction can be LIVE at any time
- Always maintains 2 UPCOMING auctions (when available)
- Automatically handles edge cases (first/last auction of day)
- Thread-safe with singleton pattern
- Database operations use atomic updates

## Support

For issues or questions, check the logs and verify:
1. Master auction is configured correctly
2. Database connection is active
3. Scheduler is running (`POST /api/scheduler/start`)
4. System time is correct