const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
  }],
}, {
  timestamps: true,
});

// Ensure at least 2 members in a group
groupSchema.pre('save', function(next) {
  if (this.members.length < 2) {
    next(new Error('A group must have at least 2 members'));
  }
  next();
});

module.exports = mongoose.model('Group', groupSchema);
