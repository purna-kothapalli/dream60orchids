import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyAuctions } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // Query all auctions for today, ordered by auctionNumber
    const auctions = await db
      .select()
      .from(dailyAuctions)
      .where(eq(dailyAuctions.scheduledDate, today))
      .orderBy(asc(dailyAuctions.auctionNumber));

    // Return success response with all auctions for today
    return NextResponse.json({
      success: true,
      date: today,
      auctions: auctions,
      count: auctions.length
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}