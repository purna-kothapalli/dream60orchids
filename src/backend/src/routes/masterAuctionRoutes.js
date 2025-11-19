const express = require('express');
const router = express.Router();

// Controller
let controller;
try {
  controller = require('../controllers/masterAuctionController');
} catch (e) {
  controller = require('../../controllers/masterAuctionController');
}

/**
 * @openapi
 * components:
 *   schemas:
 *     FeeSplits:
 *       type: object
 *       properties:
 *         BoxA:
 *           type: number
 *           example: 20.0
 *         BoxB:
 *           type: number
 *           example: 30.0
 *       required: [BoxA, BoxB]
 *     RoundConfig:
 *       type: object
 *       properties:
 *         round:
 *           type: integer
 *           example: 1
 *         minPlayers:
 *           type: integer
 *           example: 500
 *         duration:
 *           type: integer
 *           description: duration in minutes (default 15)
 *           example: 15
 *         maxBid:
 *           type: number
 *           example: 58200.0
 *         roundCutoffPercentage:
 *           type: number
 *           example: 40
 *         topBidAmountsPerRound:
 *           type: integer
 *           example: 3
 *     DailyAuction:
 *       type: object
 *       properties:
 *         auctionNumber:
 *           type: integer
 *           example: 1
 *         auctionId:
 *           type: string
 *           format: uuid
 *           example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         TimeSlot:
 *           type: string
 *           example: "13:45"
 *         auctionName:
 *           type: string
 *           example: "iPhone 14 Pro"
 *         prizeValue:
 *           type: number
 *           example: 65000.00
 *         Status:
 *           type: string
 *           enum: [LIVE, UPCOMING, COMPLETED, CANCELLED]
 *           example: UPCOMING
 *         maxDiscount:
 *           type: number
 *           example: 10
 *         EntryFee:
 *           type: string
 *           enum: [RANDOM, MANUAL]
 *           example: RANDOM
 *         minEntryFee:
 *           type: number
 *           example: 20
 *         maxEntryFee:
 *           type: number
 *           example: 80
 *         FeeSplits:
 *           $ref: '#/components/schemas/FeeSplits'
 *         roundCount:
 *           type: integer
 *           example: 4
 *         roundConfig:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoundConfig'
 *       required: [auctionNumber, auctionId, TimeSlot, auctionName, prizeValue, EntryFee]
 *     MasterAuctionCreate:
 *       type: object
 *       properties:
 *         master_id:
 *           type: string
 *           format: uuid
 *           example: "6fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         createdBy:
 *           type: string
 *           format: uuid
 *           example: "0fa85f64-5717-4562-b3fc-2c963f66afa6"
 *         isActive:
 *           type: boolean
 *           example: true
 *         totalAuctionsPerDay:
 *           type: integer
 *           example: 10
 *         dailyAuctionConfig:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DailyAuction'
 *       required: [createdBy, totalAuctionsPerDay, dailyAuctionConfig]
 *     MasterAuctionResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/MasterAuctionCreate'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "64b7f5f0c9e77f0012345678"
 *             createdAt:
 *               type: string
 *               format: date-time
 *               example: "2025-11-18T10:30:00.000Z"
 *             modifiedAt:
 *               type: string
 *               format: date-time
 *             masterCode:
 *               type: string
 *               example: "MA000001"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *     ValidationErrors:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example: ["dailyAuctionConfig[0]: minEntryFee and maxEntryFee required"]
 */

/**
 * @openapi
 * /api/v1/master-auctions:
 *   get:
 *     tags:
 *       - MasterAuction
 *     summary: Get list of Master Auctions
 *     description: Returns a paginated list of master auctions. You can filter by isActive and by daily auction status (LIVE/UPCOMING/COMPLETED/CANCELLED).
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active master auctions (true/false)
 *         example: true
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [LIVE, UPCOMING, COMPLETED, CANCELLED]
 *         description: Find Master Auctions that contain at least one daily auction with this status
 *         example: UPCOMING
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Page size (max 200)
 *         example: 50
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (1-based)
 *         example: 1
 *     responses:
 *       '200':
 *         description: OK - Returns list of master auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MasterAuctionResponse'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 2
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 50
 *                     pages:
 *                       type: integer
 *                       example: 1
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', controller.getAllMasterAuctions);

/**
 * @openapi
 * /api/v1/master-auctions:
 *   post:
 *     tags:
 *       - MasterAuction
 *     summary: Create a new Master Auction
 *     description: Create a master auction. Provide createdBy as a UUID or user identifier. If isActive=true the controller will deactivate other active master auctions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MasterAuctionCreate'
 *           example:
 *             createdBy: "0fa85f64-5717-4562-b3fc-2c963f66afa6"
 *             isActive: true
 *             totalAuctionsPerDay: 10
 *             dailyAuctionConfig:
 *               - auctionNumber: 1
 *                 TimeSlot: "12:00"
 *                 auctionName: "iPhone 14 Pro"
 *                 prizeValue: 65000.0
 *                 Status: UPCOMING
 *                 maxDiscount: 10
 *                 EntryFee: RANDOM
 *                 minEntryFee: 20
 *                 maxEntryFee: 80
 *                 roundCount: 4
 *                 roundConfig:
 *                   - round: 1
 *                     duration: 15
 *                     roundCutoffPercentage: 40
 *                     topBidAmountsPerRound: 3
 *     responses:
 *       '201':
 *         description: Created - returns the created MasterAuction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MasterAuctionResponse'
 *       '400':
 *         description: Validation error or missing user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrors'
 *       '409':
 *         description: Duplicate resource (unique index violation)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', controller.createMasterAuction);

module.exports = router;
