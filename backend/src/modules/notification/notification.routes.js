const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { getNotifications, markNotificationRead } = require('./notification.controller');

// All routes are protected
router.use(authMiddleware);

// GET /api/notifications
router.get('/', getNotifications);

// PATCH /api/notifications/:notificationId/read
router.patch('/:notificationId/read', markNotificationRead);

module.exports = router;
