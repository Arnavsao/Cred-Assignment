const Group = require('../models/Group');
const User = require('../models/User');
const Balance = require('../models/Balance');

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, members, createdBy } = req.body;

    // Validate members array
    if (!members || members.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'A group must have at least 2 members',
      });
    }

    // Verify all members exist
    const users = await User.find({ _id: { $in: members } });
    if (users.length !== members.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more users not found',
      });
    }

    // Create group
    const group = await Group.create({
      name,
      description,
      members,
      createdBy,
    });

    // Add group reference to all members
    await User.updateMany(
      { _id: { $in: members } },
      { $push: { groups: group._id } }
    );

    const populatedGroup = await Group.findById(group._id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedGroup,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all groups
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .populate('expenses');

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .populate({
        path: 'expenses',
        populate: {
          path: 'paidBy splits.user',
          select: 'name email',
        },
      });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get groups for a specific user
exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.userId })
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add member to group
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this group',
      });
    }

    // Add member
    group.members.push(userId);
    await group.save();

    // Add group to user's groups
    user.groups.push(groupId);
    await user.save();

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove member from group
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if removing this member would leave less than 2 members
    if (group.members.length <= 2) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove member. Group must have at least 2 members',
      });
    }

    // Check if user has any unsettled balances
    const balances = await Balance.find({
      group: groupId,
      $or: [{ user: userId }, { owesTo: userId }],
      amount: { $gt: 0 },
    });

    if (balances.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove member with unsettled balances',
      });
    }

    // Remove member
    group.members = group.members.filter(
      member => member.toString() !== userId
    );
    await group.save();

    // Remove group from user's groups
    await User.findByIdAndUpdate(userId, {
      $pull: { groups: groupId },
    });

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete group
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Remove group from all members
    await User.updateMany(
      { _id: { $in: group.members } },
      { $pull: { groups: group._id } }
    );

    // Delete all balances for this group
    await Balance.deleteMany({ group: group._id });

    await group.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Group deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
