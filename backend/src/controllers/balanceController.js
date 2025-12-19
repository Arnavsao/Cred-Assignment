const Balance = require('../models/Balance');
const Group = require('../models/Group');

// Get all balances
exports.getAllBalances = async (req, res) => {
  try {
    const balances = await Balance.find()
      .populate('user', 'name email')
      .populate('owesTo', 'name email')
      .populate('group', 'name');

    res.status(200).json({
      success: true,
      count: balances.length,
      data: balances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get balances for a specific group
exports.getBalancesByGroup = async (req, res) => {
  try {
    const balances = await Balance.find({ group: req.params.groupId })
      .populate('user', 'name email')
      .populate('owesTo', 'name email');

    res.status(200).json({
      success: true,
      count: balances.length,
      data: balances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get balances for a specific user
exports.getBalancesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get balances where user owes others
    const owesBalances = await Balance.find({ user: userId })
      .populate('owesTo', 'name email')
      .populate('group', 'name');

    // Get balances where others owe user
    const owedBalances = await Balance.find({ owesTo: userId })
      .populate('user', 'name email')
      .populate('group', 'name');

    // Calculate summary
    const totalOwes = owesBalances.reduce((sum, b) => sum + b.amount, 0);
    const totalOwed = owedBalances.reduce((sum, b) => sum + b.amount, 0);
    const netBalance = totalOwed - totalOwes;

    res.status(200).json({
      success: true,
      data: {
        owes: owesBalances,
        owed: owedBalances,
        summary: {
          totalOwes: parseFloat(totalOwes.toFixed(2)),
          totalOwed: parseFloat(totalOwed.toFixed(2)),
          netBalance: parseFloat(netBalance.toFixed(2)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user balance in a specific group
exports.getUserBalanceInGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.params;

    // Verify group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Verify user is a member
    if (!group.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is not a member of this group',
      });
    }

    // Get balances where user owes others
    const owesBalances = await Balance.find({
      group: groupId,
      user: userId
    }).populate('owesTo', 'name email');

    // Get balances where others owe user
    const owedBalances = await Balance.find({
      group: groupId,
      owesTo: userId
    }).populate('user', 'name email');

    // Calculate totals
    const totalOwes = owesBalances.reduce((sum, b) => sum + b.amount, 0);
    const totalOwed = owedBalances.reduce((sum, b) => sum + b.amount, 0);
    const netBalance = totalOwed - totalOwes;

    res.status(200).json({
      success: true,
      data: {
        group: group.name,
        owes: owesBalances,
        owed: owedBalances,
        summary: {
          totalOwes: parseFloat(totalOwes.toFixed(2)),
          totalOwed: parseFloat(totalOwed.toFixed(2)),
          netBalance: parseFloat(netBalance.toFixed(2)),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
