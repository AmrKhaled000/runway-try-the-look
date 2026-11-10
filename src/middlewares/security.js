const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');
const express = require('express');

function applySecurity(app) {
  app.use(helmet());
  app.use(compression());
  app.use(mongoSanitize());
  app.use(hpp());
  const allowed = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map(s => s.trim());
  app.use(cors({ origin: allowed, credentials: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }));
  app.use(express.json({ limit: '100kb' }));
}

module.exports = { applySecurity };