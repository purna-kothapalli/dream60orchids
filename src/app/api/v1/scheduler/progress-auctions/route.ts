import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyAuctions } from '@/db/schema';
import { eq, and, asc, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // 1. Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // 2. Find the current LIVE auction for today
    const liveAuction = await db.select()
      .from(dailyAuctions)
      .where(and(
        eq(dailyAuctions.status, 'LIVE'),
        eq(dailyAuctions.scheduledDate, today)
      ))
      .limit(1);

    // 3. If no LIVE auction found, return error
    if (liveAuction.length === 0) {
      return NextResponse.json({ 
        error: 'No LIVE auction found for today', 
        code: 'NO_LIVE_AUCTION' 
      }, { status: 404 });
    }

    const currentLiveAuction = liveAuction[0];

    // 4. Mark the LIVE auction as COMPLETED
    const completedAuction = await db.update(dailyAuctions)
      .set({
        status: 'COMPLETED',
        updatedAt: new Date().toISOString()
      })
      .where(eq(dailyAuctions.id, currentLiveAuction.id))
      .returning();

    // 5. Find the first UPCOMING auction for today
    const upcomingAuction = await db.select()
      .from(dailyAuctions)
      .where(and(
        eq(dailyAuctions.status, 'UPCOMING'),
        eq(dailyAuctions.scheduledDate, today)
      ))
      .orderBy(asc(dailyAuctions.auctionNumber))
      .limit(1);

    // 6. If no UPCOMING auction found, return error
    if (upcomingAuction.length === 0) {
      return NextResponse.json({ 
        error: 'No UPCOMING auction found', 
        code: 'NO_UPCOMING_AUCTION' 
      }, { status: 404 });
    }

    const nextUpcomingAuction = upcomingAuction[0];

    // 7. Mark the first UPCOMING auction as LIVE
    const newLiveAuction = await db.update(dailyAuctions)
      .set({
        status: 'LIVE',
        updatedAt: new Date().toISOString()
      })
      .where(eq(dailyAuctions.id, nextUpcomingAuction.id))
      .returning();

    // 8. Calculate the next time slot
    const currentTimeSlot = newLiveAuction[0].timeSlot;
    const [hours, minutes] = currentTimeSlot.split(':').map(Number);
    const nextHours = (hours + 3) % 24;
    const nextTimeSlot = `${String(nextHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // Get the highest auction number for today
    const highestAuction = await db.select()
      .from(dailyAuctions)
      .where(eq(dailyAuctions.scheduledDate, today))
      .orderBy(desc(dailyAuctions.auctionNumber))
      .limit(1);

    const nextAuctionNumber = highestAuction.length > 0 
      ? highestAuction[0].auctionNumber + 1 
      : 1;

    // 9. Create a new UPCOMING auction
    const newUpcomingAuction = await db.insert(dailyAuctions)
      .values({
        auctionId: randomUUID(),
        masterId: currentLiveAuction.masterId,
        auctionNumber: nextAuctionNumber,
        timeSlot: nextTimeSlot,
        status: 'UPCOMING',
        scheduledDate: today,
        auctionName: currentLiveAuction.auctionName || 'Auction',
        imageUrl: currentLiveAuction.imageUrl || null,
        prizeValue: currentLiveAuction.prizeValue || 1000,
        maxDiscount: currentLiveAuction.maxDiscount || 50,
        entryFeeType: currentLiveAuction.entryFeeType || 'RANDOM',
        minEntryFee: currentLiveAuction.minEntryFee || 10,
        maxEntryFee: currentLiveAuction.maxEntryFee || 100,
        feeSplitsBoxA: currentLiveAuction.feeSplitsBoxA || 50,
        feeSplitsBoxB: currentLiveAuction.feeSplitsBoxB || 50,
        roundCount: currentLiveAuction.roundCount || 3,
        roundConfig: currentLiveAuction.roundConfig || JSON.stringify({ rounds: [] }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    // 10. Return the updated auction statuses
    return NextResponse.json({
      success: true,
      message: 'Auctions progressed successfully',
      completed: completedAuction[0],
      live: newLiveAuction[0],
      newUpcoming: newUpcomingAuction[0]
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}