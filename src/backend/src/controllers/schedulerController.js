// src/backend/src/controllers/schedulerController.js
const auctionScheduler = require('../services/auctionScheduler');
const MasterAuction = require('../models/MasterAuction');

/**
 * Initialize daily auctions (called at 9:00 AM or manually)
 */
exports.initializeDailyAuctions = async (req, res) => {
  try {
    const { masterAuctionId } = req.body;

    if (!masterAuctionId) {
      return res.status(400).json({
        success: false,
        error: 'masterAuctionId is required',
      });
    }

    // Verify master auction exists
    const masterAuction = await MasterAuction.findById(masterAuctionId);
    if (!masterAuction) {
      return res.status(404).json({
        success: false,
        error: 'Master auction not found',
      });
    }

    const result = await auctionScheduler.initializeDailyAuctions(masterAuctionId);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error in initializeDailyAuctions:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to initialize daily auctions',
    });
  }
};

/**
 * Progress auctions (mark LIVE as COMPLETED, create new UPCOMING)
 */
exports.progressAuctions = async (req, res) => {
  try {
    const { masterAuctionId } = req.body;

    if (!masterAuctionId) {
      return res.status(400).json({
        success: false,
        error: 'masterAuctionId is required',
      });
    }

    const result = await auctionScheduler.progressAuctions(masterAuctionId);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error in progressAuctions:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to progress auctions',
    });
  }
};

/**
 * Get current auction status
 */
exports.getCurrentStatus = async (req, res) => {
  try {
    const { masterAuctionId } = req.params;

    if (!masterAuctionId) {
      return res.status(400).json({
        success: false,
        error: 'masterAuctionId is required',
      });
    }

    const result = await auctionScheduler.getCurrentAuctionStatus(masterAuctionId);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getCurrentStatus:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get auction status',
    });
  }
};

/**
 * Get current live auctions
 */
exports.getCurrentAuctions = async (req, res) => {
  try {
    const { masterAuctionId } = req.params;

    if (!masterAuctionId) {
      return res.status(400).json({
        success: false,
        error: 'masterAuctionId is required',
      });
    }

    const result = await auctionScheduler.getCurrentAuctionStatus(masterAuctionId);
    
    return res.status(200).json({
      success: true,
      live: result.auctions.live,
      upcoming: result.auctions.upcoming,
      currentTime: result.currentTime,
      date: result.date,
    });
  } catch (error) {
    console.error('Error in getCurrentAuctions:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get current auctions',
    });
  }
};

/**
 * Reset daily auctions (for testing or manual reset)
 */
exports.resetDailyAuctions = async (req, res) => {
  try {
    const { masterAuctionId } = req.body;

    if (!masterAuctionId) {
      return res.status(400).json({
        success: false,
        error: 'masterAuctionId is required',
      });
    }

    const result = await auctionScheduler.resetDailyAuctions(masterAuctionId);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in resetDailyAuctions:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to reset daily auctions',
    });
  }
};

/**
 * Start automatic scheduler
 */
exports.startScheduler = async (req, res) => {
  try {
    const { masterAuctionId, intervalMinutes = 1 } = req.body;

    if (!masterAuctionId) {
      return res.status(400).json({
        success: false,
        error: 'masterAuctionId is required',
      });
    }

    auctionScheduler.startScheduler(masterAuctionId, intervalMinutes);
    
    return res.status(200).json({
      success: true,
      message: `Scheduler started for master ${masterAuctionId}`,
      intervalMinutes,
    });
  } catch (error) {
    console.error('Error in startScheduler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to start scheduler',
    });
  }
};

/**
 * Stop automatic scheduler
 */
exports.stopScheduler = async (req, res) => {
  try {
    auctionScheduler.stopScheduler();
    
    return res.status(200).json({
      success: true,
      message: 'Scheduler stopped',
    });
  } catch (error) {
    console.error('Error in stopScheduler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to stop scheduler',
    });
  }
};
