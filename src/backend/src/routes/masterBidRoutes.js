// src/routes/masterBidRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllMasterBids,
  createMasterBid
} = require('../controllers/masterBidController');
const { validateCreateMasterBid } = require('../validators/masterBidValidator');

/**
 * NOTE:
 * - Controllers accept filters via query params.
 * - POST should be protected by admin/auth middleware in production.
 */

/**
 * tiny middleware: ensure admin-like header exists (for demo/dev)
 * In production replace with your real auth & role-check middleware
 */
const ensureAdmin = (req, res, next) => {
  // Allow in non-production automatically (dev convenience)
  if (process.env.NODE_ENV !== 'production' && process.env.SKIP_ADMIN_CHECK === 'true') {
    return next();
  }

  const isAdmin =
    (req.headers && (req.headers['x-admin'] === 'true' || req.headers['x_admin'] === 'true')) ||
    (req.query && req.query.admin === 'true');

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required. Provide X-Admin: true header or ?admin=true (dev only).',
    });
  }
  next();
};


/**
 * tiny middleware: ensure a user_bid_id (preferred) or user_id (fallback) is present
 * - Looks in body.user_bid_id, X-User-Bid-Id header, query.user_bid_id
 * - If not found, looks for user_id in same locations as fallback.
 * - Attaches resolved keys to req.resolvedUserBidId / req.resolvedUserId for downstream use.
 */
const ensureUserBidOrUser = (req, res, next) => {
  const body = req.body || {};
  const headers = req.headers || {};
  const query = req.query || {};

  const headerUserBid = headers['x-user-bid-id'] || headers['x_user_bid_id'];
  const headerUserId = headers['x-user-id'] || headers['x_user_id'];

  const userBidId =
    body.user_bid_id ||
    body.userBidId ||
    query.user_bid_id ||
    query.userBidId ||
    headerUserBid ||
    null;

  const userId =
    body.user_id ||
    body.userId ||
    query.user_id ||
    query.userId ||
    headerUserId ||
    null;

  if (!userBidId && !userId) {
    return res.status(400).json({
      success: false,
      message:
        'user_bid_id (preferred) or user_id (fallback) is required. Provide it in request body (user_bid_id), as query param (?user_bid_id=...), or header X-User-Bid-Id / X-User-Id.',
    });
  }

  if (userBidId) req.resolvedUserBidId = userBidId;
  if (userId) req.resolvedUserId = userId;

  next();
};

/**
 * @swagger
 * tags:
 *   - name: MasterBid
 *     description: Platform configuration (MasterBid) management
 *
 * components:
 *   schemas:
 *     MasterBid:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *           example: "a1b2c3d4-5f6g-7h8i-9j0k-lmnopqrstuv"
 *         platform_name:
 *           type: string
 *           example: "Dream60"
 *         version:
 *           type: string
 *           example: "1.0.0"
 *         description:
 *           type: string
 *           example: "Default master config"
 *         currency:
 *           type: string
 *           example: "INR"
 *         timezone:
 *           type: string
 *           example: "Asia/Kolkata"
 *         locale:
 *           type: string
 *           example: "en-IN"
 *
 *         daily_auction_count:
 *           type: integer
 *           example: 10
 *         boxes_per_auction:
 *           type: integer
 *           example: 6
 *         entry_boxes_count:
 *           type: integer
 *           example: 2
 *         bidding_boxes_count:
 *           type: integer
 *           example: 4
 *
 *         entry_opening_minutes_before:
 *           type: integer
 *           example: 5
 *         round_duration_minutes:
 *           type: integer
 *           example: 15
 *         daily_start_hour:
 *           type: integer
 *           example: 9
 *         daily_end_hour:
 *           type: integer
 *           example: 19
 *
 *         entry_fee_min:
 *           type: number
 *           format: float
 *           example: 1000.00
 *         entry_fee_max:
 *           type: number
 *           format: float
 *           example: 3500.00
 *         entry_split_between_boxes:
 *           type: integer
 *           example: 2
 *
 *         max_bid_percentage_of_prize:
 *           type: number
 *           format: float
 *           example: 0.9
 *         minimum_bid_increment_absolute:
 *           type: number
 *           format: float
 *           example: 10.00
 *         minimum_bid_increment_percentage:
 *           type: number
 *           format: float
 *           example: 0.01
 *
 *         payments:
 *           type: object
 *         features:
 *           type: object
 *         fraud:
 *           type: object
 *         rate_limits:
 *           type: object
 *         scheduler:
 *           type: object
 *         webhooks:
 *           type: array
 *           items:
 *             type: object
 *         notifications:
 *           type: object
 *         metadata:
 *           type: object
 *
 *         archived:
 *           type: boolean
 *           example: false
 *
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     MasterBidCreate:
 *       type: object
 *       properties:
 *         user_bid_id:
 *           type: string
 *           description: UserBid id (preferred). You may also provide user_id as fallback.
 *           example: "64e91cf5c13e5b6ff230e2ad"
 *         user_id:
 *           type: string
 *           description: User id (fallback if user_bid_id not provided)
 *           example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *         platform_name:
 *           type: string
 *           example: "Dream60"
 *         version:
 *           type: string
 *         description:
 *           type: string
 *         currency:
 *           type: string
 *           example: "INR"
 *         timezone:
 *           type: string
 *           example: "Asia/Kolkata"
 *
 *         daily_auction_count:
 *           type: integer
 *           example: 10
 *         boxes_per_auction:
 *           type: integer
 *           example: 6
 *         entry_boxes_count:
 *           type: integer
 *           example: 2
 *         bidding_boxes_count:
 *           type: integer
 *           example: 4
 *
 *         entry_opening_minutes_before:
 *           type: integer
 *           example: 5
 *         round_duration_minutes:
 *           type: integer
 *           example: 15
 *         daily_start_hour:
 *           type: integer
 *           example: 9
 *         daily_end_hour:
 *           type: integer
 *           example: 19
 *
 *         entry_fee_min:
 *           type: number
 *           format: float
 *           example: 1000.00
 *         entry_fee_max:
 *           type: number
 *           format: float
 *           example: 3500.00
 *         entry_split_between_boxes:
 *           type: integer
 *           example: 2
 *
 *         max_bid_percentage_of_prize:
 *           type: number
 *           format: float
 *           example: 0.9
 *         features:
 *           type: object
 *
 *       required:
 *         - platform_name
 *         - currency
 *         - timezone
 *
 *     PaginatedMasterBidResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MasterBid'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 1
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 50
 *             pages:
 *               type: integer
 *               example: 1
 *
 *     SingleMasterBidResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/MasterBid'
 */

/**
 * @swagger
 * /master-bids:
 *   get:
 *     summary: GET ALL MASTERBID CONFIGS
 *     description: Returns all MasterBid configurations. Supports pagination and active filter.
 *     tags: [MasterBid]
 *     parameters:
 *       - name: active
 *         in: query
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter only active configs (true/false)
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 50
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: MasterBid list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedMasterBidResponse'
 *       500:
 *         description: Server error
 */
router.get('/', getAllMasterBids);

/**
 * @swagger
 * /master-bids:
 *   post:
 *     summary: CREATE A NEW MASTERBID CONIFG
 *     description: Create a new platform configuration. Provide `user_bid_id` (preferred) OR `user_id` as fallback. If created config is active, existing active configs will be deactivated.
 *     tags: [MasterBid]
 *     security:
 *       - bearerAuth: []   # optional: integrate with your auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MasterBidCreate'
 *           examples:
 *             default:
 *               value:
 *                 user_bid_id: "64e91cf5c13e5b6ff230e2ad"
 *                 platform_name: "Dream60"
 *                 version: "1.0.1"
 *                 currency: "INR"
 *                 timezone: "Asia/Kolkata"
 *                 daily_auction_count: 10
 *                 boxes_per_auction: 6
 *                 entry_boxes_count: 2
 *                 bidding_boxes_count: 4
 *                 entry_opening_minutes_before: 5
 *                 round_duration_minutes: 15
 *                 daily_start_hour: 9
 *                 daily_end_hour: 19
 *                 entry_fee_min: 1000.00
 *                 entry_fee_max: 3500.00
 *                 entry_split_between_boxes: 2
 *                 max_bid_percentage_of_prize: 0.9
 *                 features:
 *                   is_active: true
 *                   maintenance_mode: false
 *     responses:
 *       201:
 *         description: Created - returns created MasterBid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SingleMasterBidResponse'
 *       400:
 *         description: Validation failed / missing user_bid_id
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Duplicate / unique constraint violation
 *       500:
 *         description: Server error
 */
// order: ensureAdmin (dev), ensureUserBidOrUser (require user reference), validate payload, controller
router.post('/', ensureUserBidOrUser, validateCreateMasterBid, createMasterBid);

module.exports = router;
