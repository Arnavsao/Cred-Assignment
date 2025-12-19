const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owesTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique balance records
balanceSchema.index({ group: 1, user: 1, owesTo: 1 }, { unique: true });

// Prevent self-balances
balanceSchema.pre('save', function(next) {
  if (this.user.equals(this.owesTo)) {
    return next(new Error('User cannot owe themselves'));
  }
  next();
});

module.exports = mongoose.model('Balance', balanceSchema);
