// src/controllers/masterAuctionController.js

function normalizeMasterAuctionPayload(raw = {}) {
  const payload = { ...raw };

  // Helper: map keys on object (non-destructive)
  const mapKeys = (obj, mapping) => {
    if (!obj || typeof obj !== 'object') return obj;
    const out = {};
    for (const key of Object.keys(obj)) {
      const targetKey = mapping[key] || key;
      out[targetKey] = obj[key];
    }
    return out;
  };

  // Top-level mapping (if you ever have PascalCase at top-level)
  const topMapping = {
    MasterId: 'master_id',
    MasterID: 'master_id',
    CreatedBy: 'createdBy',
    IsActive: 'isActive',
    TotalAuctionsPerDay: 'totalAuctionsPerDay',
    DailyAuctionConfig: 'dailyAuctionConfig',
    // accept alternate names too
    totalAuctionsPerDay: 'totalAuctionsPerDay',
  };

  // remap top-level keys
  const normalizedTop = mapKeys(payload, topMapping);

  // Normalize dailyAuctionConfig items
  if (Array.isArray(normalizedTop.dailyAuctionConfig)) {
    normalizedTop.dailyAuctionConfig = normalizedTop.dailyAuctionConfig.map((item) => {
      if (!item || typeof item !== 'object') return item;

      const itemMapping = {
        // PascalCase -> camelCase
        TimeSlot: 'timeSlot',
        TimezoneSlot: 'timeSlot',
        Status: 'status',
        EntryFee: 'entryFee',
        FeeSplits: 'feeSplits',
        AuctionNumber: 'auctionNumber',
        AuctionId: 'auctionId',
        AuctionName: 'auctionName',
        PrizeValue: 'prizeValue',
        MaxDiscount: 'maxDiscount',
        MinEntryFee: 'minEntryFee',
        MaxEntryFee: 'maxEntryFee',
        RoundCount: 'roundCount',
        RoundConfig: 'roundConfig',
        TopBidAmountsPerRound: 'topBidAmountsPerRound',
        RoundCutoffPercentage: 'roundCutoffPercentage',
        MinPlayers: 'minPlayers',
        // keep existing camelCase mapping to itself is harmless
      };

      const mapped = mapKeys(item, itemMapping);

      // Normalize feeSplits casing inside
      if (mapped.feeSplits && typeof mapped.feeSplits === 'object') {
        mapped.feeSplits = mapKeys(mapped.feeSplits, {
          BoxA: 'BoxA',
          BoxB: 'BoxB',
          boxA: 'BoxA',
          boxB: 'BoxB',
        });
      }

      // Normalize nested roundConfig keys
      if (Array.isArray(mapped.roundConfig)) {
        mapped.roundConfig = mapped.roundConfig.map((r) => {
          if (!r || typeof r !== 'object') return r;
          return mapKeys(r, {
            Round: 'round',
            round: 'round',
            MinPlayers: 'minPlayers',
            Duration: 'duration',
            MaxBid: 'maxBid',
            RoundCutoffPercentage: 'roundCutoffPercentage',
            TopBidAmountsPerRound: 'topBidAmountsPerRound',
          });
        });
      }

      return mapped;
    });
  }

  return normalizedTop;
}

const mongoose = require('mongoose');

// require MasterAuction model (try common naming variations so import is resilient)
let MasterAuction;
try {
  MasterAuction = require('../models/MasterAuction');
} catch (e1) {
  try {
    MasterAuction = require('../models/MasterAuction');
  } catch (e2) {
    throw new Error('Could not require MasterAuction model. Check model file path/name.');
  }
}

// require User model (try common naming variations)
let User;
try {
  User = require('../models/user');
} catch (e1) {
  try {
    User = require('../models/user');
  } catch (e2) {
    throw new Error('Could not require User model. Check model file path/name.');
  }
}

/**
 * Helper: find user by various identifiers (ObjectId, user_id, userCode, username, mobile, email)
 * Returns a lean user object or null.
 */
const findUserById = async (id) => {
  if (!id) return null;

  // ObjectId check first
  if (mongoose.Types.ObjectId.isValid(id)) {
    const byObjectId = await User.findById(id).lean();
    if (byObjectId) return byObjectId;
  }

  // try common UUID / app fields used in your user model
  const candidates = [
    { user_id: id },
    { userCode: id },
    { username: String(id).toLowerCase() },
    { mobile: String(id).replace(/\D/g, '') },
    { email: String(id).toLowerCase() },
  ];

  const user = await User.findOne({ $or: candidates }).lean();
  return user || null;
};

/**
 * GET /master-auctions
 * query params:
 *  - isActive (true/false)
 *  - status (LIVE | UPCOMING | COMPLETED | CANCELLED)  ==> matches any dailyAuctionConfig with that Status
 *  - limit (default 50, max 200)
 *  - page (default 1)
 */
const getAllMasterAuctions = async (req, res) => {
  try {
    const { isActive, status, limit = 50, page = 1 } = req.query;
    const q = {};

    if (typeof isActive !== 'undefined') {
      q.isActive = isActive === 'true' || isActive === true;
    }

    if (status) {
      const allowed = ['LIVE', 'UPCOMING', 'COMPLETED', 'CANCELLED'];
      const normalized = String(status).toUpperCase();
      if (allowed.includes(normalized)) {
        // find master auctions that have at least one dailyAuctionConfig item with this Status
        q['dailyAuctionConfig.Status'] = normalized;
      }
    }

    const l = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
    const p = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      MasterAuction.find(q).sort({ createdAt: -1 }).skip(skip).limit(l).lean(),
      MasterAuction.countDocuments(q),
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      meta: { total, page: p, limit: l, pages: Math.ceil(total / l) },
    });
  } catch (err) {
    console.error('getAllMasterAuctions error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * POST /master-auctions
 * Body: master auction payload (createdBy can be provided or will be taken from headers/query)
 */
const createMasterAuction = async (req, res) => {
  try {
    let payload = normalizeMasterAuctionPayload(req.body || {});

    // Accept createdBy from body, alternate keys, headers, query
    const providedUserId =
      payload.createdBy ||
      payload.user_id ||
      payload.userId ||
      req.headers['x-user-id'] ||
      req.query.user_id ||
      req.query.userId ||
      null;

    if (!providedUserId) {
      return res.status(400).json({
        success: false,
        message: 'A user identifier (createdBy or user_id) is required to create a Master Auction.',
      });
    }

    // Resolve user
    const user = await findUserById(providedUserId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `No User found for the provided identifier: ${providedUserId}`,
      });
    }

    // Normalize createdBy to stable id (prefer user.user_id if available, otherwise ObjectId string)
    const creatorId = user.user_id || (user._id ? user._id.toString() : null);
    if (!creatorId) {
      return res.status(500).json({
        success: false,
        message: 'Could not determine a stable creator identifier for the provided user.',
      });
    }
    payload.createdBy = creatorId;

    // If payload.isActive true => deactivate other active master auctions
    if (payload.isActive === true) {
      await MasterAuction.updateMany({ isActive: true }, { $set: { isActive: false } });
    }

    const created = await MasterAuction.create(payload);

    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error('createMasterAuction error:', err);

    // Mongoose validation error
    if (err && err.name === 'ValidationError') {
      const messages = Object.values(err.errors || {}).map((v) => v.message);
      return res.status(400).json({ success: false, message: 'Validation failed', errors: messages });
    }

    // Duplicate key error
    if (err && err.code === 11000) {
      const dupField = Object.keys(err.keyValue || {}).join(', ');
      return res.status(409).json({
        success: false,
        message: `Duplicate value for field(s): ${dupField}.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating Master Auction.',
    });
  }
};

module.exports = {
  getAllMasterAuctions,
  createMasterAuction,
};
