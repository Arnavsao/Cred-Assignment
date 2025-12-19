const Expense = require('../models/Expense');
const Group = require('../models/Group');
const Balance = require('../models/Balance');
const BalanceSimplifier = require('../utils/balanceSimplifier');

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, group, splitType, splits, category } = req.body;

    // Verify group exists
    const groupDoc = await Group.findById(group);
    if (!groupDoc) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Verify paidBy is a member of the group
    if (!groupDoc.members.includes(paidBy)) {
      return res.status(400).json({
        success: false,
        message: 'Payer must be a member of the group',
      });
    }

    // Verify all split users are members of the group
    const splitUsers = splits.map(s => s.user);
    const invalidUsers = splitUsers.filter(
      user => !groupDoc.members.some(member => member.toString() === user)
    );

    if (invalidUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'All split users must be members of the group',
      });
    }

    // Create expense
    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      group,
      splitType,
      splits,
      category,
    });

    // Add expense to group
    groupDoc.expenses.push(expense._id);
    await groupDoc.save();

    // Update balances
    await updateGroupBalances(group);

    const populatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .populate('group', 'name');

    res.status(201).json({
      success: true,
      data: populatedExpense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .populate('group', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get expense by ID
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .populate('group', 'name');

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get expenses by group
exports.getExpensesByGroup = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get expenses by user
exports.getExpensesByUser = async (req, res) => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.params.userId },
        { 'splits.user': req.params.userId },
      ],
    })
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .populate('group', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { description, amount, category, splitType, splits, userId } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Check if the user is authorized to edit (only the creator can edit)
    if (expense.paidBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this expense',
      });
    }

    // Update expense fields
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.splitType = splitType || expense.splitType;
    expense.splits = splits || expense.splits;

    await expense.save();

    // Recalculate balances for the group
    await updateGroupBalances(expense.group);

    const updatedExpense = await Expense.findById(expense._id)
      .populate('paidBy', 'name email')
      .populate('splits.user', 'name email')
      .populate('group', 'name');

    res.status(200).json({
      success: true,
      data: updatedExpense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const { userId } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found',
      });
    }

    // Check if the user is authorized to delete (only the creator can delete)
    if (expense.paidBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this expense',
      });
    }

    const groupId = expense.group;

    // Remove expense from group
    await Group.findByIdAndUpdate(groupId, {
      $pull: { expenses: expense._id },
    });

    await expense.deleteOne();

    // Recalculate balances
    await updateGroupBalances(groupId);

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to update group balances
async function updateGroupBalances(groupId) {
  try {
    // Get all expenses for the group
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy')
      .populate('splits.user');

    // Calculate balances from expenses
    const calculatedBalances = BalanceSimplifier.calculateBalancesFromExpenses(expenses);

    // Simplify balances
    const simplifiedBalances = BalanceSimplifier.simplifyBalances(calculatedBalances);

    // Delete existing balances for this group
    await Balance.deleteMany({ group: groupId });

    // Create new simplified balances
    const balanceDocuments = simplifiedBalances.map(balance => ({
      group: groupId,
      user: balance.user,
      owesTo: balance.owesTo,
      amount: balance.amount,
    }));

    if (balanceDocuments.length > 0) {
      await Balance.insertMany(balanceDocuments);
    }
  } catch (error) {
    console.error('Error updating group balances:', error);
    throw error;
  }
}

module.exports.updateGroupBalances = updateGroupBalances;
