import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdEdit, MdDelete, MdAccountBalance, MdLocalGasStation, MdBuild, MdPeople, MdDirectionsCar } from 'react-icons/md';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { Input, Select, Textarea } from '../../components/common/Input';
import { expenses as expensesData, expenseTrendData } from '../../services/data';
import { getStatusColor, filterBySearch, paginate, sortData, formatCurrency, formatCurrencyFull } from '../../utils/helpers';
import '../vehicles/Vehicles.css';
import './Expense.css';

const PER_PAGE = 8;
const CATEGORIES = ['All', 'Fuel', 'Maintenance', 'Driver Salary', 'Toll', 'Insurance', 'Tyre', 'Repairs', 'Permit'];

const catIcons = {
  Fuel: <MdLocalGasStation />, Maintenance: <MdBuild />, 'Driver Salary': <MdPeople />,
  Insurance: <MdAccountBalance />, Tyre: <MdDirectionsCar />, default: <MdAccountBalance />
};

const catColors = ['#2563EB', '#F59E0B', '#22C55E', '#06B6D4', '#EF4444', '#8B5CF6', '#EC4899', '#F97316'];

const emptyForm = { category: '', amount: '', date: '', description: '', vehicle: '', status: 'Pending' };

const Expense = () => {
  const [data, setData] = useState(expensesData);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    let d = filterBySearch(data, search, ['category', 'description', 'vehicle']);
    if (catFilter !== 'All') d = d.filter(v => v.category === catFilter);
    return sortData(d, sortKey, sortDir);
  }, [data, search, catFilter, sortKey, sortDir]);

  const paginated = paginate(filtered, page, PER_PAGE);

  const handleSort = (k) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => (
    <span className={`sort-icon ${sortKey === col ? 'active' : ''}`}>
      {sortKey === col && sortDir === 'desc' ? '↓' : '↑'}
    </span>
  );

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (v) => { setEditItem(v); setForm({ ...v }); setModalOpen(true); };
  const openDelete = (v) => { setDeleteItem(v); setDeleteModalOpen(true); };

  const handleSave = () => {
    if (editItem) setData(d => d.map(v => v.id === editItem.id ? { ...v, ...form } : v));
    else setData(d => [...d, { ...form, id: d.length + 1, amount: Number(form.amount) }]);
    setModalOpen(false);
  };

  const handleDelete = () => {
    setData(d => d.filter(v => v.id !== deleteItem.id));
    setDeleteModalOpen(false);
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const total = data.reduce((s, e) => s + Number(e.amount), 0);
  const approved = data.filter(e => e.status === 'Approved').reduce((s, e) => s + Number(e.amount), 0);
  const pending = data.filter(e => e.status === 'Pending').reduce((s, e) => s + Number(e.amount), 0);

  // Pie data by category
  const pieData = Object.entries(
    data.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + Number(e.amount); return acc; }, {})
  ).map(([name, value], i) => ({ name, value, color: catColors[i % catColors.length] }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Financial overview & expense management</p>
        </div>
        <Button icon={<MdAdd />} onClick={openAdd} id="add-expense-btn">Add Expense</Button>
      </div>

      {/* Summary Cards */}
      <div className="expense-summary">
        {[
          { label: 'Total Expenses', val: formatCurrencyFull(total), color: 'primary', icon: <MdAccountBalance /> },
          { label: 'Approved', val: formatCurrencyFull(approved), color: 'success', icon: <MdAccountBalance /> },
          { label: 'Pending Approval', val: formatCurrencyFull(pending), color: 'warning', icon: <MdAccountBalance /> },
          { label: 'Expense Count', val: data.length, color: 'info', icon: <MdAccountBalance /> },
        ].map(c => (
          <motion.div key={c.label} className={`expense-summary-card expense-summary-card-${c.color}`} whileHover={{ y: -3 }}>
            <div className={`expense-summary-icon expense-summary-icon-${c.color}`}>{c.icon}</div>
            <div className="expense-summary-val">{c.val}</div>
            <div className="expense-summary-label">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="expense-charts">
        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Expense by Category</h3>
          </div>
          <div className="card-body expense-pie-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [formatCurrencyFull(v), 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="expense-pie-legend">
              {pieData.map(d => (
                <div key={d.name} className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ background: d.color }} />
                  <span className="pie-legend-name">{d.name}</span>
                  <span className="pie-legend-val">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-header">
            <h3 className="card-title">Monthly Expense Trend</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={expenseTrendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => [formatCurrencyFull(v)]} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="fuel" name="Fuel" fill="#2563EB" radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="maintenance" name="Maint." fill="#F59E0B" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="toll" name="Toll" fill="#22C55E" radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Table */}
      <motion.div className="card" style={{ marginTop: 16 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="table-toolbar">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search expenses..." />
          <div className="table-filters" style={{ flexWrap: 'wrap' }}>
            {CATEGORIES.slice(0, 6).map(s => (
              <button key={s} className={`filter-chip ${catFilter === s ? 'active' : ''}`} onClick={() => { setCatFilter(s); setPage(1); }}>{s}</button>
            ))}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {[['category', 'Category'], ['amount', 'Amount'], ['date', 'Date'], ['description', 'Description'], ['vehicle', 'Vehicle'], ['status', 'Status']].map(([k, l]) => (
                  <th key={k} onClick={() => handleSort(k)} className="sortable">{l} <SortIcon col={k} /></th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7}><EmptyState title="No expense records" /></td></tr>
              ) : paginated.map(e => (
                <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td>
                    <div className="expense-cat-cell">
                      <span className="expense-cat-icon">{catIcons[e.category] || catIcons.default}</span>
                      {e.category}
                    </div>
                  </td>
                  <td className="cell-primary">₹{Number(e.amount).toLocaleString()}</td>
                  <td>{e.date}</td>
                  <td className="text-secondary">{e.description}</td>
                  <td className="mono-text">{e.vehicle}</td>
                  <td><Badge variant={getStatusColor(e.status)}>{e.status}</Badge></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEdit(e)} title="Edit"><MdEdit size={16} /></button>
                      <button className="action-btn delete" onClick={() => openDelete(e)} title="Delete"><MdDelete size={16} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalItems={filtered.length} perPage={PER_PAGE} onPageChange={setPage} />
      </motion.div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Expense' : 'Add Expense'} size="md"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>{editItem ? 'Save Changes' : 'Add Expense'}</Button></>}>
        <div className="form-grid">
          <Select label="Category" value={form.category} onChange={f('category')} options={CATEGORIES.filter(c => c !== 'All').map(c => ({ value: c, label: c }))} required className="full-width" />
          <Input label="Amount (₹)" type="number" value={form.amount} onChange={f('amount')} required />
          <Input label="Date" type="date" value={form.date} onChange={f('date')} required />
          <Input label="Vehicle (if applicable)" value={form.vehicle} onChange={f('vehicle')} />
          <Select label="Status" value={form.status} onChange={f('status')} options={[{ value: 'Pending', label: 'Pending' }, { value: 'Approved', label: 'Approved' }]} />
          <Textarea label="Description" value={form.description} onChange={f('description')} rows={2} className="full-width" />
        </div>
      </Modal>

      {/* Delete */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Expense" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}>
        <div className="confirm-msg">
          <p>Delete <strong>{deleteItem?.category}</strong> expense of ₹{Number(deleteItem?.amount).toLocaleString()}?</p>
        </div>
      </Modal>
    </div>
  );
};

export default Expense;
