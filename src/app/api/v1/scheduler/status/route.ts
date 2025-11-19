import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyAuctions } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get current time and date in ISO format
    const currentTime = new Date().toISOString();
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    // Query all auctions for today
    const todayAuctions = await db.select()
      .from(dailyAuctions)
      .where(eq(dailyAuctions.scheduledDate, currentDate));

    // Count auctions by status
    const liveAuctions = todayAuctions.filter(a => a.status === 'LIVE');
    const upcomingAuctions = todayAuctions.filter(a => a.status === 'UPCOMING');
    const completedAuctions = todayAuctions.filter(a => a.status === 'COMPLETED');

    const todayStats = {
      live: liveAuctions.length,
      upcoming: upcomingAuctions.length,
      completed: completedAuctions.length,
      total: todayAuctions.length
    };

    // Get the current LIVE auction if exists
    const currentLiveAuction = liveAuctions.length > 0 ? liveAuctions[0] : null;

    // Calculate next scheduled auction creation time
    let nextAuctionTime: string | null = null;
    if (currentLiveAuction && currentLiveAuction.timeSlot) {
      // Parse the time slot (format: "HH:MM")
      const [hours, minutes] = currentLiveAuction.timeSlot.split(':').map(Number);
      const nextHour = hours + 1;
      
      // Format as HH:MM (24-hour format)
      if (nextHour < 24) {
        nextAuctionTime = `${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
    }

    // Get the masterId being used from existing auctions
    let masterIdInUse: string | null = null;
    if (todayAuctions.length > 0) {
      // Get masterId from the first auction (assuming all auctions use the same masterId for a day)
      masterIdInUse = todayAuctions[0].masterId || null;
    }

    return NextResponse.json({
      success: true,
      currentTime,
      currentDate,
      todayStats,
      currentLiveAuction,
      nextAuctionTime,
      masterIdInUse
    }, { status: 200 });

  } catch (error) {
    console.error('GET scheduler status error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}