import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyAuctions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { master_id } = body;

    // Validate master_id is provided
    if (!master_id) {
      return NextResponse.json(
        { 
          error: 'master_id is required',
          code: 'MISSING_MASTER_ID' 
        },
        { status: 400 }
      );
    }

    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // Check if auctions already exist for today
    const existingAuctions = await db
      .select()
      .from(dailyAuctions)
      .where(eq(dailyAuctions.scheduledDate, today))
      .limit(1);

    if (existingAuctions.length > 0) {
      return NextResponse.json(
        {
          error: 'Auctions already initialized for today',
          code: 'ALREADY_INITIALIZED'
        },
        { status: 400 }
      );
    }

    // Get current timestamp
    const currentTimestamp = new Date().toISOString();

    // Define the 3 auctions to create
    const auctionsToCreate = [
      {
        masterId: master_id,
        auctionNumber: 1,
        auctionId: randomUUID(),
        timeSlot: '09:00',
        auctionName: 'Morning Auction 1',
        imageUrl: null,
        prizeValue: 1000,
        status: 'LIVE',
        maxDiscount: 50,
        entryFeeType: 'RANDOM',
        minEntryFee: 10,
        maxEntryFee: 100,
        feeSplitsBoxA: 50,
        feeSplitsBoxB: 50,
        roundCount: 3,
        roundConfig: JSON.stringify({
          rounds: [
            { roundNumber: 1, duration: 300 },
            { roundNumber: 2, duration: 300 },
            { roundNumber: 3, duration: 300 }
          ]
        }),
        scheduledDate: today,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
      },
      {
        masterId: master_id,
        auctionNumber: 2,
        auctionId: randomUUID(),
        timeSlot: '10:00',
        auctionName: 'Morning Auction 2',
        imageUrl: null,
        prizeValue: 1000,
        status: 'UPCOMING',
        maxDiscount: 50,
        entryFeeType: 'RANDOM',
        minEntryFee: 10,
        maxEntryFee: 100,
        feeSplitsBoxA: 50,
        feeSplitsBoxB: 50,
        roundCount: 3,
        roundConfig: JSON.stringify({
          rounds: [
            { roundNumber: 1, duration: 300 },
            { roundNumber: 2, duration: 300 },
            { roundNumber: 3, duration: 300 }
          ]
        }),
        scheduledDate: today,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
      },
      {
        masterId: master_id,
        auctionNumber: 3,
        auctionId: randomUUID(),
        timeSlot: '11:00',
        auctionName: 'Morning Auction 3',
        imageUrl: null,
        prizeValue: 1000,
        status: 'UPCOMING',
        maxDiscount: 50,
        entryFeeType: 'RANDOM',
        minEntryFee: 10,
        maxEntryFee: 100,
        feeSplitsBoxA: 50,
        feeSplitsBoxB: 50,
        roundCount: 3,
        roundConfig: JSON.stringify({
          rounds: [
            { roundNumber: 1, duration: 300 },
            { roundNumber: 2, duration: 300 },
            { roundNumber: 3, duration: 300 }
          ]
        }),
        scheduledDate: today,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
      }
    ];

    // Insert all auctions
    const createdAuctions = [];
    for (const auctionData of auctionsToCreate) {
      const [newAuction] = await db
        .insert(dailyAuctions)
        .values(auctionData)
        .returning();
      createdAuctions.push(newAuction);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Daily auctions initialized successfully',
        auctions: createdAuctions
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}