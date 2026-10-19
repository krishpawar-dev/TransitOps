const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginationMeta, getSort } = require('../utils/queryHelpers');

/**
 * GET /api/expenses
 */
const getAllExpenses = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, ['date', 'amount', 'category', 'createdAt']);

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.vehicle) filter.vehicle = req.query.vehicle;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }
    if (req.query.search) {
      filter.$or = [{ description: new RegExp(req.query.search, 'i') }];
    }

    const [expenses, total, aggregation] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(limit)
        .populate('vehicle', 'registrationNumber vehicleName')
        .populate('loggedBy', 'name')
        .populate('approvedBy', 'name'),
      Expense.countDocuments(filter),
      Expense.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    const totalAmount = aggregation.reduce((s, a) => s + a.total, 0);
    const byCategory = aggregation.map((a) => ({ category: a._id, total: a.total, count: a.count }));

    return new ApiResponse(
      200,
      'Expenses fetched',
      { expenses, summary: { total: totalAmount, byCategory } },
      buildPaginationMeta(total, page, limit)
    ).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/expenses/:id
 */
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('vehicle', 'registrationNumber vehicleName')
      .populate('loggedBy', 'name')
      .populate('approvedBy', 'name');
    if (!expense) return next(new ApiError(404, 'Expense not found'));
    return new ApiResponse(200, 'Expense fetched', expense).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/expenses
 */
const createExpense = async (req, res, next) => {
  try {
    if (req.body.vehicle) {
      const vehicle = await Vehicle.findById(req.body.vehicle);
      if (!vehicle) return next(new ApiError(404, 'Vehicle not found'));
    }

    const expense = await Expense.create({ ...req.body, loggedBy: req.user._id });
    const populated = await expense.populate('vehicle', 'registrationNumber vehicleName');
    return new ApiResponse(201, 'Expense recorded', populated).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/expenses/:id
 */
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('vehicle', 'registrationNumber vehicleName');
    if (!expense) return next(new ApiError(404, 'Expense not found'));
    return new ApiResponse(200, 'Expense updated', expense).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return next(new ApiError(404, 'Expense not found'));
    return new ApiResponse(200, 'Expense deleted').send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/expenses/:id/approve
 */
const approveExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved', approvedBy: req.user._id },
      { new: true }
    );
    if (!expense) return next(new ApiError(404, 'Expense not found'));
    return new ApiResponse(200, 'Expense approved', expense).send(res);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/expenses/summary/operational-cost — Total operational cost by category
 */
const getOperationalCostSummary = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to) filter.date.$lte = new Date(req.query.to);
    }

    const results = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    const total = results.reduce((s, r) => s + r.total, 0);
    return new ApiResponse(200, 'Operational cost summary', { total, byCategory: results }).send(res);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense, approveExpense, getOperationalCostSummary };
