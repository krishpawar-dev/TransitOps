const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { getPagination, buildPaginationMeta } = require('../utils/queryHelpers');

router.use(protect);

// GET /api/users - Fleet Manager only
router.get('/', authorize('Fleet Manager'), async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);
    return new ApiResponse(200, 'Users fetched', users, buildPaginationMeta(total, page, limit)).send(res);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/:id/role - Fleet Manager only
router.put('/:id/role', authorize('Fleet Manager'), async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].includes(role)) {
      return next(new ApiError(400, 'Invalid role'));
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return next(new ApiError(404, 'User not found'));
    return new ApiResponse(200, 'User role updated', user).send(res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
