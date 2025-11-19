# Dream60 Auction Cron-Based Scheduler

## Overview

The **Auction Cron Scheduler** automatically manages daily auctions using cron jobs. The system creates and progresses auctions throughout the day without manual intervention.

## How It Works

### Daily Auction Pattern

The scheduler follows this pattern every day:

1. **9:00 AM** - Initializes the first 3 auctions:
   - 9:00 AM → **LIVE**
   - 10:00 AM → **UPCOMING**
   - 11:00 AM → **UPCOMING**

2. **10:00 AM** (and every hour after):
   - Marks the 9:00 AM auction as **COMPLETED**
   - Makes the 10:00 AM auction **LIVE**
   - Creates a new auction for 12:00 PM as **UPCOMING**

3. **Pattern continues** until all configured auctions are created

4. **Midnight (00:00)** - Resets everything for the next day

### Cron Jobs

The system uses three cron jobs:

| Job | Schedule | Description |
|-----|----------|-------------|
| **Initialization** | `0 9 * * *` | Creates first 3 auctions at 9:00 AM daily |
| **Hourly Progression** | `0 10-23 * * *` | Progresses auctions every hour (10 AM - 11 PM) |
| **Midnight Reset** | `0 0 * * *` | Clears all auctions at midnight |

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1/scheduler
```

### 1. Initialize Scheduler

Initialize the scheduler with a master auction ID.

**Endpoint:** `POST /api/v1/scheduler/initialize`

**Request Body:**
```json
{
  "masterAuctionId": "6582f3a4b5c8d9e0f1234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scheduler initialized successfully",
  "data": {
    "success": true,
    "message": "Scheduler initialized successfully",
    "masterAuctionId": "6582f3a4b5c8d9e0f1234567"
  }
}
```

### 2. Start Cron Jobs

Start all automatic cron jobs.

**Endpoint:** `POST /api/v1/scheduler/start`

**Response:**
```json
{
  "success": true,
  "message": "All cron jobs started successfully",
  "data": {
    "success": true,
    "message": "All cron jobs started",
    "jobs": [
      "initialization",
      "hourly_progression",
      "midnight_reset"
    ]
  }
}
```

### 3. Stop Cron Jobs

Stop all automatic cron jobs.

**Endpoint:** `POST /api/v1/scheduler/stop`

**Response:**
```json
{
  "success": true,
  "message": "All cron jobs stopped successfully",
  "data": {
    "success": true,
    "message": "All cron jobs stopped"
  }
}
```

### 4. Get Scheduler Status

Get the status of all cron jobs.

**Endpoint:** `GET /api/v1/scheduler/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "isInitialized": true,
    "masterAuctionId": "6582f3a4b5c8d9e0f1234567",
    "jobs": [
      {
        "name": "initialization",
        "running": true
      },
      {
        "name": "hourly_progression",
        "running": true
      },
      {
        "name": "midnight_reset",
        "running": true
      }
    ],
    "totalJobs": 3
  }
}
```

### 5. Get Current Auctions

Get the current status of all auctions.

**Endpoint:** `GET /api/v1/scheduler/current-auctions`

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "currentTime": "10:00",
    "date": "2024-01-15",
    "auctions": {
      "live": [
        {
          "auctionId": "abc123",
          "TimeSlot": "10:00",
          "auctionName": "iPhone 15 Pro Max",
          "Status": "LIVE"
        }
      ],
      "upcoming": [
        {
          "auctionId": "def456",
          "TimeSlot": "11:00",
          "auctionName": "MacBook Pro",
          "Status": "UPCOMING"
        },
        {
          "auctionId": "ghi789",
          "TimeSlot": "12:00",
          "auctionName": "iPad Air",
          "Status": "UPCOMING"
        }
      ],
      "completed": [
        {
          "auctionId": "xyz999",
          "TimeSlot": "09:00",
          "auctionName": "AirPods Pro",
          "Status": "COMPLETED"
        }
      ]
    },
    "counts": {
      "total": 4,
      "live": 1,
      "upcoming": 2,
      "completed": 1
    }
  }
}
```

## Manual Trigger Endpoints (Testing)

These endpoints allow you to manually trigger scheduler actions for testing purposes.

### 6. Manual Initialize

Manually trigger auction initialization.

**Endpoint:** `POST /api/v1/scheduler/manual/initialize`

**Response:**
```json
{
  "success": true,
  "message": "Manual initialization triggered",
  "data": {
    "success": true,
    "message": "Daily auctions initialized",
    "count": 3,
    "auctions": [...]
  }
}
```

### 7. Manual Progress

Manually trigger auction progression.

**Endpoint:** `POST /api/v1/scheduler/manual/progress`

**Response:**
```json
{
  "success": true,
  "message": "Manual progression triggered",
  "data": {
    "success": true,
    "message": "Auctions progressed successfully",
    "currentHour": "10:00",
    "updates": [
      {
        "action": "COMPLETED",
        "auctionId": "abc123",
        "TimeSlot": "09:00"
      },
      {
        "action": "LIVE",
        "auctionId": "def456",
        "TimeSlot": "10:00"
      },
      {
        "action": "CREATED",
        "auctionId": "ghi789",
        "TimeSlot": "12:00"
      }
    ]
  }
}
```

### 8. Manual Reset

Manually trigger daily auction reset.

**Endpoint:** `POST /api/v1/scheduler/manual/reset`

**Response:**
```json
{
  "success": true,
  "message": "Manual reset triggered",
  "data": {
    "success": true,
    "message": "Daily auctions reset",
    "deletedCount": 10
  }
}
```

## Setup Instructions

### 1. Installation

The required package `node-cron` is already installed.

### 2. Initialize and Start

```bash
# Step 1: Initialize the scheduler with your master auction ID
curl -X POST http://localhost:5000/api/v1/scheduler/initialize \
  -H "Content-Type: application/json" \
  -d '{"masterAuctionId": "YOUR_MASTER_AUCTION_ID"}'

# Step 2: Start all cron jobs
curl -X POST http://localhost:5000/api/v1/scheduler/start
```

### 3. Check Status

```bash
# Get scheduler status
curl http://localhost:5000/api/v1/scheduler/status

# Get current auctions
curl http://localhost:5000/api/v1/scheduler/current-auctions
```

## Testing Guide

### Test Scenario 1: Full Day Simulation

1. **Initialize at 9:00 AM:**
```bash
curl -X POST http://localhost:5000/api/v1/scheduler/manual/initialize
```

Expected: 3 auctions created (9 AM LIVE, 10 AM UPCOMING, 11 AM UPCOMING)

2. **Progress at 10:00 AM:**
```bash
curl -X POST http://localhost:5000/api/v1/scheduler/manual/progress
```

Expected: 
- 9 AM → COMPLETED
- 10 AM → LIVE
- 12 PM → UPCOMING (new)

3. **Progress at 11:00 AM:**
```bash
curl -X POST http://localhost:5000/api/v1/scheduler/manual/progress
```

Expected:
- 10 AM → COMPLETED
- 11 AM → LIVE
- 1 PM → UPCOMING (new)

### Test Scenario 2: Status Monitoring

```bash
# Check current status
curl http://localhost:5000/api/v1/scheduler/current-auctions
```

You should see:
- 1 LIVE auction (current hour)
- 2 UPCOMING auctions (next 2 hours)
- N COMPLETED auctions (past hours)

### Test Scenario 3: Reset

```bash
# Reset all auctions
curl -X POST http://localhost:5000/api/v1/scheduler/manual/reset

# Verify empty
curl http://localhost:5000/api/v1/scheduler/current-auctions
```

## Logs

The scheduler outputs detailed logs to the console:

```
✅ Auction Cron Scheduler initialized for master: 6582f3a4b5c8d9e0f1234567
✅ Initialization cron job scheduled: 9:00 AM daily
✅ Hourly progression cron job scheduled: 10:00 AM - 11:00 PM
✅ Midnight reset cron job scheduled: 00:00 daily
✅ All cron jobs started successfully

🚀 [2024-01-15T09:00:00.000Z] Running daily initialization at 9:00 AM
✅ Initialized 3 auctions for today

⏰ [2024-01-15T10:00:00.000Z] Running hourly progression at 10:00
✅ Marked 09:00 auction as COMPLETED
✅ Marked 10:00 auction as LIVE
✅ Created new UPCOMING auction for 12:00

🌙 [2024-01-16T00:00:00.000Z] Running midnight reset at 00:00
✅ Reset complete: Deleted 10 auctions
```

## Architecture

### Files Structure

```
src/backend/
├── src/
│   ├── services/
│   │   └── auctionCronScheduler.js    # Core cron scheduler logic
│   ├── controllers/
│   │   └── auctionSchedulerController.js  # API controller
│   ├── routes/
│   │   └── schedulerRoutes.js         # API routes
│   └── models/
│       ├── MasterAuction.js           # Master auction template
│       └── DailyAuction.js            # Daily auction instances
└── server.js                          # Main server file
```

### Key Components

1. **AuctionCronScheduler** (Service)
   - Manages cron jobs
   - Handles auction creation and progression
   - Maintains auction state

2. **AuctionSchedulerController** (Controller)
   - Exposes API endpoints
   - Handles HTTP requests/responses
   - Validates inputs

3. **DailyAuction** (Model)
   - Stores individual auction instances
   - Indexed by date and status
   - References master auction template

## Production Deployment

### Environment Variables

Add to `.env`:
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
PORT=5000
```

### Server Timezone

The cron jobs use `Asia/Kolkata` timezone by default. To change:

Edit `src/backend/src/services/auctionCronScheduler.js`:
```javascript
const job = cron.schedule('0 9 * * *', async () => {
  // ...
}, {
  timezone: 'America/New_York',  // Change this
});
```

### Auto-start on Server Boot

Add to your server startup script:

```javascript
// In server.js
const auctionCronScheduler = require('./src/services/auctionCronScheduler');

// After MongoDB connection
mongoose.connect(MONGO_URI).then(async () => {
  console.log('✅ MongoDB connected successfully');
  
  // Auto-initialize scheduler
  const MASTER_AUCTION_ID = process.env.MASTER_AUCTION_ID;
  if (MASTER_AUCTION_ID) {
    await auctionCronScheduler.initialize(MASTER_AUCTION_ID);
    auctionCronScheduler.startAllCronJobs();
    console.log('✅ Auction scheduler auto-started');
  }
});
```

## Troubleshooting

### Issue: Cron jobs not running

**Solution:** Check if scheduler is initialized and started:
```bash
curl http://localhost:5000/api/v1/scheduler/status
```

### Issue: Auctions not progressing

**Solution:** Check server logs for errors and verify cron job schedule:
```bash
# Manually trigger progression to test
curl -X POST http://localhost:5000/api/v1/scheduler/manual/progress
```

### Issue: Duplicate auctions

**Solution:** Reset and reinitialize:
```bash
curl -X POST http://localhost:5000/api/v1/scheduler/manual/reset
curl -X POST http://localhost:5000/api/v1/scheduler/manual/initialize
```

## Support

For issues or questions, contact the development team or check the logs for detailed error messages.
