import { db } from '@/db';
import { dailyAuctions } from '@/db/schema';

async function main() {
    const today = new Date().toISOString().split('T')[0];
    const currentTimestamp = new Date().toISOString();
    
    const sampleDailyAuctions = [
        {
            masterId: 'master-test-001',
            auctionNumber: 1,
            auctionId: crypto.randomUUID(),
            timeSlot: '09:00',
            auctionName: 'Morning Premium Auction',
            imageUrl: 'https://example.com/auction1.jpg',
            prizeValue: 1000,
            status: 'LIVE',
            maxDiscount: 50,
            entryFeeType: 'RANDOM',
            minEntryFee: 10,
            maxEntryFee: 100,
            feeSplitsBoxA: 50,
            feeSplitsBoxB: 50,
            roundCount: 3,
            roundConfig: {
                rounds: [
                    { roundNumber: 1, duration: 300 },
                    { roundNumber: 2, duration: 300 },
                    { roundNumber: 3, duration: 300 }
                ]
            },
            scheduledDate: today,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            masterId: 'master-test-001',
            auctionNumber: 2,
            auctionId: crypto.randomUUID(),
            timeSlot: '10:00',
            auctionName: 'Mid-Morning Special',
            imageUrl: 'https://example.com/auction2.jpg',
            prizeValue: 1500,
            status: 'UPCOMING',
            maxDiscount: 60,
            entryFeeType: 'MANUAL',
            minEntryFee: 15,
            maxEntryFee: 150,
            feeSplitsBoxA: 50,
            feeSplitsBoxB: 50,
            roundCount: 3,
            roundConfig: {
                rounds: [
                    { roundNumber: 1, duration: 300 },
                    { roundNumber: 2, duration: 300 },
                    { roundNumber: 3, duration: 300 }
                ]
            },
            scheduledDate: today,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            masterId: 'master-test-001',
            auctionNumber: 3,
            auctionId: crypto.randomUUID(),
            timeSlot: '11:00',
            auctionName: 'Late Morning Flash Sale',
            imageUrl: null,
            prizeValue: 2000,
            status: 'UPCOMING',
            maxDiscount: 70,
            entryFeeType: 'RANDOM',
            minEntryFee: 20,
            maxEntryFee: 200,
            feeSplitsBoxA: 50,
            feeSplitsBoxB: 50,
            roundCount: 3,
            roundConfig: {
                rounds: [
                    { roundNumber: 1, duration: 300 },
                    { roundNumber: 2, duration: 300 },
                    { roundNumber: 3, duration: 300 }
                ]
            },
            scheduledDate: today,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            masterId: 'master-test-001',
            auctionNumber: 4,
            auctionId: crypto.randomUUID(),
            timeSlot: '12:00',
            auctionName: 'Noon Power Hour',
            imageUrl: 'https://example.com/auction4.jpg',
            prizeValue: 2500,
            status: 'COMPLETED',
            maxDiscount: 80,
            entryFeeType: 'MANUAL',
            minEntryFee: 25,
            maxEntryFee: 250,
            feeSplitsBoxA: 50,
            feeSplitsBoxB: 50,
            roundCount: 3,
            roundConfig: {
                rounds: [
                    { roundNumber: 1, duration: 300 },
                    { roundNumber: 2, duration: 300 },
                    { roundNumber: 3, duration: 300 }
                ]
            },
            scheduledDate: today,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            masterId: 'master-test-001',
            auctionNumber: 5,
            auctionId: crypto.randomUUID(),
            timeSlot: '13:00',
            auctionName: 'Afternoon Mega Deal',
            imageUrl: 'https://example.com/auction5.jpg',
            prizeValue: 3000,
            status: 'COMPLETED',
            maxDiscount: 90,
            entryFeeType: 'RANDOM',
            minEntryFee: 30,
            maxEntryFee: 300,
            feeSplitsBoxA: 50,
            feeSplitsBoxB: 50,
            roundCount: 3,
            roundConfig: {
                rounds: [
                    { roundNumber: 1, duration: 300 },
                    { roundNumber: 2, duration: 300 },
                    { roundNumber: 3, duration: 300 }
                ]
            },
            scheduledDate: today,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        }
    ];

    await db.insert(dailyAuctions).values(sampleDailyAuctions);
    
    console.log('✅ Daily auctions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});