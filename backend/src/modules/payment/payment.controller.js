const { generateUpiLink } = require('./payment.service');

// Generate UPI payment link
exports.getUpiLink = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({ 
        error: 'userId and amount are required' 
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ 
        error: 'Amount must be greater than 0' 
      });
    }
    
    const result = await generateUpiLink(userId, amount);
    
    res.json({
      message: 'UPI link generated successfully',
      ...result
    });
  } catch (error) {
    console.error('Get UPI link error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'User does not have UPI ID configured') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
};
