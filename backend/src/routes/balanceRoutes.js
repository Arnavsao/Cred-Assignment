const express = require('express');
const router = express.Router();
const {
  getAllBalances,
  getBalancesByGroup,
  getBalancesByUser,
  getUserBalanceInGroup,
} = require('../controllers/balanceController');

// Balance routes
router.get('/', getAllBalances);
router.get('/group/:groupId', getBalancesByGroup);
router.get('/user/:userId', getBalancesByUser);
router.get('/user/:userId/group/:groupId', getUserBalanceInGroup);

module.exports = router;
