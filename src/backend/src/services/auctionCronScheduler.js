// src/backend/src/services/auctionCronScheduler.js
const cron = require('node-cron');
const MasterAuction = require('../models/MasterAuction');
const DailyAuction = require('../models/DailyAuction');
const { randomUUID } = require('crypto');

/**
 * Cron-Based Auction Scheduler Service
 * Automatically manages daily auctions using cron jobs
 */
class AuctionCronScheduler {
  constructor() {
    this.cronJobs = new Map();
    this.DAILY_START_HOUR = 9; // Start at 9:00 AM
    this.masterAuctionId = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the scheduler with a master auction
   */
  async initialize(masterAuctionId) {
    try {
      this.masterAuctionId = masterAuctionId;
      
      // Verify master auction exists
      const masterAuction = await MasterAuction.findById(masterAuctionId);
      if (!masterAuction) {
        throw new Error('Master auction not found');
      }

      console.log(`✅ Auction Cron Scheduler initialized for master: ${masterAuctionId}`);
      this.isInitialized = true;
      
      return {
        success: true,
        message: 'Scheduler initialized successfully',
        masterAuctionId,
      };
    } catch (error) {
      console.error('Error initializing scheduler:', error);
      throw error;
    }
  }

  /**
   * Start all cron jobs
   */
  startAllCronJobs() {
    if (!this.isInitialized || !this.masterAuctionId) {
      throw new Error('Scheduler not initialized. Call initialize() first.');
    }

    // Stop any existing jobs first
    this.stopAllCronJobs();

    // 1. Daily initialization at 9:00 AM
    this.startInitializationCron();

    // 2. Hourly progression from 9 AM to 11 PM (every hour)
    this.startHourlyProgressionCron();

    // 3. Midnight reset at 00:00
    this.startMidnightResetCron();

    console.log('✅ All cron jobs started successfully');
    
    return {
      success: true,
      message: 'All cron jobs started',
      jobs: Array.from(this.cronJobs.keys()),
    };
  }

  /**
   * Cron Job 1: Initialize daily auctions at 9:00 AM
   * Creates first 3 auctions: 9 AM (LIVE), 10 AM (UPCOMING), 11 AM (UPCOMING)
   */
  startInitializationCron() {
    const job = cron.schedule('0 9 * * *', async () => {
      console.log(`\n🚀 [${new Date().toISOString()}] Running daily initialization at 9:00 AM`);
      try {
        await this.initializeDailyAuctions();
      } catch (error) {
        console.error('Error in initialization cron:', error);
      }
    }, {
      timezone: 'Asia/Kolkata',
    });

    this.cronJobs.set('initialization', job);
    console.log('✅ Initialization cron job scheduled: 9:00 AM daily');
  }

  /**
   * Cron Job 2: Hourly progression starting from 10:00 AM
   * Runs at 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
   */
  startHourlyProgressionCron() {
    // Run at minute 0 of hours 10-23 (10 AM to 11 PM)
    const job = cron.schedule('0 10-23 * * *', async () => {
      const currentHour = new Date().getHours();
      console.log(`\n⏰ [${new Date().toISOString()}] Running hourly progression at ${currentHour}:00`);
      try {
        await this.progressAuctions();
      } catch (error) {
        console.error('Error in hourly progression cron:', error);
      }
    }, {
      timezone: 'Asia/Kolkata',
    });

    this.cronJobs.set('hourly_progression', job);
    console.log('✅ Hourly progression cron job scheduled: 10:00 AM - 11:00 PM');
  }

  /**
   * Cron Job 3: Midnight reset at 00:00
   * Clears all daily auctions for a fresh start
   */
  startMidnightResetCron() {
    const job = cron.schedule('0 0 * * *', async () => {
      console.log(`\n🌙 [${new Date().toISOString()}] Running midnight reset at 00:00`);
      try {
        await this.resetDailyAuctions();
      } catch (error) {
        console.error('Error in midnight reset cron:', error);
      }
    }, {
      timezone: 'Asia/Kolkata',
    });

    this.cronJobs.set('midnight_reset', job);
    console.log('✅ Midnight reset cron job scheduled: 00:00 daily');
  }

  /**
   * Stop all cron jobs
   */
  stopAllCronJobs() {
    this.cronJobs.forEach((job, name) => {
      job.stop();
      console.log(`⏹️ Stopped cron job: ${name}`);
    });
    this.cronJobs.clear();
    
    return {
      success: true,
      message: 'All cron jobs stopped',
    };
  }

  /**
   * Get status of all cron jobs
   */
  getJobsStatus() {
    const jobs = [];
    this.cronJobs.forEach((job, name) => {
      jobs.push({
        name,
        running: true, // If it's in the map, it's running
      });
    });

    return {
      success: true,
      isInitialized: this.isInitialized,
      masterAuctionId: this.masterAuctionId,
      jobs,
      totalJobs: jobs.length,
    };
  }

  // ===== Core Logic Methods =====

  /**
   * Initialize daily auctions (runs at 9:00 AM)
   * Creates first 3 auctions
   */
  async initializeDailyAuctions() {
    try {
      const masterAuction = await MasterAuction.findById(this.masterAuctionId);
      if (!masterAuction) {
        throw new Error('Master auction not found');
      }

      const currentDate = this.getCurrentDate();

      // Check if already initialized today
      const existingAuctions = await DailyAuction.getTodayAuctions(
        this.masterAuctionId,
        currentDate
      );

      if (existingAuctions.length > 0) {
        console.log('⚠️ Daily auctions already initialized for today');
        return {
          success: false,
          message: 'Already initialized',
          count: existingAuctions.length,
        };
      }

      const dailyConfigs = masterAuction.dailyAuctionConfig;
      const newAuctions = [];

      // Create first 3 auctions
      for (let i = 0; i < Math.min(3, dailyConfigs.length); i++) {
        const config = dailyConfigs[i];
        const hour = this.DAILY_START_HOUR + i;

        const auction = new DailyAuction({
          auctionId: randomUUID(),
          masterAuctionId: this.masterAuctionId,
          auctionNumber: i + 1,
          date: currentDate,
          TimeSlot: this.formatTimeSlot(hour),
          auctionName: config.auctionName,
          imageUrl: config.imageUrl,
          prizeValue: config.prizeValue,
          Status: i === 0 ? 'LIVE' : 'UPCOMING',
          maxDiscount: config.maxDiscount,
          EntryFee: config.EntryFee,
          minEntryFee: config.minEntryFee,
          maxEntryFee: config.maxEntryFee,
          FeeSplits: config.FeeSplits,
          roundCount: config.roundCount,
          roundConfig: config.roundConfig,
        });

        await auction.save();
        newAuctions.push(auction);
      }

      console.log(`✅ Initialized ${newAuctions.length} auctions for today`);
      
      return {
        success: true,
        message: 'Daily auctions initialized',
        count: newAuctions.length,
        auctions: newAuctions,
      };
    } catch (error) {
      console.error('Error initializing daily auctions:', error);
      throw error;
    }
  }

  /**
   * Progress auctions (runs every hour from 10 AM to 11 PM)
   * - Marks past LIVE auction as COMPLETED
   * - Makes current hour auction LIVE
   * - Creates next UPCOMING auction
   */
  async progressAuctions() {
    try {
      const masterAuction = await MasterAuction.findById(this.masterAuctionId);
      if (!masterAuction) {
        throw new Error('Master auction not found');
      }

      const currentDate = this.getCurrentDate();
      const currentHour = this.getCurrentHour();

      // Get today's auctions
      const todayAuctions = await DailyAuction.getTodayAuctions(
        this.masterAuctionId,
        currentDate
      );

      if (todayAuctions.length === 0) {
        console.log('⚠️ No auctions found for today');
        return {
          success: false,
          message: 'No auctions to progress',
        };
      }

      const updates = [];

      // Step 1: Mark previous hour's LIVE auction as COMPLETED
      const previousHour = currentHour - 1;
      const previousAuction = todayAuctions.find(
        (a) => this.parseTimeSlot(a.TimeSlot) === previousHour
      );

      if (previousAuction && previousAuction.Status === 'LIVE') {
        previousAuction.Status = 'COMPLETED';
        await previousAuction.save();
        updates.push({
          action: 'COMPLETED',
          auctionId: previousAuction.auctionId,
          TimeSlot: previousAuction.TimeSlot,
        });
        console.log(`✅ Marked ${previousAuction.TimeSlot} auction as COMPLETED`);
      }

      // Step 2: Make current hour's auction LIVE
      const currentAuction = todayAuctions.find(
        (a) => this.parseTimeSlot(a.TimeSlot) === currentHour
      );

      if (currentAuction && currentAuction.Status === 'UPCOMING') {
        currentAuction.Status = 'LIVE';
        await currentAuction.save();
        updates.push({
          action: 'LIVE',
          auctionId: currentAuction.auctionId,
          TimeSlot: currentAuction.TimeSlot,
        });
        console.log(`✅ Marked ${currentAuction.TimeSlot} auction as LIVE`);
      }

      // Step 3: Create next UPCOMING auction (2 hours ahead)
      const nextHour = currentHour + 2;
      const dailyConfigs = masterAuction.dailyAuctionConfig;
      const nextAuctionNumber = todayAuctions.length + 1;

      // Check if we should create a new auction
      const existingNextAuction = todayAuctions.find(
        (a) => this.parseTimeSlot(a.TimeSlot) === nextHour
      );

      if (!existingNextAuction && nextAuctionNumber <= dailyConfigs.length) {
        const nextConfig = dailyConfigs[nextAuctionNumber - 1];

        const newAuction = new DailyAuction({
          auctionId: randomUUID(),
          masterAuctionId: this.masterAuctionId,
          auctionNumber: nextAuctionNumber,
          date: currentDate,
          TimeSlot: this.formatTimeSlot(nextHour),
          auctionName: nextConfig.auctionName,
          imageUrl: nextConfig.imageUrl,
          prizeValue: nextConfig.prizeValue,
          Status: 'UPCOMING',
          maxDiscount: nextConfig.maxDiscount,
          EntryFee: nextConfig.EntryFee,
          minEntryFee: nextConfig.minEntryFee,
          maxEntryFee: nextConfig.maxEntryFee,
          FeeSplits: nextConfig.FeeSplits,
          roundCount: nextConfig.roundCount,
          roundConfig: nextConfig.roundConfig,
        });

        await newAuction.save();
        updates.push({
          action: 'CREATED',
          auctionId: newAuction.auctionId,
          TimeSlot: newAuction.TimeSlot,
        });
        console.log(`✅ Created new UPCOMING auction for ${newAuction.TimeSlot}`);
      }

      return {
        success: true,
        message: 'Auctions progressed successfully',
        currentHour: this.formatTimeSlot(currentHour),
        updates,
      };
    } catch (error) {
      console.error('Error progressing auctions:', error);
      throw error;
    }
  }

  /**
   * Reset daily auctions (runs at midnight)
   * Clears all today's auctions for a fresh start
   */
  async resetDailyAuctions() {
    try {
      const currentDate = this.getCurrentDate();
      
      const result = await DailyAuction.deleteMany({
        masterAuctionId: this.masterAuctionId,
        date: currentDate,
      });

      console.log(`✅ Reset complete: Deleted ${result.deletedCount} auctions`);

      return {
        success: true,
        message: 'Daily auctions reset',
        deletedCount: result.deletedCount,
      };
    } catch (error) {
      console.error('Error resetting daily auctions:', error);
      throw error;
    }
  }

  /**
   * Get current auction status
   */
  async getCurrentStatus() {
    try {
      const currentDate = this.getCurrentDate();
      const currentHour = this.getCurrentHour();

      const todayAuctions = await DailyAuction.getTodayAuctions(
        this.masterAuctionId,
        currentDate
      );

      const live = todayAuctions.filter((a) => a.Status === 'LIVE');
      const upcoming = todayAuctions.filter((a) => a.Status === 'UPCOMING');
      const completed = todayAuctions.filter((a) => a.Status === 'COMPLETED');

      return {
        success: true,
        currentTime: this.formatTimeSlot(currentHour),
        date: currentDate,
        auctions: {
          live,
          upcoming,
          completed,
        },
        counts: {
          total: todayAuctions.length,
          live: live.length,
          upcoming: upcoming.length,
          completed: completed.length,
        },
      };
    } catch (error) {
      console.error('Error getting current status:', error);
      throw error;
    }
  }

  // ===== Helper Methods =====

  getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getCurrentHour() {
    return new Date().getHours();
  }

  parseTimeSlot(timeSlot) {
    const [hour] = timeSlot.split(':').map(Number);
    return hour;
  }

  formatTimeSlot(hour) {
    return `${String(hour).padStart(2, '0')}:00`;
  }

  /**
   * Manual trigger for testing (can be called via API)
   */
  async manualTriggerInitialization() {
    console.log('🔧 Manual trigger: Initialization');
    return await this.initializeDailyAuctions();
  }

  async manualTriggerProgression() {
    console.log('🔧 Manual trigger: Progression');
    return await this.progressAuctions();
  }

  async manualTriggerReset() {
    console.log('🔧 Manual trigger: Reset');
    return await this.resetDailyAuctions();
  }
}

// Export singleton instance
module.exports = new AuctionCronScheduler();
