// src/backend/src/config/scheduler.js
const auctionScheduler = require('../services/auctionScheduler');
const MasterAuction = require('../models/MasterAuction');

/**
 * Initialize and start the auction scheduler
 * This should be called when the backend server starts
 */
async function initializeScheduler() {
  try {
    console.log('Initializing auction scheduler...');

    // Find the active master auction
    const masterAuction = await MasterAuction.findOne({ isActive: true }).sort({ createdAt: -1 });

    if (!masterAuction) {
      console.warn('No active master auction found. Scheduler not started.');
      return;
    }

    console.log(`Found active master auction: ${masterAuction.master_id}`);

    // Start the scheduler with 1-minute interval
    auctionScheduler.startScheduler(masterAuction._id, 1);

    console.log('Auction scheduler initialized successfully');
  } catch (error) {
    console.error('Error initializing scheduler:', error);
  }
}

/**
 * Gracefully shutdown the scheduler
 */
function shutdownScheduler() {
  console.log('Shutting down auction scheduler...');
  auctionScheduler.stopScheduler();
  console.log('Auction scheduler stopped');
}

module.exports = {
  initializeScheduler,
  shutdownScheduler,
};
