// src/controllers/masterBidController.js
const mongoose = require('mongoose');
const MasterBid = require('../models/MasterBid');
const User = require('../models/user'); // ✅ Ensure this path is correct

const DEFAULT_LIMIT = 50;

/**
 * GET /master-bids
 * List all master bid configurations
 */
const getAllMasterBids = async (req, res) => {
  try {
    const { limit = DEFAULT_LIMIT, page = 1, active } = req.query;
    const q = {};

    if (typeof active !== 'undefined') {
      q['features.is_active'] = active === 'true' || active === true;
      q.archived = false;
    }

    const l = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, 200);
    const p = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (p - 1) * l;

    const [items, total] = await Promise.all([
      MasterBid.find(q).sort({ updated_at: -1 }).skip(skip).limit(l).lean(),
      MasterBid.countDocuments(q)
    ]);

    return res.status(200).json({
      success: true,
      data: items,
      meta: { total, page: p, limit: l, pages: Math.ceil(total / l) }
    });
  } catch (err) {
    console.error('getAllMasterBids error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * POST /master-bids
 * Create a new MasterBid config using a valid user_id
 */
const createMasterBid = async (req, res) => {
  try {
    const payload = req.body || {};

    // Required: user_id
    const providedUserId =
      payload.user_id ||
      payload.userId ||
      req.headers['x-user-id'] ||
      req.query.user_id ||
      null;

    if (!providedUserId) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required to create MasterBid.'
      });
    }

    // Helper: find user by _id or uuid
    const findUserById = async (id) => {
      if (!id) return null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const byObjectId = await User.findById(id).lean();
        if (byObjectId) return byObjectId;
      }
      const byUuid = await User.findOne({
        $or: [{ uuid: id }, { id: id }, { user_id: id }]
      }).lean();
      return byUuid;
    };

    // Validate that the user exists
    const user = await findUserById(providedUserId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `No User found for user_id: ${providedUserId}`
      });
    }

    // Attach creator info to payload
    payload.created_by = {
      user_id: user._id || user.id || user.uuid || null,
      username: user.username || user.userName || null,
      full_name: user.full_name || user.fullName || user.name || null
    };

    // Deactivate existing active configs if new one is active
    if (payload.features && payload.features.is_active) {
      await MasterBid.updateMany(
        { 'features.is_active': true, archived: false },
        { $set: { 'features.is_active': false } }
      );
    }

    const created = await MasterBid.create(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error('createMasterBid error:', err);
    if (err.code === 11000) {
      const dupField = Object.keys(err.keyValue || {}).join(', ');
      return res.status(409).json({
        success: false,
        message: `Duplicate value for field(s): ${dupField}`
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating MasterBid'
    });
  }
};

module.exports = {
  getAllMasterBids,
  createMasterBid
};
