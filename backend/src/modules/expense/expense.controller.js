const Expense = require('./expense.model');
const Group = require('../group/group.model');
const { updateBalance } = require('../balance/balance.service');
const { createNotification } = require('../notification/notification.service');

// Helper to format an expense document for the frontend
function formatExpense(exp) {
  return {
    id: exp._id.toString(),
    group_id: (exp.group?._id || exp.group)?.toString(),
    paid_by: (exp.paidBy?._id || exp.paidBy)?.toString(),
    description: exp.description || null,
    amount: exp.amount,
    split_type: exp.splitType,
    participants: (exp.participants || []).map((p) => ({
      user_id: (p.user?._id || p.user)?.toString(),
      share_amount: p.share,
      user: p.user && typeof p.user === 'object' && p.user.name
        ? { id: p.user._id.toString(), name: p.user.name, email: p.user.email }
        : undefined,
    })),
    created_at: exp.createdAt?.toISOString(),
  };
}

// List expenses for a group
exports.getExpenses = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name email')
      .populate('participants.user', 'name email')
      .sort({ createdAt: -1 });

    res.json(expenses.map(formatExpense));
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create expense with splits
exports.createExpense = async (req, res) => {
  try {
    // Accept groupId from URL params (nested route) or from request body (legacy)
    const group = req.params.groupId || req.body.group;
    const { paidBy, amount, splitType, participants, description } = req.body;

    // Validate required fields
    if (!group || !paidBy || !amount || !splitType || !participants) {
      return res.status(400).json({ 
        message: 'group, paidBy, amount, splitType, and participants are required' 
      });
    }

    // Validate group exists
    const groupDoc = await Group.findById(group);
    if (!groupDoc) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Validate paidBy is group member
    if (!groupDoc.members.map(id => id.toString()).includes(paidBy)) {
      return res.status(400).json({ message: 'Payer must be a group member' });
    }

    // Validate all participants are group members
    const participantIds = participants.map(p => 
      typeof p === 'object' ? p.user.toString() : p.toString()
    );
    
    for (const participantId of participantIds) {
      if (!groupDoc.members.map(id => id.toString()).includes(participantId)) {
        return res.status(400).json({ message: 'All participants must be group members' });
      }
    }

    // Process participants based on split type
    let processedParticipants = [];
    
    if (splitType === 'equal') {
      // Equal split: divide amount equally
      const share = amount / participants.length;
      processedParticipants = participants.map(userId => ({
        user: typeof userId === 'object' ? userId.user || userId : userId,
        share: Math.round(share * 100) / 100 // Round to 2 decimals
      }));
    } else if (splitType === 'exact') {
      // Exact split: validate shares sum to amount
      const totalShare = participants.reduce((sum, p) => sum + p.share, 0);
      if (Math.abs(totalShare - amount) > 0.01) {
        return res.status(400).json({ 
          message: `Shares must sum to amount. Got ${totalShare}, expected ${amount}` 
        });
      }
      processedParticipants = participants;
    } else if (splitType === 'percentage') {
      // Percentage split: convert to amounts
      const totalPercentage = participants.reduce((sum, p) => sum + p.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        return res.status(400).json({ 
          message: 'Percentages must sum to 100' 
        });
      }
      processedParticipants = participants.map(p => ({
        user: p.user,
        share: Math.round((amount * p.percentage / 100) * 100) / 100
      }));
    } else {
      return res.status(400).json({ message: 'Invalid splitType. Must be equal, exact, or percentage' });
    }

    // Create expense
    const expense = new Expense({
      group,
      paidBy,
      amount,
      splitType,
      participants: processedParticipants,
      description
    });

    await expense.save();

    // Update balances for each participant (except payer)
    const notifications = [];
    
    for (const participant of processedParticipants) {
      if (participant.user.toString() !== paidBy.toString() && participant.share > 0) {
        // Participant owes the payer
        await updateBalance(participant.user, paidBy, participant.share);
        
        // Prepare notification
        notifications.push({
          userId: participant.user,
          message: `You owe ₹${participant.share.toFixed(2)} for: ${description || 'an expense'}`
        });
      }
    }

    // Create notifications
    for (const notif of notifications) {
      await createNotification(notif.userId, notif.message);
    }

    res.status(201).json(formatExpense(expense));
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
