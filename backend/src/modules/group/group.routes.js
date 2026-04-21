const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { createGroup, getGroups, getGroup, addMember, removeMember } = require('./group.controller');
const { createExpense, getExpenses } = require('../expense/expense.controller');

// All routes are protected
router.use(authMiddleware);

// GET /api/groups/
router.get('/', getGroups);

// GET /api/groups/:groupId
router.get('/:groupId', getGroup);

// POST /api/groups/
router.post('/', createGroup);

// POST /api/groups/:groupId/members
router.post('/:groupId/members', addMember);

// DELETE /api/groups/:groupId/members/:userId
router.delete('/:groupId/members/:userId', removeMember);

// POST /api/groups/:groupId/expenses
router.post('/:groupId/expenses', createExpense);

// GET /api/groups/:groupId/expenses
router.get('/:groupId/expenses', getExpenses);

module.exports = router;
