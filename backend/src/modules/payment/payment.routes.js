const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { getUpiLink } = require('./payment.controller');

// All routes are protected
router.use(authMiddleware);

// POST /api/payment/upi-link
router.post('/upi-link', getUpiLink);

module.exports = router;
