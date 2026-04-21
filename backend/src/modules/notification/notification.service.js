const Notification = require('./notification.model');

// Create a notification
exports.createNotification = async (userId, message) => {
  try {
    const notification = new Notification({ userId, message });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    // Don't throw - notifications are non-critical
  }
};

// Get notifications for a user
exports.getUserNotifications = async (userId, limit = 100) => {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return notifications;
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
};

// Mark notification as read
exports.markAsRead = async (notificationId, userId) => {
  try {
    await Notification.updateOne(
      { _id: notificationId, userId },
      { read: true }
    );
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};
