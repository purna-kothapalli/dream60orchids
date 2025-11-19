import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Add daily_auctions table
export const dailyAuctions = sqliteTable('daily_auctions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  masterId: text('master_id').notNull(),
  auctionNumber: integer('auction_number').notNull(),
  auctionId: text('auction_id').notNull().unique(),
  timeSlot: text('time_slot').notNull(),
  auctionName: text('auction_name').notNull(),
  imageUrl: text('image_url'),
  prizeValue: integer('prize_value').notNull(),
  status: text('status').notNull(),
  maxDiscount: integer('max_discount').notNull(),
  entryFeeType: text('entry_fee_type').notNull(),
  minEntryFee: integer('min_entry_fee'),
  maxEntryFee: integer('max_entry_fee'),
  feeSplitsBoxA: integer('fee_splits_box_a'),
  feeSplitsBoxB: integer('fee_splits_box_b'),
  roundCount: integer('round_count').notNull(),
  roundConfig: text('round_config', { mode: 'json' }).notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});