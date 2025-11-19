# Frontend Integration Example

## Updating Frontend to Use Cron Scheduler API

### Current Frontend Component
Your frontend component `AuctionSchedule.tsx` currently fetches from:
```typescript
const response = await fetch('http://localhost:5000/api/v1/master-auctions/all-with-config');
```

### Update to Use New Scheduler Endpoint

Replace with the new scheduler endpoint that returns actual daily auctions:

```typescript
// src/components/AuctionSchedule.tsx

const fetchAuctions = async () => {
  try {
    // Fetch current auctions from scheduler
    const response = await fetch('http://localhost:5000/api/v1/scheduler/current-auctions');
    const result = await response.json();
    
    if (result.success && result.data) {
      // Extract all auctions (live, upcoming, completed)
      const allAuctions = [
        ...result.data.auctions.live,
        ...result.data.auctions.upcoming,
        ...result.data.auctions.completed,
      ];
      
      // Sort by TimeSlot
      allAuctions.sort((a, b) => {
        const timeA = parseInt(a.TimeSlot.split(':')[0]);
        const timeB = parseInt(b.TimeSlot.split(':')[0]);
        return timeA - timeB;
      });
      
      setAuctions(allAuctions);
    }
  } catch (error) {
    console.error('Error fetching auctions:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Full Updated Component Example

```typescript
import { Clock, Calendar, Trophy, Sparkles, IndianRupee, Radio, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';

interface AuctionConfig {
  auctionNumber: number;
  auctionId: string;
  TimeSlot: string;
  auctionName: string;
  imageUrl?: string;
  prizeValue: number;
  Status: 'LIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  masterAuctionId: string;
  date: string;
}

export function AuctionSchedule() {
  const [auctions, setAuctions] = useState<AuctionConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        // NEW: Fetch from scheduler endpoint
        const response = await fetch('http://localhost:5000/api/v1/scheduler/current-auctions');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Set current time
          setCurrentTime(result.data.currentTime);
          
          // Combine all auctions
          const allAuctions = [
            ...result.data.auctions.live,
            ...result.data.auctions.upcoming,
            ...result.data.auctions.completed,
          ];
          
          // Sort by TimeSlot
          allAuctions.sort((a, b) => {
            const timeA = parseInt(a.TimeSlot.split(':')[0]);
            const timeB = parseInt(b.TimeSlot.split(':')[0]);
            return timeA - timeB;
          });
          
          setAuctions(allAuctions);
        }
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
    
    // Auto-refresh every minute to keep status updated
    const interval = setInterval(fetchAuctions, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // ... rest of your component code remains the same
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Auction Schedule</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current Time: {currentTime} • {auctions.length} auctions today
        </p>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : auctions.length === 0 ? (
          <div className="text-center">No auctions scheduled</div>
        ) : (
          <div className="space-y-3">
            {auctions.map((auction, index) => (
              <div key={auction.auctionId}>
                {/* Your existing auction card UI */}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

## Benefits of New Integration

### 1. Real-Time Data
- Shows actual LIVE, UPCOMING, and COMPLETED auctions
- Not just templates from master auction config

### 2. Accurate Status
- Status reflects reality based on current time
- Automatically updated by cron jobs

### 3. Auto-Refresh
- Frontend refreshes every minute
- Always shows current state

### 4. Better User Experience
- Users see exactly what's happening now
- Clear distinction between live and upcoming
- Shows completed auctions for transparency

## Testing the Integration

### Step 1: Start Backend Scheduler
```bash
# Initialize
curl -X POST http://localhost:5000/api/v1/scheduler/initialize \
  -H "Content-Type: application/json" \
  -d '{"masterAuctionId": "YOUR_MASTER_AUCTION_ID"}'

# Start cron jobs
curl -X POST http://localhost:5000/api/v1/scheduler/start
```

### Step 2: Test Frontend
```bash
# The frontend will now fetch from:
# http://localhost:5000/api/v1/scheduler/current-auctions

# Which returns:
{
  "success": true,
  "data": {
    "currentTime": "10:00",
    "date": "2024-01-15",
    "auctions": {
      "live": [...],      // Currently live auctions
      "upcoming": [...],  // Scheduled for future
      "completed": [...]  // Already finished
    },
    "counts": {
      "total": 10,
      "live": 1,
      "upcoming": 2,
      "completed": 7
    }
  }
}
```

### Step 3: Verify Auto-Progression
1. At 10:00 AM, frontend shows 10:00 as LIVE
2. Wait for 11:00 AM (or manually trigger progression)
3. Frontend auto-refreshes and shows 11:00 as LIVE
4. 10:00 AM now shows as COMPLETED

## Additional Features You Can Add

### 1. Status Badge Colors
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'LIVE':
      return 'bg-green-500 text-white animate-pulse';
    case 'UPCOMING':
      return 'bg-blue-500 text-white';
    case 'COMPLETED':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-300';
  }
};
```

### 2. Countdown Timer for Upcoming
```typescript
const getTimeUntilAuction = (timeSlot: string) => {
  const [hour, minute] = timeSlot.split(':').map(Number);
  const now = new Date();
  const auctionTime = new Date();
  auctionTime.setHours(hour, minute, 0, 0);
  
  const diff = auctionTime.getTime() - now.getTime();
  const minutes = Math.floor(diff / 60000);
  
  return minutes > 0 ? `Starts in ${minutes} minutes` : 'Starting soon';
};
```

### 3. Live Indicator
```typescript
{auction.Status === 'LIVE' && (
  <motion.div
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="flex items-center gap-2"
  >
    <div className="w-2 h-2 bg-red-500 rounded-full" />
    <span className="text-red-500 font-bold">LIVE NOW</span>
  </motion.div>
)}
```

## API Response Structure

### GET /api/v1/scheduler/current-auctions

```json
{
  "success": true,
  "data": {
    "currentTime": "10:00",
    "date": "2024-01-15",
    "auctions": {
      "live": [
        {
          "auctionId": "uuid-here",
          "masterAuctionId": "master-id",
          "auctionNumber": 2,
          "date": "2024-01-15",
          "TimeSlot": "10:00",
          "auctionName": "iPhone 15 Pro Max",
          "imageUrl": "https://...",
          "prizeValue": 150000,
          "Status": "LIVE",
          "maxDiscount": 90,
          "EntryFee": "RANDOM",
          "minEntryFee": 1000,
          "maxEntryFee": 3500,
          "FeeSplits": {
            "BoxA": 1250,
            "BoxB": 1250
          },
          "roundCount": 4,
          "roundConfig": [],
          "created_at": "2024-01-15T09:00:00.000Z",
          "updated_at": "2024-01-15T10:00:00.000Z"
        }
      ],
      "upcoming": [...],
      "completed": [...]
    },
    "counts": {
      "total": 10,
      "live": 1,
      "upcoming": 2,
      "completed": 7
    }
  }
}
```

## Summary

The new cron-based scheduler provides:
- ✅ Automatic auction creation and progression
- ✅ Real-time status updates
- ✅ Easy frontend integration
- ✅ Accurate time-based management
- ✅ No manual intervention needed

Your frontend just needs to fetch from the new endpoint and display the data!
