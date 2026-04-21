const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const { createExpense } = require('./expense.controller');

// All routes are protected
router.use(authMiddleware);

// POST /api/expense/
router.post('/', createExpense);

module.exports = router;
