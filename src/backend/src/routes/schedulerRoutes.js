// src/backend/src/routes/schedulerRoutes.js
const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/schedulerController');

/**
 * @route   POST /api/scheduler/initialize
 * @desc    Initialize daily auctions (create first 3 auctions at 9 AM)
 * @body    { masterAuctionId: string }
 */
router.post('/initialize', schedulerController.initializeDailyAuctions);

/**
 * @route   POST /api/scheduler/progress
 * @desc    Progress auctions (mark LIVE as COMPLETED, create new UPCOMING)
 * @body    { masterAuctionId: string }
 */
router.post('/progress', schedulerController.progressAuctions);

/**
 * @route   GET /api/scheduler/status/:masterAuctionId
 * @desc    Get current auction status
 * @param   masterAuctionId - Master auction ID
 */
router.get('/status/:masterAuctionId', schedulerController.getCurrentStatus);

/**
 * @route   GET /api/scheduler/current/:masterAuctionId
 * @desc    Get current live and upcoming auctions
 * @param   masterAuctionId - Master auction ID
 */
router.get('/current/:masterAuctionId', schedulerController.getCurrentAuctions);

/**
 * @route   POST /api/scheduler/reset
 * @desc    Reset daily auctions (for testing)
 * @body    { masterAuctionId: string }
 */
router.post('/reset', schedulerController.resetDailyAuctions);

/**
 * @route   POST /api/scheduler/start
 * @desc    Start automatic scheduler
 * @body    { masterAuctionId: string, intervalMinutes?: number }
 */
router.post('/start', schedulerController.startScheduler);

/**
 * @route   POST /api/scheduler/stop
 * @desc    Stop automatic scheduler
 */
router.post('/stop', schedulerController.stopScheduler);

module.exports = router;
