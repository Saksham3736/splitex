const Balance = require('../balance/balance.model');
const User = require('../auth/auth.model');

// Greedy settlement optimization algorithm
exports.optimizeSettlements = async (userIds = null) => {
  try {
    // Get all balances
    let balances;
    if (userIds) {
      balances = await Balance.find({
        $or: [
          { fromUser: { $in: userIds } },
          { toUser: { $in: userIds } }
        ]
      }).populate('fromUser toUser');
    } else {
      balances = await Balance.find({ amount: { $gt: 0 } }).populate('fromUser toUser');
    }

    // Calculate net balance for each user
    const netBalances = {};
    
    for (const balance of balances) {
      const fromId = balance.fromUser._id.toString();
      const toId = balance.toUser._id.toString();
      
      if (!netBalances[fromId]) {
        netBalances[fromId] = { 
          userId: fromId, 
          name: balance.fromUser.name, 
          net: 0 
        };
      }
      if (!netBalances[toId]) {
        netBalances[toId] = { 
          userId: toId, 
          name: balance.toUser.name, 
          net: 0 
        };
      }
      
      // fromUser owes (negative), toUser is owed (positive)
      netBalances[fromId].net -= balance.amount;
      netBalances[toId].net += balance.amount;
    }

    // Separate into payers (negative net) and receivers (positive net)
    const payers = Object.values(netBalances)
      .filter(u => u.net < 0)
      .sort((a, b) => a.net - b.net); // Most negative first
    
    const receivers = Object.values(netBalances)
      .filter(u => u.net > 0)
      .sort((a, b) => b.net - a.net); // Most positive first

    // Greedy matching
    const settlements = [];
    let i = 0, j = 0;
    
    while (i < payers.length && j < receivers.length) {
      const payer = payers[i];
      const receiver = receivers[j];
      
      const amount = Math.min(Math.abs(payer.net), receiver.net);
      
      if (amount > 0.01) { // Only create settlements for meaningful amounts
        settlements.push({
          fromUser: payer.userId,
          fromUserName: payer.name,
          toUser: receiver.userId,
          toUserName: receiver.name,
          amount: Math.round(amount * 100) / 100
        });
      }
      
      payer.net += amount;
      receiver.net -= amount;
      
      // Move to next payer/receiver if settled
      if (Math.abs(payer.net) < 0.01) i++;
      if (receiver.net < 0.01) j++;
    }

    return settlements;
  } catch (error) {
    console.error('Optimize settlements error:', error);
    throw error;
  }
};
