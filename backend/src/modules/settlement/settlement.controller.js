const { optimizeSettlements } = require('./settlement.service');
const { createNotification } = require('../notification/notification.service');

// Optimize settlements for current user or group
exports.getOptimizedSettlements = async (req, res) => {
  try {
    const { group } = req.body;
    
    // Get optimized settlements
    const settlements = await optimizeSettlements();
    
    // Create notifications for each settlement
    for (const settlement of settlements) {
      await createNotification(
        settlement.fromUser,
        `You should pay ₹${settlement.amount.toFixed(2)} to ${settlement.toUserName}`
      );
      await createNotification(
        settlement.toUser,
        `${settlement.fromUserName} should pay you ₹${settlement.amount.toFixed(2)}`
      );
    }
    
    res.json({
      message: 'Settlements optimized successfully',
      settlements,
      count: settlements.length
    });
  } catch (error) {
    console.error('Get optimized settlements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
