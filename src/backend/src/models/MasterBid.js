// models/MasterBid.js
// Extended MasterBid model for Dream60 - comprehensive platform configuration
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Decimal = mongoose.Schema.Types.Decimal128;

const MasterBidSchema = new mongoose.Schema({
  uuid: { type: String, default: () => uuidv4(), index: { unique: true } },

  // Basic identity
  platform_name: { type: String, required: true, default: 'Dream60', trim: true },
  version: { type: String, required: true, default: '1.0.0' }, // config versioning
  description: { type: String, default: 'Dream60 auction platform master configuration' },

  // Currency / localization
  currency: { type: String, required: true, default: 'INR' },
  timezone: { type: String, required: true, default: 'Asia/Kolkata' },
  locale: { type: String, default: 'en-IN' },

  // Auction core counts
  daily_auction_count: { type: Number, required: true, default: 10, min: 1 },
  boxes_per_auction: { type: Number, required: true, default: 6, min: 1, max: 12 },
  entry_boxes_count: { type: Number, required: true, default: 2, min: 0, max: 6 },
  bidding_boxes_count: { type: Number, required: true, default: 4, min: 0, max: 6 },

  // Timing & schedule defaults (minutes/hours)
  entry_opening_minutes_before: { type: Number, required: true, default: 5, min: 0 },
  round_duration_minutes: { type: Number, required: true, default: 15, min: 1 },
  daily_start_hour: { type: Number, required: true, default: 9, min: 0, max: 23 },
  daily_end_hour: {
    type: Number, required: true, default: 19, min: 0, max: 23,
    validate: { validator: function(v) { return v > this.daily_start_hour; }, message: 'daily_end_hour must be > daily_start_hour' }
  },

  // Entry fee rules
  entry_fee_min: { type: Decimal, required: true, default: 1000.00 },
  entry_fee_max: { type: Decimal, required: true, default: 3500.00 },
  entry_fee_currency_multiplier: { type: Number, default: 1.0 }, // for promotions (e.g., 0.5 half price)
  entry_split_between_boxes: { type: Number, default: 2, min: 1 }, // normally 2 => split equally between Box1 & Box2

  // Bid restrictions & limits
  max_bid_percentage_of_prize: { type: Number, required: true, default: 0.9, min: 0, max: 1 },
  minimum_bid_increment_absolute: { type: Decimal, default: 10.00 }, // absolute rupee increment
  minimum_bid_increment_percentage: { type: Number, default: 0.01 }, // or 1% increment
  bid_cooldown_seconds: { type: Number, default: 5, min: 0 }, // limit spam: 1 bid per X seconds
  duplicate_bid_window_seconds: { type: Number, default: 30 }, // prevent near-duplicate payments
  bids_per_user_per_day_limit: { type: Number, default: 1000 }, // soft limit per user per day

  // Box-level default min/max (applies to bidding boxes unless overridden per HourlyBid/AuctionBox)
  default_box_min_bid: { type: Decimal, default: 100.00 },
  default_box_max_bid_percent_of_prize: { type: Number, default: 0.9 },

  // Payment settings & gateway defaults
  payments: {
    require_successful_entry_before_bidding: { type: Boolean, default: true },
    allow_partial_refund_on_error: { type: Boolean, default: false },
    gateway_default: { type: String, default: 'Razorpay' },
    supported_gateways: { type: [String], default: ['Razorpay', 'Paytm', 'Stripe'] },
    payment_timeout_seconds: { type: Number, default: 900 } // 15 minutes
  },

  // Feature flags & toggles
  features: {
    is_active: { type: Boolean, default: true, index: true },
    maintenance_mode: { type: Boolean, default: false },
    allow_guest_play: { type: Boolean, default: false }, // allow non-registered users? usually false
    allow_bulk_entry: { type: Boolean, default: false }, // allow multiple entry payments
    allow_bid_edit: { type: Boolean, default: false }, // allow increase before winning
    enable_auditlog: { type: Boolean, default: true },
    enable_leaderboard: { type: Boolean, default: true },
    enable_notifications: { type: Boolean, default: true },
    enable_webhooks: { type: Boolean, default: false }
  },

  // Prize defaults & catalog rules
  prize_defaults: {
    default_max_bid_percent: { type: Number, default: 0.9 },
    prize_display_markup_percent: { type: Number, default: 0.0 }, // display_value = market_value * (1 + markup)
    prize_award_window_days: { type: Number, default: 30 } // time to deliver prize
  },

  // Limits & fraud prevention
  fraud: {
    ip_ban_threshold_failed_payments: { type: Number, default: 5 },
    ip_rate_limit_per_minute: { type: Number, default: 60 },
    detect_multiple_accounts_same_device_window_days: { type: Number, default: 30 },
    require_kyc_above_amount: { type: Decimal, default: 50000.00 } // require KYC for big spends
  },

  // Rate-limiting for API actions (can be used by gateway)
  rate_limits: {
    place_bid_per_minute: { type: Number, default: 12 },
    create_payment_per_minute: { type: Number, default: 6 },
    login_attempts_per_hour: { type: Number, default: 10 }
  },

  // Cron / scheduler names (for admin to change jobs without code change)
  scheduler: {
    daily_auction_creation_cron: { type: String, default: '0 0 * * *' }, // midnight server cron
    box_opening_job_id: { type: String, default: 'job_open_boxes' },
    box_closing_job_id: { type: String, default: 'job_close_boxes' },
    determine_winner_job_id: { type: String, default: 'job_determine_winner' }
  },

  // Webhook endpoints for publishing events (admins can configure)
  webhooks: [{
    name: { type: String },
    url: { type: String },
    secret: { type: String },
    enabled: { type: Boolean, default: false },
    events: { type: [String], default: ['AUCTION_CREATED','BOX_CLOSED','WINNER_DETERMINED','PAYMENT_SUCCESS'] }
  }],

  // Notification templates (store keys for referencing i18n templates)
  notifications: {
    push_template_prefix: { type: String, default: 'dream60.push.' },
    email_template_prefix: { type: String, default: 'dream60.email.' },
    sms_template_prefix: { type: String, default: 'dream60.sms.' }
  },

  // Admin limits & auditing
  admin: {
    allow_config_edit: { type: Boolean, default: true },
    audit_retention_days: { type: Number, default: 365 },
    critical_change_notification_emails: { type: [String], default: [] }
  },

  // Defaults for reporting / KPIs
  kpi_defaults: {
    leaderboard_recalc_interval_minutes: { type: Number, default: 60 },
    retention_window_days: { type: Number, default: 30 }
  },

  // Logging & monitoring knobs
  monitoring: {
    enable_metrics_export: { type: Boolean, default: true },
    metrics_endpoint: { type: String, default: '/metrics' }
  },

  // Any platform-wide metadata for future use
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },

  // Soft-delete / lifecycle
  archived: { type: Boolean, default: false },

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Indexes
 */
MasterBidSchema.index({ platform_name: 1 }, { unique: true, partialFilterExpression: { platform_name: { $exists: true } } });
MasterBidSchema.index({ 'features.is_active': 1 });
MasterBidSchema.index({ uuid: 1 });

/**
 * Instance helpers
 */

// compute equal split per entry box (returns number)
MasterBidSchema.methods.computeEntrySplit = function(entryFeeAmount) {
  const boxes = Number(this.entry_split_between_boxes || 2);
  const amt = parseFloat(entryFeeAmount);
  if (isNaN(amt) || boxes <= 0) return null;
  // use two-decimal rounding
  return Math.round((amt / boxes) * 100) / 100;
};

// compute auction slot times given a date and slot number (1..daily_auction_count)
// returns { start: Date, end: Date, entryOpen: Date, entryClose: Date }
MasterBidSchema.methods.computeSlotTimes = function(auctionDateISO, slotNumber) {
  // auctionDateISO: 'YYYY-MM-DD' (string) or Date
  const date = (auctionDateISO instanceof Date) ? new Date(auctionDateISO) : new Date(`${auctionDateISO}T00:00:00`);
  const startHour = Number(this.daily_start_hour);
  const slotIndex = Number(slotNumber) - 1;
  const start = new Date(date);
  start.setHours(startHour + slotIndex, 0, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);
  const entryOpen = new Date(start);
  entryOpen.setMinutes(entryOpen.getMinutes() - Number(this.entry_opening_minutes_before));
  const entryClose = new Date(start);
  entryClose.setMinutes(entryClose.getMinutes() + Number(this.round_duration_minutes)); // entry closes after X minutes
  return { start, end, entryOpen, entryClose };
};

/**
 * Statics
 */
MasterBidSchema.statics.getActiveConfig = async function() {
  // Fetch the active (is_active && not archived) config. Prefer latest updated.
  return this.findOne({ 'features.is_active': true, archived: false }).sort({ updated_at: -1 }).lean();
};

/**
 * Pre-save validations
 */
MasterBidSchema.pre('save', function(next) {
  // Ensure entry_fee_min <= entry_fee_max
  try {
    const min = parseFloat(this.entry_fee_min.toString());
    const max = parseFloat(this.entry_fee_max.toString());
    if (min > max) return next(new Error('entry_fee_min cannot be greater than entry_fee_max'));
  } catch (e) {
    // skip if not set (shouldn't happen)
  }
  // Make sure split count <= boxes_per_auction
  if (this.entry_split_between_boxes > this.boxes_per_auction) {
    return next(new Error('entry_split_between_boxes cannot be greater than boxes_per_auction'));
  }
  next();
});

/**
 * Export model
 */
module.exports = mongoose.model('MasterBid', MasterBidSchema);
