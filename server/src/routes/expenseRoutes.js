const express = require('express');
const router = express.Router();
const {
  getAllExpenses, getExpenseById, createExpense, updateExpense,
  deleteExpense, approveExpense, getOperationalCostSummary
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validateMiddleware');
const { expenseValidators } = require('../validators/fuelExpenseValidators');

router.use(protect);

router.get('/summary/operational-cost', getOperationalCostSummary);

router.route('/')
  .get(getAllExpenses)
  .post(authorize('Fleet Manager', 'Financial Analyst', 'Dispatcher'), expenseValidators, validate, createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(authorize('Fleet Manager', 'Financial Analyst'), updateExpense)
  .delete(authorize('Fleet Manager'), deleteExpense);

router.post('/:id/approve', authorize('Fleet Manager', 'Financial Analyst'), approveExpense);

module.exports = router;
