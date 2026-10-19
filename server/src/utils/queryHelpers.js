/**
 * Build a reusable pagination object from query params.
 * @param {Object} query - Express request.query
 * @returns {{ page, limit, skip }}
 */
const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build pagination metadata for the response.
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

/**
 * Build a sort object from query string.
 * e.g. ?sortBy=createdAt&order=desc
 */
const getSort = (query, allowedFields = []) => {
  const field = allowedFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const order = query.order === 'asc' ? 1 : -1;
  return { [field]: order };
};

/**
 * Build date range filter.
 */
const getDateRangeFilter = (field, from, to) => {
  const filter = {};
  if (from || to) {
    filter[field] = {};
    if (from) filter[field].$gte = new Date(from);
    if (to) filter[field].$lte = new Date(to);
  }
  return filter;
};

module.exports = { getPagination, buildPaginationMeta, getSort, getDateRangeFilter };
