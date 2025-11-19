# Auction Scheduler - Quick Start Guide

## 🚀 Start Using the Scheduler in 3 Steps

### Step 1: Initialize the Scheduler

```bash
curl -X POST http://localhost:5000/api/v1/scheduler/initialize \
  -H "Content-Type: application/json" \
  -d '{"masterAuctionId": "YOUR_MASTER_AUCTION_ID"}'
```

### Step 2: Start All Cron Jobs

```bash
curl -X POST http://localhost:5000/api/v1/scheduler/start
```

### Step 3: Verify It's Running

```bash
curl http://localhost:5000/api/v1/scheduler/status
```

## ✅ Expected Result

```json
{
  "success": true,
  "data": {
    "isInitialized": true,
    "masterAuctionId": "YOUR_MASTER_AUCTION_ID",
    "jobs": [
      {"name": "initialization", "running": true},
      {"name": "hourly_progression", "running": true},
      {"name": "midnight_reset", "running": true}
    ],
    "totalJobs": 3
  }
}
```

## 🎯 What Happens Automatically

| Time | Action |
|------|--------|
| **9:00 AM** | Creates first 3 auctions (9 AM LIVE, 10 AM UPCOMING, 11 AM UPCOMING) |
| **10:00 AM** | 9 AM → COMPLETED, 10 AM → LIVE, creates 12 PM UPCOMING |
| **11:00 AM** | 10 AM → COMPLETED, 11 AM → LIVE, creates 1 PM UPCOMING |
| **...continues** | Pattern repeats until all auctions created |
| **Midnight** | Resets everything for next day |

## 📊 Check Current Auctions

```bash
curl http://localhost:5000/api/v1/scheduler/current-auctions
```

## 🧪 Manual Testing (Optional)

### Test Initialize
```bash
curl -X POST http://localhost:5000/api/v1/scheduler/manual/initialize
```

### Test Progress
```bash
curl -X POST http://localhost:5000/api/v1/scheduler/manual/progress
```

### Test Reset
```bash
curl -X POST http://localhost:5000/api/v1/scheduler/manual/reset
```

## 🛑 Stop Scheduler

```bash
curl -X POST http://localhost:5000/api/v1/scheduler/stop
```

## 📝 Full Documentation

See `SCHEDULER_README.md` for complete documentation.
