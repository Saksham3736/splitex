const Group = require('./group.model');
const User = require('../auth/auth.model');

// Helper to format a group document for the frontend
function formatGroup(group) {
  const members = (group.members || []).map((m) => {
    // m can be a populated User doc or a plain ObjectId
    if (m && typeof m === 'object' && m.name) {
      return {
        user_id: m._id.toString(),
        role: group.createdBy?.toString() === m._id.toString() ? 'admin' : 'member',
        status: 'active',
        user: {
          id: m._id.toString(),
          name: m.name,
          email: m.email || undefined,
          upi_id: m.upiId || null,
        },
      };
    }
    // Not populated – just an ObjectId
    const id = m.toString();
    return {
      user_id: id,
      role: group.createdBy?.toString() === id ? 'admin' : 'member',
      status: 'active',
    };
  });

  return {
    id: group._id.toString(),
    name: group.name,
    description: group.description || null,
    created_by: group.createdBy?.toString(),
    group_type: group.groupType || null,
    members,
    created_at: group.createdAt?.toISOString(),
  };
}

// List groups the authenticated user belongs to
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'name email upiId')
      .sort({ createdAt: -1 });

    res.json(groups.map(formatGroup));
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single group by ID
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('members', 'name email upiId');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(formatGroup(group));
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    // Start with creator, add any extra members provided by frontend
    const memberSet = new Set([req.user._id.toString()]);
    if (Array.isArray(members)) {
      members.forEach((id) => memberSet.add(id.toString()));
    }

    const group = new Group({
      name,
      createdBy: req.user._id,
      members: [...memberSet]
    });

    await group.save();

    // Re-fetch with populated members so the response matches frontend shape
    const populated = await Group.findById(group._id)
      .populate('members', 'name email upiId');

    res.status(201).json(formatGroup(populated));
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add member to group (creator only)
exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is creator
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only group creator can add members' });
    }

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    group.members.push(userId);
    await group.save();

    res.json({
      message: 'Member added successfully',
      members: group.members
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove member from group (creator only)
exports.removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if requester is creator
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only group creator can remove members' });
    }

    // Cannot remove the creator
    if (group.createdBy.toString() === userId) {
      return res.status(400).json({ message: 'Cannot remove group creator' });
    }

    // Remove member
    group.members = group.members.filter(
      memberId => memberId.toString() !== userId
    );

    await group.save();

    res.json({
      message: 'Member removed successfully',
      members: group.members
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
