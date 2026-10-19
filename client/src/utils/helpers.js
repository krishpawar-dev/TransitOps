// Utility: Format currency (INR)
export const formatCurrency = (amount) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

// Utility: Format full currency
export const formatCurrencyFull = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// Utility: Format date
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Utility: Get status color class
export const getStatusColor = (status) => {
  const map = {
    Active: 'success',
    Completed: 'success',
    Available: 'info',
    'In Transit': 'primary',
    'In Progress': 'primary',
    Scheduled: 'warning',
    Idle: 'warning',
    Pending: 'warning',
    Maintenance: 'danger',
    Cancelled: 'danger',
    Suspended: 'danger',
    Leave: 'warning',
    'On Duty': 'success',
  };
  return map[status] || 'default';
};

// Utility: Get priority color
export const getPriorityColor = (priority) => {
  const map = { Low: 'success', Medium: 'warning', High: 'danger', Critical: 'danger' };
  return map[priority] || 'default';
};

// Utility: Search filter
export const filterBySearch = (data, query, fields) => {
  if (!query) return data;
  const q = query.toLowerCase();
  return data.filter(item =>
    fields.some(f => String(item[f] || '').toLowerCase().includes(q))
  );
};

// Utility: Paginate
export const paginate = (data, page, perPage = 10) => {
  const start = (page - 1) * perPage;
  return data.slice(start, start + perPage);
};

// Utility: Sort data
export const sortData = (data, key, dir) => {
  if (!key) return data;
  return [...data].sort((a, b) => {
    const av = a[key] ?? '';
    const bv = b[key] ?? '';
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
};

// Utility: Generate unique ID
export const genId = () => Math.random().toString(36).substr(2, 9);
