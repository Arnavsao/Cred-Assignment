const express = require('express');
const router = express.Router();
const {
  createExpense,
  getAllExpenses,
  getExpenseById,
  getExpensesByGroup,
  getExpensesByUser,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

// Expense routes
router.post('/', createExpense);
router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);
router.get('/group/:groupId', getExpensesByGroup);
router.get('/user/:userId', getExpensesByUser);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
