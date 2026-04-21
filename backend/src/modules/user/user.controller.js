const User = require('../auth/auth.model');

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      upiId: user.upiId,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateMe = async (req, res) => {
  try {
    const { name, upiId } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (upiId !== undefined) user.upiId = upiId;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      userId: user._id,
      name: user.name,
      email: user.email,
      upiId: user.upiId
    });
  } catch (error) {
    console.error('Update me error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
