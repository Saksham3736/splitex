const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { getOptimizedSettlements } = require('./settlement.controller');

// All routes are protected
router.use(authMiddleware);

// POST /api/settlements/optimize
router.post('/optimize', getOptimizedSettlements);

module.exports = router;
