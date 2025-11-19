// src/backend/src/services/auctionScheduler.js
const MasterAuction = require('../models/MasterAuction');
const DailyAuction = require('../models/DailyAuction');
const { randomUUID } = require('crypto');

/**
 * Auction Scheduler Service
 * Handles automatic creation and progression of daily auctions
 */
class AuctionSchedulerService {
  constructor() {
    this.WINDOW_SIZE = 3; // Always maintain 3 auctions (1 LIVE + 2 UPCOMING)
    this.DAILY_START_HOUR = 9; // Start at 9:00 AM
    this.schedulerInterval = null;
  }

  /**
   * Get current date in YYYY-MM-DD format
   */
  getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Get current hour (0-23)
   */
  getCurrentHour() {
    return new Date().getHours();
  }

  /**
   * Parse time slot string (HH:MM) to hour number
   */
  parseTimeSlot(timeSlot) {
    const [hour] = timeSlot.split(':').map(Number);
    return hour;
  }

  /**
   * Format hour to time slot string (HH:MM)
   */
  formatTimeSlot(hour) {
    return `${String(hour).padStart(2, '0')}:00`;
  }

  /**
   * Initialize daily auctions at 9:00 AM
   * Creates the first 3 auctions: 9 AM (LIVE), 10 AM (UPCOMING), 11 AM (UPCOMING)
   */
  async initializeDailyAuctions(masterAuctionId) {
    try {
      const masterAuction = await MasterAuction.findById(masterAuctionId);
      if (!masterAuction) {
        throw new Error('Master auction not found');
      }

      const currentDate = this.getCurrentDate();
      const currentHour = this.getCurrentHour();

      // Only initialize if current hour is 9 AM or later
      if (currentHour < this.DAILY_START_HOUR) {
        return {
          success: false,
          message: `Cannot initialize before ${this.DAILY_START_HOUR}:00 AM`,
        };
      }

      // Check if already initialized today
      const existingAuctions = await this.getTodayAuctions(masterAuctionId);
      if (existingAuctions.length > 0) {
        return {
          success: false,
          message: 'Daily auctions already initialized',
          auctions: existingAuctions,
        };
      }

      const newAuctions = [];
      const dailyConfigs = masterAuction.dailyAuctionConfig;

      // Create first 3 auctions
      for (let i = 0; i < Math.min(this.WINDOW_SIZE, dailyConfigs.length); i++) {
        const config = dailyConfigs[i];
        const hour = this.DAILY_START_HOUR + i;

        const auction = {
          auctionId: randomUUID(),
          auctionNumber: i + 1,
          TimeSlot: this.formatTimeSlot(hour),
          auctionName: config.auctionName,
          imageUrl: config.imageUrl,
          prizeValue: config.prizeValue,
          Status: i === 0 ? 'LIVE' : 'UPCOMING', // First auction is LIVE
          maxDiscount: config.maxDiscount,
          EntryFee: config.EntryFee,
          minEntryFee: config.minEntryFee,
          maxEntryFee: config.maxEntryFee,
          FeeSplits: config.FeeSplits,
          roundCount: config.roundCount,
          roundConfig: config.roundConfig,
          date: currentDate,
          createdAt: new Date(),
        };

        newAuctions.push(auction);
      }

      // Store in database (you'll need a DailyAuction model)
      await this.saveDailyAuctions(masterAuctionId, newAuctions);

      return {
        success: true,
        message: 'Daily auctions initialized successfully',
        auctions: newAuctions,
      };
    } catch (error) {
      console.error('Error initializing daily auctions:', error);
      throw error;
    }
  }

  /**
   * Progress auctions - mark current LIVE as COMPLETED and create next UPCOMING
   */
  async progressAuctions(masterAuctionId) {
    try {
      const masterAuction = await MasterAuction.findById(masterAuctionId);
      if (!masterAuction) {
        throw new Error('Master auction not found');
      }

      const currentDate = this.getCurrentDate();
      const currentHour = this.getCurrentHour();
      const currentTimeSlot = this.formatTimeSlot(currentHour);

      // Get today's auctions
      const todayAuctions = await this.getTodayAuctions(masterAuctionId);
      
      if (todayAuctions.length === 0) {
        return {
          success: false,
          message: 'No auctions found for today. Please initialize first.',
        };
      }

      let updates = [];
      let newAuctionCreated = false;

      // Find the auction that should be LIVE now
      const currentLiveAuction = todayAuctions.find(
        (a) => this.parseTimeSlot(a.TimeSlot) === currentHour
      );

      if (!currentLiveAuction) {
        return {
          success: false,
          message: 'No auction scheduled for current hour',
        };
      }

      // Mark past auctions as COMPLETED
      for (const auction of todayAuctions) {
        const auctionHour = this.parseTimeSlot(auction.TimeSlot);
        
        if (auctionHour < currentHour && auction.Status === 'LIVE') {
          // Mark as COMPLETED
          await this.updateAuctionStatus(auction.auctionId, 'COMPLETED');
          updates.push({
            auctionId: auction.auctionId,
            TimeSlot: auction.TimeSlot,
            Status: 'COMPLETED',
          });
        } else if (auctionHour === currentHour && auction.Status === 'UPCOMING') {
          // Mark as LIVE
          await this.updateAuctionStatus(auction.auctionId, 'LIVE');
          updates.push({
            auctionId: auction.auctionId,
            TimeSlot: auction.TimeSlot,
            Status: 'LIVE',
          });
        }
      }

      // Check if we need to create a new UPCOMING auction
      const upcomingCount = todayAuctions.filter((a) => a.Status === 'UPCOMING').length;
      const totalCreated = todayAuctions.length;
      const totalConfigured = masterAuction.dailyAuctionConfig.length;

      if (upcomingCount < 2 && totalCreated < totalConfigured) {
        // Create next auction
        const nextAuctionIndex = totalCreated;
        const nextConfig = masterAuction.dailyAuctionConfig[nextAuctionIndex];
        const nextHour = this.DAILY_START_HOUR + nextAuctionIndex;

        const newAuction = {
          auctionId: randomUUID(),
          auctionNumber: nextAuctionIndex + 1,
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
          date: currentDate,
          createdAt: new Date(),
        };

        await this.saveDailyAuctions(masterAuctionId, [newAuction]);
        newAuctionCreated = true;
        updates.push({
          auctionId: newAuction.auctionId,
          TimeSlot: newAuction.TimeSlot,
          Status: 'UPCOMING',
          message: 'New auction created',
        });
      }

      return {
        success: true,
        message: 'Auctions progressed successfully',
        updates,
        newAuctionCreated,
        currentTime: currentTimeSlot,
      };
    } catch (error) {
      console.error('Error progressing auctions:', error);
      throw error;
    }
  }

  /**
   * Get current auction status
   */
  async getCurrentAuctionStatus(masterAuctionId) {
    try {
      const todayAuctions = await this.getTodayAuctions(masterAuctionId);
      const currentHour = this.getCurrentHour();

      const live = todayAuctions.filter((a) => a.Status === 'LIVE');
      const upcoming = todayAuctions.filter((a) => a.Status === 'UPCOMING');
      const completed = todayAuctions.filter((a) => a.Status === 'COMPLETED');

      return {
        success: true,
        currentTime: this.formatTimeSlot(currentHour),
        date: this.getCurrentDate(),
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
      console.error('Error getting auction status:', error);
      throw error;
    }
  }

  /**
   * Reset daily auctions (for testing or manual reset)
   */
  async resetDailyAuctions(masterAuctionId) {
    try {
      await this.clearTodayAuctions(masterAuctionId);
      
      return {
        success: true,
        message: 'Daily auctions reset successfully',
      };
    } catch (error) {
      console.error('Error resetting daily auctions:', error);
      throw error;
    }
  }

  /**
   * Start automatic scheduler
   * Checks every minute and progresses auctions when needed
   */
  startScheduler(masterAuctionId, intervalMinutes = 1) {
    if (this.schedulerInterval) {
      console.log('Scheduler already running');
      return;
    }

    console.log(`Starting auction scheduler for master: ${masterAuctionId}`);
    
    // Run immediately
    this.checkAndProgress(masterAuctionId);

    // Then run every interval
    this.schedulerInterval = setInterval(async () => {
      await this.checkAndProgress(masterAuctionId);
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Stop automatic scheduler
   */
  stopScheduler() {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
      console.log('Scheduler stopped');
    }
  }

  /**
   * Check and progress auctions if needed
   */
  async checkAndProgress(masterAuctionId) {
    try {
      const currentHour = this.getCurrentHour();
      const currentMinute = new Date().getMinutes();

      console.log(`Checking auctions at ${this.formatTimeSlot(currentHour)}:${currentMinute}`);

      // Check if we're at the start of a new hour
      if (currentMinute === 0) {
        // At 9:00 AM, initialize if not done
        if (currentHour === this.DAILY_START_HOUR) {
          const todayAuctions = await this.getTodayAuctions(masterAuctionId);
          if (todayAuctions.length === 0) {
            console.log('Initializing daily auctions...');
            await this.initializeDailyAuctions(masterAuctionId);
          }
        }

        // Progress auctions at every hour
        if (currentHour >= this.DAILY_START_HOUR) {
          console.log('Progressing auctions...');
          await this.progressAuctions(masterAuctionId);
        }
      }

      // At midnight, reset for next day
      if (currentHour === 0 && currentMinute === 0) {
        console.log('Resetting for new day...');
        await this.resetDailyAuctions(masterAuctionId);
      }
    } catch (error) {
      console.error('Error in checkAndProgress:', error);
    }
  }

  // ===== Database Methods (to be implemented with your database) =====

  /**
   * Get today's auctions from database
   */
  async getTodayAuctions(masterAuctionId) {
    try {
      const currentDate = this.getCurrentDate();
      const auctions = await DailyAuction.getTodayAuctions(masterAuctionId, currentDate);
      return auctions;
    } catch (error) {
      console.error('Error getting today auctions:', error);
      return [];
    }
  }

  /**
   * Save daily auctions to database
   */
  async saveDailyAuctions(masterAuctionId, auctions) {
    try {
      const auctionsWithMasterId = auctions.map(auction => ({
        ...auction,
        masterAuctionId,
      }));
      
      const result = await DailyAuction.insertMany(auctionsWithMasterId);
      console.log(`Saved ${result.length} auctions to database`);
      return result;
    } catch (error) {
      console.error('Error saving auctions:', error);
      throw error;
    }
  }

  /**
   * Update auction status in database
   */
  async updateAuctionStatus(auctionId, status) {
    try {
      const result = await DailyAuction.updateStatus(auctionId, status);
      console.log(`Updated auction ${auctionId} to ${status}`);
      return result;
    } catch (error) {
      console.error('Error updating auction status:', error);
      throw error;
    }
  }

  /**
   * Clear today's auctions from database
   */
  async clearTodayAuctions(masterAuctionId) {
    try {
      const currentDate = this.getCurrentDate();
      const result = await DailyAuction.deleteMany({
        masterAuctionId,
        date: currentDate,
      });
      console.log(`Cleared ${result.deletedCount} auctions for today`);
      return result;
    } catch (error) {
      console.error('Error clearing today auctions:', error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = new AuctionSchedulerService();