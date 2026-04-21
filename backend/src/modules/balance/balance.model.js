const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure unique fromUser-toUser pair
balanceSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model('Balance', balanceSchema);
