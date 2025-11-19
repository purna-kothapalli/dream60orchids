// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getUserStatistics,
  getAllUsersAdmin,
  createMasterAuctionAdmin,
  getAllMasterAuctionsAdmin,
  updateMasterAuctionAdmin,
  deleteMasterAuctionAdmin,
} = require('../controllers/adminController');

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin panel APIs for managing Dream60 platform
 *
 * components:
 *   schemas:
 *     AdminLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "dream60@gmail.com"
 *         password:
 *           type: string
 *           example: "Dharsh@2003"
 *
 *     AdminLoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Admin login successful"
 *         user:
 *           type: object
 *           properties:
 *             user_id:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             userType:
 *               type: string
 *               example: "ADMIN"
 *
 *     UserStatistics:
 *       type: object
 *       properties:
 *         overview:
 *           type: object
 *           properties:
 *             totalUsers:
 *               type: number
 *             activeUsers:
 *               type: number
 *             deletedUsers:
 *               type: number
 *             adminUsers:
 *               type: number
 *         activity:
 *           type: object
 *           properties:
 *             totalAuctions:
 *               type: number
 *             totalWins:
 *               type: number
 *             totalAmountSpent:
 *               type: number
 *             totalAmountWon:
 *               type: number
 */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: ADMIN LOGIN
 *     description: Login with hardcoded admin credentials (dream60@gmail.com / Dharsh@2003)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Admin login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLoginResponse'
 *       401:
 *         description: Invalid admin credentials
 *       500:
 *         description: Server error
 */
router.post('/login', adminLogin);

/**
 * @swagger
 * /admin/statistics:
 *   get:
 *     summary: GET USER STATISTICS
 *     description: Get comprehensive user statistics for admin dashboard (requires admin user_id)
 *     tags: [Admin]
 *     parameters:
 *       - name: user_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserStatistics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin privileges required
 *       500:
 *         description: Server error
 */
router.get('/statistics', getUserStatistics);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: GET ALL USERS (ADMIN)
 *     description: Get detailed list of all users with pagination (requires admin user_id)
 *     tags: [Admin]
 *     parameters:
 *       - name: user_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: number
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: number
 *           default: 20
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: includeDeleted
 *         in: query
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin privileges required
 *       500:
 *         description: Server error
 */
router.get('/users', getAllUsersAdmin);

/**
 * @swagger
 * /admin/master-auctions:
 *   get:
 *     summary: GET ALL MASTER AUCTIONS (ADMIN)
 *     description: Get all master auctions with pagination (requires admin user_id)
 *     tags: [Admin]
 *     parameters:
 *       - name: user_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: number
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: number
 *           default: 20
 *       - name: isActive
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Master auctions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin privileges required
 *       500:
 *         description: Server error
 *   post:
 *     summary: CREATE MASTER AUCTION (ADMIN)
 *     description: Create a new master auction (requires admin user_id)
 *     tags: [Admin]
 *     parameters:
 *       - name: user_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalAuctionsPerDay:
 *                 type: number
 *               dailyAuctionConfig:
 *                 type: array
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Master auction created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin privileges required
 *       500:
 *         description: Server error
 */
router.get('/master-auctions', getAllMasterAuctionsAdmin);
router.post('/master-auctions', createMasterAuctionAdmin);

/**
 * @swagger
 * /admin/master-auctions/{master_id}:
 *   put:
 *     summary: UPDATE MASTER AUCTION (ADMIN)
 *     description: Update an existing master auction (requires admin user_id)
 *     tags: [Admin]
 *     parameters:
 *       - name: master_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: user_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Master auction updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin privileges required
 *       404:
 *         description: Master auction not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: DELETE MASTER AUCTION (ADMIN)
 *     description: Delete a master auction (requires admin user_id)
 *     tags: [Admin]
 *     parameters:
 *       - name: master_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: user_id
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin user ID
 *     responses:
 *       200:
 *         description: Master auction deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin privileges required
 *       404:
 *         description: Master auction not found
 *       500:
 *         description: Server error
 */
router.put('/master-auctions/:master_id', updateMasterAuctionAdmin);
router.delete('/master-auctions/:master_id', deleteMasterAuctionAdmin);

module.exports = router;
