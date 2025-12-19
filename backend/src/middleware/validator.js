const { body, param, validationResult } = require('express-validator');

// Validation middleware to check for errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const userValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    validate,
  ],
  update: [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().trim(),
    validate,
  ],
};

// Group validation rules
const groupValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Group name is required'),
    body('description').optional().trim(),
    body('members').isArray({ min: 2 }).withMessage('At least 2 members required'),
    body('createdBy').notEmpty().withMessage('Creator ID is required'),
    validate,
  ],
  addMember: [
    body('userId').notEmpty().withMessage('User ID is required'),
    validate,
  ],
  removeMember: [
    body('userId').notEmpty().withMessage('User ID is required'),
    validate,
  ],
};

// Expense validation rules
const expenseValidation = {
  create: [
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('paidBy').notEmpty().withMessage('Payer ID is required'),
    body('group').notEmpty().withMessage('Group ID is required'),
    body('splitType').isIn(['EQUAL', 'EXACT', 'PERCENTAGE']).withMessage('Invalid split type'),
    body('splits').isArray({ min: 1 }).withMessage('At least one split required'),
    body('category').optional().trim(),
    validate,
  ],
  update: [
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().trim(),
    validate,
  ],
};

// Settlement validation rules
const settlementValidation = {
  create: [
    body('group').notEmpty().withMessage('Group ID is required'),
    body('paidBy').notEmpty().withMessage('Payer ID is required'),
    body('paidTo').notEmpty().withMessage('Payee ID is required'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
    body('note').optional().trim(),
    validate,
  ],
};

module.exports = {
  userValidation,
  groupValidation,
  expenseValidation,
  settlementValidation,
};
