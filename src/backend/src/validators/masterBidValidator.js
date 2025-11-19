// validators/masterBidValidator.js
const Joi = require('joi');

// A compact Joi schema that covers main/required fields.
// Expand as needed to validate nested objects strictly.
const masterBidCreateSchema = Joi.object({
  platform_name: Joi.string().trim().min(1).default('Dream60'),
  version: Joi.string().optional(),
  description: Joi.string().optional(),
  currency: Joi.string().trim().default('INR'),
  timezone: Joi.string().trim().default('Asia/Kolkata'),
  locale: Joi.string().default('en-IN'),

  daily_auction_count: Joi.number().integer().min(1).default(10),
  boxes_per_auction: Joi.number().integer().min(1).default(6),
  entry_boxes_count: Joi.number().integer().min(0).default(2),
  bidding_boxes_count: Joi.number().integer().min(0).default(4),

  entry_opening_minutes_before: Joi.number().integer().min(0).default(5),
  round_duration_minutes: Joi.number().integer().min(1).default(15),
  daily_start_hour: Joi.number().integer().min(0).max(23).default(9),
  daily_end_hour: Joi.number().integer().min(0).max(23).default(19),

  entry_fee_min: Joi.number().precision(2).min(0).default(1000.00),
  entry_fee_max: Joi.number().precision(2).min(0).default(3500.00),
  entry_split_between_boxes: Joi.number().integer().min(1).default(2),

  max_bid_percentage_of_prize: Joi.number().min(0).max(1).default(0.9),
  minimum_bid_increment_absolute: Joi.number().precision(2).min(0).default(10.00),
  minimum_bid_increment_percentage: Joi.number().min(0).max(1).default(0.01),

  payments: Joi.object().optional(),
  features: Joi.object().optional(),
  prize_defaults: Joi.object().optional(),
  fraud: Joi.object().optional(),
  rate_limits: Joi.object().optional(),
  scheduler: Joi.object().optional(),
  webhooks: Joi.array().items(Joi.object()).optional(),
  notifications: Joi.object().optional(),
  admin: Joi.object().optional(),
  kpi_defaults: Joi.object().optional(),
  monitoring: Joi.object().optional(),
  metadata: Joi.object().optional(),
  archived: Joi.boolean().optional()
}).unknown(true); // allow extra keys (schema evolves)

const validateCreateMasterBid = (req, res, next) => {
  const { error, value } = masterBidCreateSchema.validate(req.body, { stripUnknown: false, abortEarly: false });
  if (error) {
    return res.status(400).json({ success: false, message: 'Validation failed', details: error.details.map(d => d.message) });
  }
  req.body = value;
  return next();
};

module.exports = {
  validateCreateMasterBid
};
