CREATE TABLE `daily_auctions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`master_id` text NOT NULL,
	`auction_number` integer NOT NULL,
	`auction_id` text NOT NULL,
	`time_slot` text NOT NULL,
	`auction_name` text NOT NULL,
	`image_url` text,
	`prize_value` integer NOT NULL,
	`status` text NOT NULL,
	`max_discount` integer NOT NULL,
	`entry_fee_type` text NOT NULL,
	`min_entry_fee` integer,
	`max_entry_fee` integer,
	`fee_splits_box_a` integer,
	`fee_splits_box_b` integer,
	`round_count` integer NOT NULL,
	`round_config` text NOT NULL,
	`scheduled_date` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_auctions_auction_id_unique` ON `daily_auctions` (`auction_id`);