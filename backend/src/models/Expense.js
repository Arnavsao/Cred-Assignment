const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
  },
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Expense description is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  splitType: {
    type: String,
    enum: ['EQUAL', 'EXACT', 'PERCENTAGE'],
    required: true,
  },
  splits: [splitSchema],
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
}, {
  timestamps: true,
});

// Validate splits based on split type
expenseSchema.pre('save', function(next) {
  const expense = this;

  // Check if splits array exists and has members
  if (!expense.splits || expense.splits.length === 0) {
    return next(new Error('Splits cannot be empty'));
  }

  if (expense.splitType === 'EQUAL') {
    // For equal split, all amounts should be equal
    const equalAmount = expense.amount / expense.splits.length;
    expense.splits.forEach(split => {
      split.amount = parseFloat(equalAmount.toFixed(2));
    });
  } else if (expense.splitType === 'EXACT') {
    // For exact split, sum of splits should equal total amount
    const totalSplit = expense.splits.reduce((sum, split) => sum + split.amount, 0);
    if (Math.abs(totalSplit - expense.amount) > 0.01) {
      return next(new Error('Sum of exact splits must equal total amount'));
    }
  } else if (expense.splitType === 'PERCENTAGE') {
    // For percentage split, percentages should sum to 100
    const totalPercentage = expense.splits.reduce((sum, split) => sum + (split.percentage || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return next(new Error('Sum of percentages must equal 100'));
    }
    // Calculate amounts based on percentages
    expense.splits.forEach(split => {
      split.amount = parseFloat((expense.amount * split.percentage / 100).toFixed(2));
    });
  }

  next();
});

module.exports = mongoose.model('Expense', expenseSchema);
