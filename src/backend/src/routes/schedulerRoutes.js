// src/backend/src/routes/schedulerRoutes.js
const express = require('express');
const router = express.Router();
const schedulerController = require('../controllers/auctionSchedulerController');

/**
 * @route   POST /api/v1/scheduler/initialize
 * @desc    Initialize the scheduler with a master auction ID
 * @access  Admin
 * @body    { masterAuctionId: string }
 */
router.post('/initialize', schedulerController.initialize);

/**
 * @route   POST /api/v1/scheduler/start
 * @desc    Start all cron jobs
 * @access  Admin
 */
router.post('/start', schedulerController.startCronJobs);

/**
 * @route   POST /api/v1/scheduler/stop
 * @desc    Stop all cron jobs
 * @access  Admin
 */
router.post('/stop', schedulerController.stopCronJobs);

/**
 * @route   GET /api/v1/scheduler/status
 * @desc    Get status of all cron jobs
 * @access  Admin
 */
router.get('/status', schedulerController.getStatus);

/**
 * @route   GET /api/v1/scheduler/current-auctions
 * @desc    Get current auction status (LIVE, UPCOMING, COMPLETED)
 * @access  Public
 */
router.get('/current-auctions', schedulerController.getCurrentAuctions);

// ===== Manual Trigger Routes (for testing) =====

/**
 * @route   POST /api/v1/scheduler/manual/initialize
 * @desc    Manually trigger daily auction initialization
 * @access  Admin
 */
router.post('/manual/initialize', schedulerController.manualInitialize);

/**
 * @route   POST /api/v1/scheduler/manual/progress
 * @desc    Manually trigger auction progression
 * @access  Admin
 */
router.post('/manual/progress', schedulerController.manualProgress);

/**
 * @route   POST /api/v1/scheduler/manual/reset
 * @desc    Manually trigger daily auction reset
 * @access  Admin
 */
router.post('/manual/reset', schedulerController.manualReset);

module.exports = router;