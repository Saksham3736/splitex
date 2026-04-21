const { getUserNotifications, markAsRead } = require('./notification.service');

// Get current user's notifications
exports.getNotifications = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const notifications = await getUserNotifications(req.user._id, limit);
    
    res.json({
      notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await markAsRead(notificationId, req.user._id);
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
