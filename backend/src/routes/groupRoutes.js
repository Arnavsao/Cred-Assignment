const express = require('express');
const router = express.Router();
const {
  createGroup,
  getAllGroups,
  getGroupById,
  getUserGroups,
  addMember,
  removeMember,
  deleteGroup,
} = require('../controllers/groupController');

// Group routes
router.post('/', createGroup);
router.get('/', getAllGroups);
router.get('/:id', getGroupById);
router.get('/user/:userId', getUserGroups);
router.post('/:id/members', addMember);
router.delete('/:id/members', removeMember);
router.delete('/:id', deleteGroup);

module.exports = router;
