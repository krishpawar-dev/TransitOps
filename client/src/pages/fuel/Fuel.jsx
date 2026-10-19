import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdEdit, MdDelete, MdLocalGasStation, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { Input, Select } from '../../components/common/Input';
import { fuelLogs as fuelData, fuelTrendData, vehicles } from '../../services/data';
import { filterBySearch, paginate, sortData, formatCurrency } from '../../utils/helpers';
import '../vehicles/Vehicles.css';
import './Fuel.css';

const PER_PAGE = 8;

const emptyForm = { vehicle: '', vehicleName: '', liters: '', cost: '', mileage: '', date: '', station: '', odometer: '' };

const StatCard = ({ label, value, icon, trend, color }) => (
  <motion.div className="fuel-stat-card" whileHover={{ y: -3 }}>
    <div className={`fuel-stat-icon fuel-stat-icon-${color}`}>{icon}</div>
    <div className="fuel-stat-val">{value}</div>
    <div className="fuel-stat-label">{label}</div>
    {trend !== undefined && (
      <div className={`fuel-stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
        {trend >= 0 ? <MdTrendingUp size={14} /> : <MdTrendingDown size={14} />}
        {Math.abs(trend)}% vs last month
      </div>
    )}
  </motion.div>
);

const Fuel = () => {
  const [data, setData] = useState(fuelData);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const d = filterBySearch(data, search, ['vehicle', 'vehicleName', 'station']);
    return sortData(d, sortKey, sortDir);
  }, [data, search, sortKey, sortDir]);

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
    else setData(d => [...d, { ...form, id: d.length + 1 }]);
    setModalOpen(false);
  };

  const handleDelete = () => {
    setData(d => d.filter(v => v.id !== deleteItem.id));
    setDeleteModalOpen(false);
  };

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const vehicleOpts = vehicles.map(v => ({ value: v.reg, label: `${v.reg} – ${v.name}` }));

  const totalLiters = data.reduce((s, m) => s + Number(m.liters), 0);
  const totalCost = data.reduce((s, m) => s + Number(m.cost), 0);
  const avgMileage = (data.reduce((s, m) => s + Number(m.mileage), 0) / data.length).toFixed(1);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fuel Logs</h1>
          <p className="page-subtitle">Track fuel consumption and costs</p>
        </div>
        <Button icon={<MdAdd />} onClick={openAdd} id="add-fuel-btn">Add Fuel Log</Button>
      </div>

      {/* Stats */}
      <div className="fuel-stats-grid">
        <StatCard label="Total Fuel (This Period)" value={`${totalLiters.toLocaleString()} L`} icon={<MdLocalGasStation />} color="primary" trend={-8} />
        <StatCard label="Total Fuel Cost" value={formatCurrency(totalCost)} icon={<MdLocalGasStation />} color="warning" trend={-8} />
        <StatCard label="Avg. Mileage" value={`${avgMileage} km/L`} icon={<MdTrendingUp />} color="success" trend={3} />
        <StatCard label="Fuel Entries" value={data.length} icon={<MdLocalGasStation />} color="info" />
      </div>

      {/* Charts */}
      <div className="fuel-charts">
        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Monthly Fuel Trend (Liters)</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={fuelTrendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="liters" name="Liters" stroke="#2563EB" fill="url(#fuelGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-header">
            <h3 className="card-title">Monthly Cost (₹)</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={fuelTrendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => [formatCurrency(v), 'Cost']} />
                <Bar dataKey="cost" name="Cost" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Table */}
      <motion.div className="card" style={{ marginTop: 16 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="table-toolbar">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search fuel logs..." />
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {[['date', 'Date'], ['vehicleName', 'Vehicle'], ['liters', 'Liters'], ['cost', 'Cost (₹)'], ['mileage', 'Mileage'], ['station', 'Station'], ['odometer', 'Odometer']].map(([k, l]) => (
                  <th key={k} onClick={() => handleSort(k)} className="sortable">{l} <SortIcon col={k} /></th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8}><EmptyState title="No fuel logs found" /></td></tr>
              ) : paginated.map(m => (
                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td>{m.date}</td>
                  <td>
                    <div className="cell-primary">{m.vehicleName}</div>
                    <div className="cell-secondary mono-text">{m.vehicle}</div>
                  </td>
                  <td className="cell-primary">{m.liters} L</td>
                  <td className="cell-primary">₹{Number(m.cost).toLocaleString()}</td>
                  <td>
                    <span className={`mileage-tag ${m.mileage >= 10 ? 'good' : 'bad'}`}>{m.mileage} km/L</span>
                  </td>
                  <td className="text-secondary">{m.station}</td>
                  <td>{Number(m.odometer).toLocaleString()} km</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEdit(m)} title="Edit"><MdEdit size={16} /></button>
                      <button className="action-btn delete" onClick={() => openDelete(m)} title="Delete"><MdDelete size={16} /></button>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Fuel Log' : 'Add Fuel Log'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>{editItem ? 'Save Changes' : 'Add Log'}</Button></>}>
        <div className="form-grid">
          <Select label="Vehicle" value={form.vehicle} onChange={f('vehicle')} options={vehicleOpts} className="full-width" />
          <Input label="Liters" type="number" value={form.liters} onChange={f('liters')} required />
          <Input label="Cost (₹)" type="number" value={form.cost} onChange={f('cost')} required />
          <Input label="Mileage (km/L)" type="number" value={form.mileage} onChange={f('mileage')} />
          <Input label="Odometer (km)" type="number" value={form.odometer} onChange={f('odometer')} />
          <Input label="Date" type="date" value={form.date} onChange={f('date')} required />
          <Input label="Fuel Station" value={form.station} onChange={f('station')} className="full-width" />
        </div>
      </Modal>

      {/* Delete */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Fuel Log" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}>
        <div className="confirm-msg">
          <p>Delete fuel log for <strong>{deleteItem?.vehicleName}</strong> on {deleteItem?.date}?</p>
        </div>
      </Modal>
    </div>
  );
};

export default Fuel;
