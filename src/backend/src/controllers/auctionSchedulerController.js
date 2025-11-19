// src/backend/src/controllers/auctionSchedulerController.js
const auctionCronScheduler = require('../services/auctionCronScheduler');

/**
 * Controller for Auction Scheduler API endpoints
 */
class AuctionSchedulerController {
  /**
   * Initialize the scheduler with a master auction ID
   * POST /api/v1/scheduler/initialize
   */
  async initialize(req, res) {
    try {
      const { masterAuctionId } = req.body;

      if (!masterAuctionId) {
        return res.status(400).json({
          success: false,
          message: 'masterAuctionId is required',
        });
      }

      const result = await auctionCronScheduler.initialize(masterAuctionId);

      return res.status(200).json({
        success: true,
        message: 'Scheduler initialized successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error in initialize:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to initialize scheduler',
        error: error.toString(),
      });
    }
  }

  /**
   * Start all cron jobs
   * POST /api/v1/scheduler/start
   */
  async startCronJobs(req, res) {
    try {
      const result = auctionCronScheduler.startAllCronJobs();

      return res.status(200).json({
        success: true,
        message: 'All cron jobs started successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error in startCronJobs:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to start cron jobs',
        error: error.toString(),
      });
    }
  }

  /**
   * Stop all cron jobs
   * POST /api/v1/scheduler/stop
   */
  async stopCronJobs(req, res) {
    try {
      const result = auctionCronScheduler.stopAllCronJobs();

      return res.status(200).json({
        success: true,
        message: 'All cron jobs stopped successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error in stopCronJobs:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to stop cron jobs',
        error: error.toString(),
      });
    }
  }

  /**
   * Get status of all cron jobs
   * GET /api/v1/scheduler/status
   */
  async getStatus(req, res) {
    try {
      const result = auctionCronScheduler.getJobsStatus();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in getStatus:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get scheduler status',
        error: error.toString(),
      });
    }
  }

  /**
   * Get current auction status
   * GET /api/v1/scheduler/current-auctions
   */
  async getCurrentAuctions(req, res) {
    try {
      const result = await auctionCronScheduler.getCurrentStatus();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error in getCurrentAuctions:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get current auctions',
        error: error.toString(),
      });
    }
  }

  /**
   * Manual trigger: Initialize daily auctions
   * POST /api/v1/scheduler/manual/initialize
   */
  async manualInitialize(req, res) {
    try {
      const result = await auctionCronScheduler.manualTriggerInitialization();

      return res.status(200).json({
        success: true,
        message: 'Manual initialization triggered',
        data: result,
      });
    } catch (error) {
      console.error('Error in manualInitialize:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to manually initialize auctions',
        error: error.toString(),
      });
    }
  }

  /**
   * Manual trigger: Progress auctions
   * POST /api/v1/scheduler/manual/progress
   */
  async manualProgress(req, res) {
    try {
      const result = await auctionCronScheduler.manualTriggerProgression();

      return res.status(200).json({
        success: true,
        message: 'Manual progression triggered',
        data: result,
      });
    } catch (error) {
      console.error('Error in manualProgress:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to manually progress auctions',
        error: error.toString(),
      });
    }
  }

  /**
   * Manual trigger: Reset daily auctions
   * POST /api/v1/scheduler/manual/reset
   */
  async manualReset(req, res) {
    try {
      const result = await auctionCronScheduler.manualTriggerReset();

      return res.status(200).json({
        success: true,
        message: 'Manual reset triggered',
        data: result,
      });
    } catch (error) {
      console.error('Error in manualReset:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to manually reset auctions',
        error: error.toString(),
      });
    }
  }
}

module.exports = new AuctionSchedulerController();
