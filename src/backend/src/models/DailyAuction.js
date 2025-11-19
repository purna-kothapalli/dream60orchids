// src/backend/src/models/DailyAuction.js
const mongoose = require('mongoose');

const DailyAuctionSchema = new mongoose.Schema(
  {
    auctionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    masterAuctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterAuction',
      required: true,
      index: true,
    },
    auctionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: String,
      required: true,
      index: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    TimeSlot: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    auctionName: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
      trim: true,
    },
    prizeValue: {
      type: Number,
      required: true,
      min: 0,
    },
    Status: {
      type: String,
      enum: ['LIVE', 'UPCOMING', 'COMPLETED', 'CANCELLED'],
      default: 'UPCOMING',
      index: true,
    },
    maxDiscount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    EntryFee: {
      type: String,
      enum: ['RANDOM', 'MANUAL'],
      required: true,
    },
    minEntryFee: {
      type: Number,
      min: 0,
      default: null,
    },
    maxEntryFee: {
      type: Number,
      min: 0,
      default: null,
    },
    FeeSplits: {
      BoxA: { type: Number, min: 0 },
      BoxB: { type: Number, min: 0 },
    },
    roundCount: {
      type: Number,
      min: 1,
      default: 4,
    },
    roundConfig: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Compound index for efficient queries
DailyAuctionSchema.index({ masterAuctionId: 1, date: 1 });
DailyAuctionSchema.index({ date: 1, Status: 1 });
DailyAuctionSchema.index({ date: 1, TimeSlot: 1 });

// Static method to get today's auctions
DailyAuctionSchema.statics.getTodayAuctions = function (masterAuctionId, date) {
  return this.find({ masterAuctionId, date }).sort({ TimeSlot: 1 });
};

// Static method to get auctions by status
DailyAuctionSchema.statics.getAuctionsByStatus = function (masterAuctionId, date, status) {
  return this.find({ masterAuctionId, date, Status: status }).sort({ TimeSlot: 1 });
};

// Static method to update auction status
DailyAuctionSchema.statics.updateStatus = function (auctionId, status) {
  return this.findOneAndUpdate(
    { auctionId },
    { Status: status, updated_at: new Date() },
    { new: true }
  );
};

// Instance method to check if auction should be live
DailyAuctionSchema.methods.shouldBeLive = function (currentHour) {
  const [auctionHour] = this.TimeSlot.split(':').map(Number);
  return auctionHour === currentHour;
};

// Instance method to check if auction is past
DailyAuctionSchema.methods.isPast = function (currentHour) {
  const [auctionHour] = this.TimeSlot.split(':').map(Number);
  return auctionHour < currentHour;
};

module.exports = mongoose.models.DailyAuction || mongoose.model('DailyAuction', DailyAuctionSchema);
