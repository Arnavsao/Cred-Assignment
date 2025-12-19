const Settlement = require('../models/Settlement');
const Balance = require('../models/Balance');
const Group = require('../models/Group');
const { updateGroupBalances } = require('./expenseController');

// Create a new settlement
exports.createSettlement = async (req, res) => {
  try {
    const { group, paidBy, paidTo, amount, note } = req.body;

    // Verify group exists
    const groupDoc = await Group.findById(group);
    if (!groupDoc) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Verify both users are members
    if (!groupDoc.members.includes(paidBy) || !groupDoc.members.includes(paidTo)) {
      return res.status(400).json({
        success: false,
        message: 'Both users must be members of the group',
      });
    }

    // Verify paidBy actually owes paidTo
    const balance = await Balance.findOne({
      group,
      user: paidBy,
      owesTo: paidTo,
    });

    if (!balance) {
      return res.status(400).json({
        success: false,
        message: 'No balance found between these users',
      });
    }

    if (amount > balance.amount) {
      return res.status(400).json({
        success: false,
        message: `Settlement amount cannot exceed owed amount of ${balance.amount}`,
      });
    }

    // Create settlement record
    const settlement = await Settlement.create({
      group,
      paidBy,
      paidTo,
      amount,
      note,
    });

    // Update balance
    if (amount >= balance.amount) {
      // Fully settled
      await Balance.findByIdAndDelete(balance._id);
    } else {
      // Partially settled
      balance.amount -= amount;
      await balance.save();
    }

    const populatedSettlement = await Settlement.findById(settlement._id)
      .populate('paidBy', 'name email')
      .populate('paidTo', 'name email')
      .populate('group', 'name');

    res.status(201).json({
      success: true,
      data: populatedSettlement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all settlements
exports.getAllSettlements = async (req, res) => {
  try {
    const settlements = await Settlement.find()
      .populate('paidBy', 'name email')
      .populate('paidTo', 'name email')
      .populate('group', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: settlements.length,
      data: settlements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get settlements by group
exports.getSettlementsByGroup = async (req, res) => {
  try {
    const settlements = await Settlement.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('paidTo', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: settlements.length,
      data: settlements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get settlements by user
exports.getSettlementsByUser = async (req, res) => {
  try {
    const settlements = await Settlement.find({
      $or: [
        { paidBy: req.params.userId },
        { paidTo: req.params.userId },
      ],
    })
      .populate('paidBy', 'name email')
      .populate('paidTo', 'name email')
      .populate('group', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: settlements.length,
      data: settlements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Settle all balances in a group
exports.settleAllBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Delete all balances for this group
    await Balance.deleteMany({ group: groupId });

    res.status(200).json({
      success: true,
      message: 'All balances settled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
