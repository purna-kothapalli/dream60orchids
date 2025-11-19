import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyAuctions } from '@/db/schema';
import { lt, and, not, inArray, eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Find all auctions from previous days that are not COMPLETED or CANCELLED
    const oldAuctions = await db.select()
      .from(dailyAuctions)
      .where(
        and(
          lt(dailyAuctions.scheduledDate, today),
          not(inArray(dailyAuctions.status, ['COMPLETED', 'CANCELLED']))
        )
      );

    let updatedCount = 0;

    // Mark all those auctions as COMPLETED
    if (oldAuctions.length > 0) {
      const oldAuctionIds = oldAuctions.map(auction => auction.id);
      
      await db.update(dailyAuctions)
        .set({
          status: 'COMPLETED',
          updatedAt: new Date().toISOString()
        })
        .where(
          and(
            lt(dailyAuctions.scheduledDate, today),
            not(inArray(dailyAuctions.status, ['COMPLETED', 'CANCELLED']))
          )
        );

      updatedCount = oldAuctions.length;
    }

    // Delete all auctions from today to allow re-initialization
    await db.delete(dailyAuctions)
      .where(eq(dailyAuctions.scheduledDate, today));

    return NextResponse.json({
      success: true,
      message: 'Daily cycle reset successfully',
      updatedCount
    }, { status: 200 });

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error.message
    }, { status: 500 });
  }
}