const Balance = require('./balance.model');

// Update balance between two users with netting logic
exports.updateBalance = async (fromUser, toUser, amount) => {
  try {
    // Check if reverse debt exists (toUser owes fromUser)
    const reverseBalance = await Balance.findOne({
      fromUser: toUser,
      toUser: fromUser
    });

    if (reverseBalance && reverseBalance.amount > 0) {
      // Reverse debt exists, reduce it first
      if (amount >= reverseBalance.amount) {
        // Amount covers the entire reverse debt
        const remaining = amount - reverseBalance.amount;
        reverseBalance.amount = 0;
        await reverseBalance.save();

        // If there's remaining amount, create/update forward debt
        if (remaining > 0) {
          await createOrUpdateBalance(fromUser, toUser, remaining);
        }
      } else {
        // Amount is less than reverse debt, just reduce it
        reverseBalance.amount -= amount;
        await reverseBalance.save();
      }
    } else {
      // No reverse debt, create/update forward debt
      await createOrUpdateBalance(fromUser, toUser, amount);
    }
  } catch (error) {
    console.error('Update balance error:', error);
    throw error;
  }
};

// Helper function to create or update a balance entry
async function createOrUpdateBalance(fromUser, toUser, amount) {
  let balance = await Balance.findOne({ fromUser, toUser });

  if (balance) {
    balance.amount += amount;
    balance.updatedAt = Date.now();
  } else {
    balance = new Balance({ fromUser, toUser, amount });
  }

  await balance.save();
  return balance;
}
