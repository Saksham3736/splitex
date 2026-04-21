const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { getMe, updateMe } = require('./user.controller');

// Both routes are protected
router.use(authMiddleware);

// GET /api/user/me
router.get('/me', getMe);

// PATCH /api/user/me
router.patch('/me', updateMe);

module.exports = router;
