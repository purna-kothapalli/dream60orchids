// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const masterRoutes = require('./src/routes/masterBidRoutes');
const priceMartRoutes = require('./src/routes/priceMartRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const schedulerRoutes = require('./src/routes/schedulerRoutes');

const app = express();

// --------------------
// Middleware
// --------------------
app.use(express.json());

// Dynamic CORS setup (supports comma-separated env, and common local-network IPs in dev)
const raw = process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000';
let allowedOrigins = Array.isArray(raw) ? raw : String(raw).split(',').map(s => s.trim()).filter(Boolean);

// Normalize entries (remove trailing slash)
allowedOrigins = allowedOrigins.map(u => u.replace(/\/$/, ''));

const isLocalNetwork = (hostname) => {
  return hostname === 'localhost' ||
         hostname === '127.0.0.1' ||
         hostname.startsWith('192.168.') ||
         hostname.startsWith('10.') ||
         hostname.startsWith('172.16.') || hostname.startsWith('172.17.') || hostname.startsWith('172.18.') || hostname.startsWith('172.19.') ||
         hostname.startsWith('172.2') // covers 172.20 - 172.31 roughly
};

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl, Postman, mobile native, same-origin)
      if (!origin) return callback(null, true);

      try {
        // Normalize the incoming origin
        const parsed = new URL(origin);
        const incomingOrigin = parsed.origin.replace(/\/$/, '');
        const hostname = parsed.hostname;

        // 1) Exact match with configured allowedOrigins
        if (allowedOrigins.includes(incomingOrigin)) {
          return callback(null, true);
        }

        // 2) In non-production, allow typical local-network IPs and localhost
        if (process.env.NODE_ENV !== 'production' && isLocalNetwork(hostname)) {
          // Optionally: only allow if that exact origin also matches a configured port pattern,
          // but this more permissive check eases local device testing.
          return callback(null, true);
        }

        // Reject if not allowed
        const err = new Error(`❌ Not allowed by CORS: ${incomingOrigin}`);
        err.status = 403;
        return callback(err);
      } catch (e) {
        // If origin is malformed, reject
        return callback(new Error('❌ Not allowed by CORS (malformed origin)'));
      }
    },
    credentials: true,
  })
);
console.log(`🌍 Allowed frontend origins: ${allowedOrigins.join(', ')}`);
console.log(`🌍 NODE_ENV=${process.env.NODE_ENV || 'undefined'}`);

// --------------------
// Swagger Setup
// --------------------
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dream60 API',
      version: '1.0.0',
      description:
        'Comprehensive API documentation for Dream60 Auction Game backend.',
      contact: {
        name: 'Finpages Tech Pvt Ltd',
        url: 'https://finpages.in',
        email: 'support@finpages.in',
      },
    },
    servers: [
      {
        url:
          process.env.API_BASE_URL ||
          `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Read all route files for Swagger docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log(
  `📘 Swagger Docs available at: ${
    process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 5000}`
  }/api-docs`
);

// --------------------
// Routes
// --------------------
app.use('/auth', authRoutes);
app.use('/auth', userRoutes);
app.use('/master-bids', masterRoutes);
app.use('/priceMart', priceMartRoutes);
app.use('/admin', adminRoutes);
app.use('/api/v1/scheduler', schedulerRoutes);

// --------------------
// MongoDB Connection
// --------------------
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/dream60';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected successfully`))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// --------------------
// Root Endpoint
// --------------------
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Dream60 Backend API 🚀',
    environment: process.env.NODE_ENV || 'development',
    documentation: '/api-docs',
  });
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});