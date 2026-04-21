const User = require('../auth/auth.model');

// Generate UPI payment deep link
exports.generateUpiLink = async (userId, amount) => {
  try {
    // Fetch recipient's UPI ID from DB
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.upiId) {
      throw new Error('User does not have UPI ID configured');
    }
    
    // Generate UPI deep link
    const upiLink = `upi://pay?pa=${user.upiId}&pn=${encodeURIComponent(user.name)}&am=${amount}&cu=INR`;
    
    return {
      upiLink,
      recipientName: user.name,
      upiId: user.upiId,
      amount
    };
  } catch (error) {
    console.error('Generate UPI link error:', error);
    throw error;
  }
};
