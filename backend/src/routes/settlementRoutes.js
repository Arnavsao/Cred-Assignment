const express = require('express');
const router = express.Router();
const {
  createSettlement,
  getAllSettlements,
  getSettlementsByGroup,
  getSettlementsByUser,
  settleAllBalances,
} = require('../controllers/settlementController');

// Settlement routes
router.post('/', createSettlement);
router.get('/', getAllSettlements);
router.get('/group/:groupId', getSettlementsByGroup);
router.get('/user/:userId', getSettlementsByUser);
router.post('/group/:groupId/settle-all', settleAllBalances);

module.exports = router;
